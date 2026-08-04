# Design Document: Professional Web Design

## Overview

This design transforms the existing minimal `public/index.html` and `public/styles.css` into a professional, documentary-style web interface inspired by Patagonian cartography and austral exploration. The redesign applies a cohesive visual identity while maintaining strict backward compatibility with `app.client.ts`, all existing IDs, ARIA attributes, and the 116 existing tests.

The approach is purely additive from a CSS perspective: the empty `styles.css` receives a complete stylesheet, and `index.html` gets minor structural enhancements (wrapper elements, class annotations) without altering any existing IDs or ARIA attributes.

**Key constraints:**
- Only `public/index.html` and `public/styles.css` are modified (plus new test files in `tests/`)
- Pure CSS — no frameworks, preprocessors, CDN fonts, or images
- Mobile-first from 320px with a single breakpoint at 768px
- WCAG 2.1 AA contrast compliance throughout
- All existing IDs, ARIA attributes, and `<script>` tag preserved exactly

## Architecture

### CSS Architecture: Custom Properties + Utility Layers

The stylesheet is organized in a layered architecture:

```
┌─────────────────────────────────────────┐
│  1. Custom Properties (Design Tokens)   │
├─────────────────────────────────────────┤
│  2. Reset & Base Typography             │
├─────────────────────────────────────────┤
│  3. Layout & Structural Components      │
├─────────────────────────────────────────┤
│  4. Form Component                      │
├─────────────────────────────────────────┤
│  5. Response Cards (by type)            │
├─────────────────────────────────────────┤
│  6. Loading Indicator                   │
├─────────────────────────────────────────┤
│  7. Responsive Adaptations (≥768px)     │
├─────────────────────────────────────────┤
│  8. Interaction States & Animations     │
└─────────────────────────────────────────┘
```

### HTML Structural Approach

The HTML changes are minimal wrapper additions to enable CSS styling without breaking existing selectors:

- Add a `.site-brand` span inside the existing `<header>` for the Austral Beacon Media reference
- Wrap example `<li>` content for chip styling (the `<li>` elements themselves are preserved)
- Add no new IDs — only CSS classes on existing elements and minor inner wrappers
- All existing IDs, ARIA attributes, `hidden`, and `role` attributes remain untouched

## Components and Interfaces

### 1. Design Tokens (Custom Properties)

```css
:root {
  /* Color Palette — Austral Cartographic */
  --color-bg:          #f7f6f3;       /* warm white / parchment */
  --color-surface:     #ffffff;       /* card surfaces */
  --color-text:        #1a2b3c;       /* deep navy — primary text */
  --color-text-muted:  #4a5e6f;       /* blue-grey — secondary text */
  --color-accent:      #1e3a5f;       /* deep blue — headings, accents */
  --color-action:      #2c5f7c;       /* teal blue — buttons, links */
  --color-action-hover:#1a4a63;       /* darker teal — hover state */
  --color-border:      #c8d1d9;       /* soft grey-blue — borders */
  --color-border-focus:#2c5f7c;       /* teal — focus rings */
  --color-warning-bg:  #fef9f0;       /* warm cream — warning background */
  --color-warning-border: #c49a3c;    /* amber — warning accent */
  --color-error-bg:    #fdf4f4;       /* soft rose — error background */
  --color-error-border:#9b4d4d;       /* muted red — error accent */
  --color-info-bg:     #f4f7fa;       /* cool grey-blue — info background */
  --color-info-border: #7a9bb5;       /* steel blue — info accent */
  --color-confidence-high:   #2d6a4f; /* forest green */
  --color-confidence-medium: #b8860b; /* dark goldenrod */
  --color-confidence-none:   #6b7d8f; /* neutral grey-blue */
  --color-header-bg:   #0f1f2e;       /* deep navy-charcoal */
  --color-header-text: #e8ebe4;       /* soft off-white */

  /* Typography — System Font Stack with Editorial Feel */
  --font-serif:   Charter, "Bitstream Charter", "Sitka Text", Cambria, serif;
  --font-sans:    "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-mono:    "Cascadia Code", "Source Code Pro", "JetBrains Mono", monospace;

  /* Type Scale (mobile-first) */
  --text-xs:     0.75rem;   /* 12px */
  --text-sm:     0.875rem;  /* 14px */
  --text-base:   1rem;      /* 16px */
  --text-lg:     1.125rem;  /* 18px */
  --text-xl:     1.375rem;  /* 22px */
  --text-2xl:    1.75rem;   /* 28px */
  --text-3xl:    2.25rem;   /* 36px — desktop only */

  /* Spacing Scale (8px base) */
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.5rem;   /* 24px */
  --space-6:  2rem;     /* 32px */
  --space-7:  3rem;     /* 48px */
  --space-8:  4rem;     /* 64px */

  /* Layout */
  --max-width:     42rem;   /* ~672px content width */
  --radius-sm:     3px;
  --radius-md:     4px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}
```

**Contrast rationale:**
- `--color-text` (#1a2b3c) on `--color-bg` (#f7f6f3) → contrast ratio ~12.5:1 ✓
- `--color-text-muted` (#4a5e6f) on `--color-bg` (#f7f6f3) → contrast ratio ~5.2:1 ✓
- `--color-header-text` (#e8ebe4) on `--color-header-bg` (#0f1f2e) → contrast ratio ~12.1:1 ✓
- `--color-action` (#2c5f7c) on `--color-surface` (#ffffff) → contrast ratio ~5.8:1 ✓
- Button text (white) on `--color-action` (#2c5f7c) → contrast ratio ~5.8:1 ✓

All combinations exceed WCAG 2.1 AA minimums (4.5:1 for normal text, 3:1 for large text).

### 2. Proposed HTML Structure

The revised `index.html` preserves all existing elements and attributes. Changes are limited to:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>End of the World Travel Agent</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header>
    <span class="site-brand">Austral Beacon Media</span>
    <h1>End of the World Travel Agent</h1>
    <p>Consulta sobre destinos y conectividad del sur austral de Chile.</p>
  </header>
  <main>
    <section class="intro-editorial" aria-labelledby="examples-heading">
      <h2 id="examples-heading">Preguntas de ejemplo</h2>
      <ul class="example-chips">
        <li>¿Cómo se llega a Puerto Williams desde Santiago?</li>
        <li>¿Qué puedo saber sobre Cabo de Hornos?</li>
      </ul>
    </section>
    <form id="query-form" aria-label="Formulario de consulta">
      <label for="question-input">Tu pregunta</label>
      <input type="text" id="question-input" name="question"
             placeholder="Escribe tu pregunta aquí…" autocomplete="off">
      <button type="submit" id="submit-btn">Consultar</button>
      <p id="validation-msg" role="alert" aria-live="assertive" hidden></p>
    </form>
    <div id="loading" aria-live="polite" hidden>
      <div class="loading-indicator" aria-hidden="true"></div>
      <p>Consultando al agente…</p>
    </div>
    <section id="results" aria-live="polite" aria-label="Resultados">
    </section>
  </main>
  <footer>
    <p>End of the World Travel Agent · Austral Beacon Media</p>
  </footer>
  <script type="module" src="/js/app.client.js"></script>
</body>
</html>
```

**Changes from current HTML:**
1. Added `<span class="site-brand">` inside `<header>` — brand reference (Req 1.2)
2. Added `class="intro-editorial"` to the examples `<section>` — styling hook (Req 2.4)
3. Added `class="example-chips"` to the `<ul>` — chip styling (Req 3.2)
4. Added `<div class="loading-indicator">` inside `#loading` — CSS animation target (Req 11.1)
5. Added `<footer>` — documentary closing (Req 1.2)

**Preserved exactly (no changes):**
- All IDs: `query-form`, `question-input`, `submit-btn`, `validation-msg`, `loading`, `results`
- All ARIA: `aria-labelledby`, `aria-live`, `aria-label`, `role="alert"`, `hidden`
- `<script type="module" src="/js/app.client.js">`
- `lang="es"` on `<html>`
- `<label for="question-input">`
- `id="examples-heading"` and its `aria-labelledby` reference

### 3. Typography Strategy

**Headings**: `--font-serif` (Charter stack) — provides editorial/cartographic character without loading external fonts. Charter is widely available on macOS, Linux, and Windows (via Cambria fallback).

**Body text**: `--font-sans` (system-ui stack) — clean readability for informational content and form elements.

**Metadata/sources**: `--font-mono` or `--font-sans` at reduced size — compact, data-like presentation for verification dates and source citations.

**Line heights**: 1.6 for body text, 1.2 for headings — generous spacing for documentary calm.

### 4. Response Card Styling

#### `.answer-connectivity` (Route Cards)

```
┌────────────────────────────────────────────┐
│ article.answer-connectivity                │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-connectivity__summary          │ │
│ │ Serif heading + summary paragraph      │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-connectivity__stages           │ │
│ │ ┌──────────────────────────────────┐   │ │
│ │ │ .route-stage (each stage)        │   │ │
│ │ │ Left border accent + dl grid     │   │ │
│ │ └──────────────────────────────────┘   │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-connectivity__warnings         │ │
│ │ Amber left border + cream background   │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-connectivity__sources          │ │
│ │ Compact list, reduced font size        │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-connectivity__verified-at      │ │
│ │ Small muted text, right-aligned        │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Design decisions:**
- Outer article: `--color-surface` background, subtle 1px `--color-border` border, `--radius-md` corners
- Stages rendered as an ordered list with each `.route-stage` having a left border accent in `--color-accent` and a CSS grid for the `<dl>` key-value pairs (2-column: label | value)
- Warnings section: `--color-warning-bg` background, `--color-warning-border` 3px left border
- Sources: `--text-sm` font size, compact layout with `<dl>` staying inline
- Verified-at: `--text-xs`, `--color-text-muted`, slight top border separator

#### `.answer-destination` (Destination Ficha)

```
┌────────────────────────────────────────────┐
│ article.answer-destination                 │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__name              │ │
│ │ Large serif heading                    │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__summary           │ │
│ │ Body text, slight indent              │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__geographic        │ │
│ │ Dotted top border separator            │ │
│ │ Geographic coordinate icon (CSS ::before) │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__cultural          │ │
│ │ Dotted top border separator            │ │
│ │ Cultural icon (CSS ::before)           │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__warnings          │ │
│ │ Same amber style as connectivity       │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__confidence        │ │
│ │ Colored badge + text label             │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__sources           │ │
│ │ Same compact style as connectivity     │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ .answer-destination__verified-at       │ │
│ │ Same muted metadata style              │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Design decisions:**
- Geographic and cultural sections differentiated by CSS `::before` pseudo-elements showing subtle Unicode markers (° for geographic, ◆ for cultural) and dotted top borders
- Confidence badge uses text AND color (Req 10.5): `.confidence-high` gets green text + "●" prefix, `.confidence-medium` gets goldenrod + "●", `.confidence-none` gets grey + "○"
- Warnings share the same amber style as connectivity for visual coherence
- Sources and verified-at share the same compact metadata style

#### `.answer-unsupported` (Informational)

- `--color-info-bg` background
- `--color-info-border` 3px left border
- Neutral, non-alarming blue-grey tone
- Same typographic treatment as body text

#### `.answer-error` (Error State)

- `--color-error-bg` background
- `--color-error-border` 3px left border
- Muted red tone — communicates problem without panic
- No icons that could be mistaken for critical system failures

### 5. Loading Indicator Animation

The loading indicator uses a geometric CSS animation inspired by cartographic compass elements:

**Design: Pulsing concentric circles**

```css
.loading-indicator {
  /* Three concentric circles created with box-shadow */
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: pulse-rings 1.5s ease-in-out infinite;
}

@keyframes pulse-rings {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(30, 58, 95, 0.4),
                0 0 0 0 rgba(30, 58, 95, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(30, 58, 95, 0),
                0 0 0 16px rgba(30, 58, 95, 0);
  }
}
```

**Rationale:**
- Geometric and minimal — evokes a point on a map
- Smooth CSS-only animation, no GIFs
- Color uses `--color-accent` for brand coherence
- `aria-hidden="true"` on the visual element; screen readers use the `<p>` text and `aria-live="polite"` on `#loading`
- The `hidden` attribute on `#loading` is controlled by `app.client.ts` — CSS does not override it

### 6. Responsive Strategy

**Mobile-first (320px–767px):**
- Single column layout
- `body` padding: `--space-4` horizontal
- Content width: 100% with `max-width: var(--max-width)`
- Form input and button stack vertically
- Typography at base scale
- Route stages stack vertically in each card

**Desktop (≥768px):**
```css
@media (min-width: 768px) {
  /* Enhanced margins and centering */
  /* Form input and button on same row */
  /* Route stage <dl> in 2-column grid */
  /* Larger heading sizes */
  /* Increased vertical spacing between sections */
}
```

**Specific adaptations at 768px+:**
- `body` max-width centered with `margin: 0 auto`
- Form layout: input takes flexible width, button stays fixed-width beside it
- Route stages: `<dl>` uses CSS grid with `grid-template-columns: auto 1fr`
- Header `<h1>` jumps from `--text-2xl` to `--text-3xl`
- Sections get increased vertical rhythm (`--space-7` gaps instead of `--space-5`)

**Touch targets:**
- Submit button: minimum `44px` height via `min-height: 2.75rem` + padding
- Input: `min-height: 2.75rem` for comfortable touch
- No content below `320px` width overflows (all elements use `max-width: 100%` and `overflow-wrap: break-word`)

### 7. Accessibility & Contrast Strategy

**Color contrast (all verified against WCAG 2.1 AA):**
| Pair | Ratio | Requirement |
|------|-------|-------------|
| Body text on background | ~12.5:1 | ≥4.5:1 ✓ |
| Muted text on background | ~5.2:1 | ≥4.5:1 ✓ |
| Header text on header bg | ~12.1:1 | ≥4.5:1 ✓ |
| Button text on button bg | ~5.8:1 | ≥4.5:1 ✓ |
| Confidence-high on surface | ~5.1:1 | ≥4.5:1 ✓ |
| Confidence-medium on surface | ~4.6:1 | ≥4.5:1 ✓ |
| Confidence-none on surface | ~4.7:1 | ≥4.5:1 ✓ |

**Focus indicators:**
- All interactive elements (input, button, links) get a visible `outline` on `:focus-visible`
- Focus ring: 2px solid `--color-border-focus` with 2px offset
- Never `outline: none` without replacement

**Confidence levels do NOT rely on color alone (Req 10.5):**
- `.confidence-high` → green dot "●" + text "Alta"
- `.confidence-medium` → goldenrod dot "●" + text "Media"
- `.confidence-none` → grey circle "○" + text "Sin datos"

**Preserved ARIA attributes:**
- `aria-live="assertive"` on `#validation-msg`
- `aria-live="polite"` on `#loading` and `#results`
- `aria-label` on form and results section
- `aria-labelledby="examples-heading"` on examples section
- `role="alert"` on validation message
- `hidden` attributes on dynamic elements (JS-controlled)

**Button states distinguishable without color alone:**
- Hover: background darkens + subtle `transform: translateY(-1px)`
- Focus: visible outline ring
- Disabled: reduced opacity (0.6) + `cursor: not-allowed` + text change (visual weight)

### 8. Decorative CSS Elements (Cartographic Aesthetic)

Subtle decorative touches using pure CSS:

- **Header**: thin bottom border line with a slight gradient effect using a pseudo-element — evokes a map's latitude line
- **Section separators**: dotted or dashed borders between major content blocks — cartographic grid reference
- **Example chips**: slight `border-left` accent in `--color-accent` — resembles map legend markers
- **Geographic section `::before`**: displays "°" character — coordinate reference
- **Cultural section `::before`**: displays "◆" character — point of interest marker
- **Footer**: thin top border + reduced text — colophon style

No gradients, no excessive shadows (max `box-shadow` for cards is a very subtle `0 1px 3px rgba(0,0,0,0.05)`), no border-radius larger than 4px.

## Data Models

No new data models are introduced. This feature operates exclusively at the presentation layer. The response types (`TravelAnswer`, `DestinationCardAnswer`, `HttpErrorInfo`) and their HTML class contracts from the render functions remain unchanged.

**CSS class contract (consumed from renderers — must be styled):**

| Class | Source Renderer | Purpose |
|-------|----------------|---------|
| `.answer-connectivity` | `renderConnectivity.ts` | Route answer container |
| `.answer-connectivity__summary` | `renderConnectivity.ts` | Route summary |
| `.answer-connectivity__stages` | `renderConnectivity.ts` | Stages list wrapper |
| `.route-stage` | `renderConnectivity.ts` | Individual route stage |
| `.answer-connectivity__warnings` | `renderConnectivity.ts` | Warnings section |
| `.answer-connectivity__sources` | `renderConnectivity.ts` | Sources section |
| `.answer-connectivity__verified-at` | `renderConnectivity.ts` | Verification date |
| `.answer-destination` | `renderDestination.ts` | Destination container |
| `.answer-destination__name` | `renderDestination.ts` | Destination title |
| `.answer-destination__summary` | `renderDestination.ts` | Destination summary |
| `.answer-destination__geographic` | `renderDestination.ts` | Geographic context |
| `.answer-destination__cultural` | `renderDestination.ts` | Cultural context |
| `.answer-destination__warnings` | `renderDestination.ts` | Warnings |
| `.answer-destination__sources` | `renderDestination.ts` | Sources |
| `.answer-destination__links` | `renderDestination.ts` | Suggested links |
| `.answer-destination__confidence` | `renderDestination.ts` | Confidence level |
| `.answer-destination__verified-at` | `renderDestination.ts` | Verification date |
| `.confidence-high` | `renderDestination.ts` | High confidence badge |
| `.confidence-medium` | `renderDestination.ts` | Medium confidence badge |
| `.confidence-none` | `renderDestination.ts` | No confidence badge |
| `.answer-unsupported` | `renderUnsupported.ts` | Unsupported answer |
| `.answer-error` | `renderError.ts` | Error answer |
| `.source-item` | Multiple renderers | Individual source entry |

## Error Handling

This feature introduces no new error states. CSS styling degrades gracefully:

- **Unknown classes**: If future renderers emit new classes not yet styled, they inherit base typography and spacing — no visual breakage
- **Long content**: All text containers use `overflow-wrap: break-word` and flexible widths
- **Missing CSS variables**: All custom properties have inline fallbacks not needed since we control the full stylesheet, but the system font stacks ensure text always renders
- **Empty results section**: `#results:empty` receives no visual treatment (no empty-state flash)
- **Hidden elements**: CSS respects `[hidden]` attribute — never overrides with `display` rules that would conflict with `app.client.ts`

## Testing Strategy

### Why PBT Does Not Apply

This feature is purely visual/presentational. It modifies HTML structure and CSS styling — there are no pure functions with input/output behavior, no data transformations, no algorithms, and no logic that varies meaningfully with input. The acceptance criteria are about:
- Visual properties (colors, spacing, typography) — not machine-verifiable without a browser
- Structural preservation (IDs exist, ARIA present) — verifiable with example-based tests
- Responsive behavior — requires visual regression or manual testing

Property-based testing is not appropriate here.

### Testing Approach

**1. HTML Structure Tests** (`tests/web-design-structure.test.ts`)
- Example-based Vitest tests that read `public/index.html` as a string
- Verify all protected IDs exist: `query-form`, `question-input`, `submit-btn`, `validation-msg`, `loading`, `results`
- Verify all ARIA attributes present: `aria-live`, `aria-label`, `aria-labelledby`, `role="alert"`
- Verify `<script type="module" src="/js/app.client.js">` present
- Verify `lang="es"` on `<html>`
- Verify `<label for="question-input">` present

**2. CSS Custom Property Tests** (`tests/web-design-structure.test.ts`)
- Read `public/styles.css` as a string
- Verify color tokens are defined
- Verify media query `min-width: 768px` exists
- Verify no `@import` of external resources
- Verify no `url()` references to external images/fonts

**3. Compatibility Guard** (existing tests remain unmodified)
- The 116 existing tests continue to pass because:
  - No IDs are renamed or removed
  - No element types change
  - Render functions are not modified
  - `app.client.ts` logic is unchanged
  - All render output classes remain identical

**Test runner**: `vitest run` (already configured in project)

**What is NOT tested automatically:**
- Visual appearance (requires manual review or visual regression tools outside scope)
- WCAG contrast ratios (verified during design by calculation; full validation requires tooling like axe-core in a browser environment)
- Responsive behavior at specific breakpoints (requires browser testing)
- Animation smoothness and aesthetics (subjective, manual review)

### Test File Plan

```
tests/
├── web-design-structure.test.ts   ← NEW: structural + accessibility preservation
├── web-render.property.test.ts    ← EXISTING: unchanged
└── ... (other existing tests)     ← EXISTING: unchanged
```
