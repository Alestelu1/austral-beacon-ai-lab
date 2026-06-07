from pathlib import Path
import re


CONTENT_DIR = Path(__file__).resolve().parents[1] / "content"


def split_frontmatter(text: str):
    """
    Split an MDX file into frontmatter and body.

    Expected format:
    ---
    key: value
    ---
    markdown body
    """
    if not text.startswith("---"):
        return "", text

    parts = text.split("---", 2)

    if len(parts) < 3:
        return "", text

    frontmatter = parts[1].strip()
    body = parts[2].strip()

    return frontmatter, body


def get_field(frontmatter: str, field: str):
    """
    Extract a simple YAML-like field from frontmatter.

    This is intentionally simple for the first Alura/RAG preparation step.
    Later we can replace this with a real YAML parser.
    """
    pattern = rf"^{field}:\s*[\"']?(.*?)[\"']?\s*$"
    match = re.search(pattern, frontmatter, re.MULTILINE)

    if not match:
        return None

    return match.group(1).strip()


def get_related_entities(frontmatter: str):
    """
    Extract related_entities from a simple YAML list.
    """
    match = re.search(
        r"related_entities:\s*\n((?:\s+-\s+.*\n?)*)",
        frontmatter,
        re.MULTILINE,
    )

    if not match:
        return []

    block = match.group(1)

    return [
        line.replace("-", "").replace('"', "").replace("'", "").strip()
        for line in block.splitlines()
        if line.strip().startswith("-")
    ]


def read_entities():
    """
    Read all MDX entity files from the Atlas content directory.
    """
    if not CONTENT_DIR.exists():
        raise FileNotFoundError(f"Content directory not found: {CONTENT_DIR}")

    entities = []

    for file_path in sorted(CONTENT_DIR.glob("*.mdx")):
        text = file_path.read_text(encoding="utf-8")
        frontmatter, body = split_frontmatter(text)

        entity = {
            "file": file_path.name,
            "id": get_field(frontmatter, "id"),
            "title": get_field(frontmatter, "title"),
            "type": get_field(frontmatter, "type"),
            "region": get_field(frontmatter, "region"),
            "priority": get_field(frontmatter, "priority"),
            "status": get_field(frontmatter, "status"),
            "related_entities": get_related_entities(frontmatter),
            "body_preview": body[:180].replace("\n", " "),
        }

        entities.append(entity)

    return entities


def main():
    entities = read_entities()

    print("\nEnd of the World Atlas — MDX Entity Reader")
    print("=" * 50)
    print(f"Entities found: {len(entities)}\n")

    for entity in entities:
        print(f"File: {entity['file']}")
        print(f"Title: {entity['title']}")
        print(f"ID: {entity['id']}")
        print(f"Type: {entity['type']}")
        print(f"Region: {entity['region']}")
        print(f"Priority: {entity['priority']}")
        print(f"Status: {entity['status']}")
        print(f"Related: {', '.join(entity['related_entities'])}")
        print(f"Preview: {entity['body_preview']}")
        print("-" * 50)


if __name__ == "__main__":
    main()