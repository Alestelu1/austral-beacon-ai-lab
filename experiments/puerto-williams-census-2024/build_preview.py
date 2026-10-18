"""Build an offline research preview from the audited INE GeoPackage (stdlib only)."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import sqlite3
import struct

EXPECTED = 'a813dda3a813c7016042c0fc018ce13291d53823ae2e2467102d54e4db32fe52'
SOURCE = 'https://storage.googleapis.com/bktdescargascenso2024/Cartografia/GPKG/Cartografia_censo2024_R12.zip'


def polygon_geometry(blob):
    """Decode 2D ISO WKB; sample circular arcs with at most one degree per step."""
    if blob[:2] != b'GP' or blob[2] != 0:
        raise ValueError('Unsupported GeoPackage header')
    flags = blob[3]
    envelope = (flags >> 1) & 7
    if flags & 0x30 or envelope not in (0, 1, 2, 3, 4):
        raise ValueError('Empty or extended geometry is unsupported')
    endian = '<' if flags & 1 else '>'
    if struct.unpack_from(endian + 'i', blob, 4)[0] != 4674:
        raise ValueError('Unexpected source CRS')
    offset = 8 + {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[envelope]

    def arc(a, b, c):
        ax, ay = a
        bx, by = b[0]-ax, b[1]-ay
        cx, cy = c[0]-ax, c[1]-ay
        d = 2 * (bx*cy - cx*by)
        if abs(d) < 1e-18:
            return [a, b, c]
        bb, cc = bx*bx+by*by, cx*cx+cy*cy
        ux = ax + (bb*cy-cc*by)/d
        uy = ay + (bx*cc-cx*bb)/d
        angles = [math.atan2(y-uy, x-ux) for x, y in (a, b, c)]
        tau = 2*math.pi
        ccw = (angles[1]-angles[0]) % tau < (angles[2]-angles[0]) % tau
        result = [a]
        radius = math.hypot(ax-ux, ay-uy)
        for start, end, endpoint in [(angles[0],angles[1],b),(angles[1],angles[2],c)]:
            sweep = (end-start) % tau if ccw else -((start-end) % tau)
            n = max(1, math.ceil(abs(sweep)/math.radians(1)))
            result.extend([[ux+radius*math.cos(start+sweep*i/n),uy+radius*math.sin(start+sweep*i/n)] for i in range(1,n)])
            result.append(endpoint)
        return result

    def read_geometry(pos):
        order = '<' if blob[pos] == 1 else '>'
        kind = struct.unpack_from(order + 'I', blob, pos + 1)[0]
        pos += 5
        count = struct.unpack_from(order + 'I', blob, pos)[0]
        pos += 4
        parts = []
        if kind in (6, 12, 10, 9):
            for _ in range(count):
                child, pos = read_geometry(pos)
                if kind == 9:
                    if parts and parts[-1] != child[0]:
                        raise ValueError('Disconnected compound curve')
                    parts.extend(child if not parts else child[1:])
                else:
                    parts.append(child)
        elif kind == 3:
            for _ in range(count):
                size = struct.unpack_from(order + 'I', blob, pos)[0]
                pos += 4
                ring = []
                for _ in range(size):
                    xy = struct.unpack_from(order + 'dd', blob, pos)
                    pos += 16
                    if not all(math.isfinite(v) for v in xy):
                        raise ValueError('Non-finite coordinate')
                    ring.append(list(xy))
                if size < 4 or ring[0] != ring[-1]:
                    raise ValueError('Invalid ring')
                parts.append(ring)
        elif kind in (2, 8):
            for _ in range(count):
                parts.append(list(struct.unpack_from(order + 'dd', blob, pos)))
                pos += 16
            if kind == 8:
                if count < 3 or count % 2 != 1:
                    raise ValueError('Invalid circular string')
                vertices = []
                for i in range(0, count-2, 2):
                    sampled = arc(*parts[i:i+3])
                    vertices.extend(sampled if not vertices else sampled[1:])
                parts = vertices
        else:
            raise ValueError(f'Unsupported WKB type: {kind}')
        return parts, pos

    coordinates, end = read_geometry(offset)
    if end != len(blob):
        raise ValueError('Trailing geometry bytes')
    return coordinates


def build(gpkg, output):
    digest = hashlib.sha256(gpkg.read_bytes()).hexdigest()
    if digest != EXPECTED:
        raise ValueError('Input hash differs from the audited source')
    with sqlite3.connect(f'file:{gpkg.resolve()}?mode=ro', uri=True) as db:
        rows = db.execute("SELECT SHAPE FROM Limite_Urbano_CPV24 WHERE ID_ENTIDAD = 1220102600101 AND ENTIDAD = 'PUERTO WILLIAMS' AND AREA_C = 'URBANO'").fetchall()
    if len(rows) != 1:
        raise ValueError('Selection must return exactly one urban entity')
    polygons = polygon_geometry(rows[0][0])
    points = [p for polygon in polygons for ring in polygon for p in ring]
    for polygon in polygons:
        for ring in polygon:
            if len(ring) < 4 or ring[0] != ring[-1]:
                raise ValueError('Open or degenerate output ring')
    if not all(math.isfinite(v) for point in points for v in point):
        raise ValueError('Non-finite output coordinate')
    xmin, xmax = min(p[0] for p in points), max(p[0] for p in points)
    ymin, ymax = min(p[1] for p in points), max(p[1] for p in points)
    if not (-68 < xmin < xmax < -67 and -55 < ymin < ymax < -54):
        raise ValueError('Unexpected Puerto Williams extent')
    coslat = math.cos(math.radians((ymin + ymax) / 2))
    scale = min(820 / ((xmax - xmin) * coslat), 460 / (ymax - ymin))
    def xy(p):
        return (500 + (p[0] - (xmin + xmax) / 2) * coslat * scale,
                280 - (p[1] - (ymin + ymax) / 2) * scale)
    paths = []
    for polygon in polygons:
        pieces = []
        for ring in polygon:
            coords = [xy(p) for p in ring]
            pieces.append('M' + ' L'.join(f'{x:.3f},{y:.3f}' for x, y in coords) + ' Z')
        paths.append('<path d="' + ' '.join(pieces) + '"/>')
    provenance = {
        'status': 'experimental_context_only', 'atlas_ready': False,
        'producer': 'Instituto Nacional de Estadísticas de Chile',
        'dataset': 'Cartografía Censo 2024 — Región 12',
        'source_url': SOURCE, 'source_sha256': digest,
        'layer': 'Limite_Urbano_CPV24', 'ID_ENTIDAD': '1220102600101',
        'source_crs': 'EPSG:4674 — SIRGAS 2000',
        'output': 'SVG with local equirectangular display projection',
        'transformation': 'ISO WKB MultiSurface/CurvePolygon/CompoundCurve decoded; circular arcs sampled at maximum angular step 1 degree in source CRS. Display: x=(lon-midlon)*cos(midlat); y=midlat-lat; uniformly fitted to SVG. No datum conversion or representative point.',
        'license': 'CC BY-SA 4.0',
        'license_url': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'ine_terms': 'https://www.ine.gob.cl/terminos-de-uso-y-licencia-de-datos-abiertos',
        'coordinate_count': len(points), 'polygon_count': len(polygons),
        'bounds_source_crs': [xmin, ymin, xmax, ymax],
    }
    template = Path(__file__).with_name('template.html').read_text()
    html = template.replace('<!-- POLYGONS -->', '\n'.join(paths))
    output.mkdir(parents=True, exist_ok=True)
    (output / 'index.html').write_text(html)
    (output / 'provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(provenance, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('gpkg', type=Path)
    parser.add_argument('--output', type=Path, default=Path(__file__).parent)
    args = parser.parse_args()
    build(args.gpkg, args.output)
