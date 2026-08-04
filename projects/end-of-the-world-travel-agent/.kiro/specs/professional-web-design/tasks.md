# Implementation Plan: Professional Web Design

## Overview

Transform the existing minimal `public/index.html` and `public/styles.css` into a professional, documentary-style interface with a Patagonian cartographic aesthetic. The implementation is purely additive CSS plus minor HTML structural enhancements (wrapper elements, class annotations). All existing IDs, ARIA attributes, and `app.client.ts` compatibility are preserved exactly.

## Tasks

- [x] 1. Update HTML structure with styling hooks
  - [x] 1.1 Add brand reference, class annotations, loading indicator element, and footer to `public/index.html`
    - Add `<span class="site-brand">Austral Beacon Media</span>` inside `<header>` before the `<h1>`
    - Add `class="intro-editorial"` to the examples `<section>`
    - Add `class="example-chips"` to the `<ul>` inside the examples section
    - Add `<div class="loading-indicator" aria-hidden="true"></div>` inside `#loading` before the `<p>`
    - Add `<footer><p>End of the World Travel Agent · Austral Beacon Media</p></footer>` before the `<script>` tag
    - Preserve ALL existing IDs: `query-form`, `question-input`, `submit-btn`, `validation-msg`, `loading`, `results`
    - Preserve ALL ARIA attributes: `aria-live`, `aria-label`, `aria-labelledby`, `role="alert"`, `hidden`
    - Preserve `<script type="module" src="/js/app.client.js">` exactly
    - Preserve `lang="es"` on `<html>` and `<label for="question-input">`
    - _Requirements: 1.1, 1.2, 1.5, 2.4, 3.2, 11.1, 11.3, 12.1, 12.2, 12.3_

- [x] 2. Implement CSS design tokens and base reset
  - [x] 2.1 Create custom properties (design tokens) in `public/styles.css`
    - Define all color palette variables from design (--color-bg, --color-surface, --color-text, etc.)
    - Define typography font stacks (--font-serif, --font-sans, --font-mono)
    - Define type scale variables (--text-xs through --text-3xl)
    - Define spacing scale (--space-1 through --space-8)
    - Define layout variables (--max-width, --radius-sm, --radius-md)
    - Define transition variables (--transition-fast, --transition-base)
    - _Requirements: 8.1, 8.2, 13.2, 13.3_

  - [x] 2.2 Add CSS reset and base typography rules
    - Apply box-sizing border-box globally
    - Set body background to --color-bg, color to --color-text, font to --font-sans
    - Set base line-height to 1.6 for body text
    - Set heading line-height to 1.2 and font-family to --font-serif
    - Apply overflow-wrap: break-word to text containers
    - Ensure no fixed px widths on main content containers (use max-width + margin auto)
    - _Requirements: 8.2, 8.3, 9.1, 9.5_

- [x] 3. Style header and intro editorial sections
  - [x] 3.1 Style the header with brand identity
    - Apply --color-header-bg background and --color-header-text color
    - Style `<h1>` with --font-serif at --text-2xl (mobile)
    - Style `.site-brand` as small muted text above the title
    - Style the `<p>` descriptor with --color-header-text at reduced opacity
    - Add subtle bottom border pseudo-element evoking a latitude line
    - Ensure header contrast ratio meets WCAG AA (verified in design: ~12.1:1)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.5, 10.1_

  - [x] 3.2 Style the intro editorial section and example chips
    - Style `.intro-editorial` with visual separation from the form (spacing, typography)
    - Style `.example-chips` as chip/tag elements with left border accent in --color-accent
    - Remove default list bullets, apply card-like padding and spacing
    - Ensure chips are legible at 320px width without horizontal overflow
    - _Requirements: 2.1, 2.2, 2.4, 3.1, 3.2, 3.4, 3.5_

- [x] 4. Style the form component
  - [x] 4.1 Implement form layout and input/button styles
    - Position form centrally in the page hierarchy with generous surrounding whitespace
    - Style `#question-input` with defined borders, generous padding, --font-sans, min-height 2.75rem
    - Style `#submit-btn` with --color-action background, white text, min-height 2.75rem (44px touch target)
    - Style label with appropriate font size and spacing
    - Style `#validation-msg` with error color when visible (do NOT alter hidden attribute behavior)
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 9.3_

  - [x] 4.2 Implement form interaction states
    - Add `:focus-visible` on input with --color-border-focus border/outline (2px solid, 2px offset)
    - Add `:hover` on button with --color-action-hover + subtle translateY(-1px)
    - Add `:focus-visible` on button with visible outline ring
    - Add `:disabled` on button with opacity 0.6 + cursor not-allowed
    - Ensure all states are distinguishable without color alone (shape, opacity, transform changes)
    - _Requirements: 4.4, 4.6, 10.3, 10.4_

- [x] 5. Style response cards
  - [x] 5.1 Style connectivity response card (`.answer-connectivity`)
    - Apply --color-surface background, 1px --color-border border, --radius-md corners, subtle box-shadow
    - Style `.answer-connectivity__summary` with --font-serif heading
    - Style `.answer-connectivity__stages` and each `.route-stage` with left border accent and structured layout
    - Style `.answer-connectivity__warnings` with --color-warning-bg background and --color-warning-border 3px left border
    - Style `.answer-connectivity__sources` and `.source-item` with --text-sm compact layout
    - Style `.answer-connectivity__verified-at` with --text-xs, --color-text-muted, top border separator
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 5.2 Style destination response card (`.answer-destination`)
    - Apply same card surface treatment as connectivity
    - Style `.answer-destination__name` with large --font-serif heading
    - Style `.answer-destination__geographic` with dotted top border and "°" ::before pseudo-element
    - Style `.answer-destination__cultural` with dotted top border and "◆" ::before pseudo-element
    - Style `.answer-destination__warnings` with same amber warning style as connectivity
    - Style `.answer-destination__confidence` with colored badges: `.confidence-high` green, `.confidence-medium` goldenrod, `.confidence-none` grey (text + color, not color alone)
    - Style `.answer-destination__sources` and `.answer-destination__verified-at` with same compact metadata style
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 10.5_

  - [x] 5.3 Style unsupported and error response cards
    - Style `.answer-unsupported` with --color-info-bg background, --color-info-border 3px left border, neutral tone
    - Style `.answer-error` with --color-error-bg background, --color-error-border 3px left border, muted red tone
    - Ensure both maintain coherent typography with rest of interface
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 6. Implement loading indicator animation
  - [x] 6.1 Add CSS animation for `.loading-indicator`
    - Create pulsing concentric circles using box-shadow animation
    - Use --color-accent for the geometric pulse element
    - Define @keyframes pulse-rings with 1.5s ease-in-out infinite
    - Center the loading indicator within #loading alongside the text
    - Ensure no GIFs or external images are used
    - Do NOT override the `hidden` attribute on `#loading` (JS-controlled)
    - _Requirements: 11.1, 11.2, 11.3, 12.4_

- [x] 7. Implement responsive adaptations
  - [x] 7.1 Add @media (min-width: 768px) breakpoint styles
    - Increase `<h1>` to --text-3xl
    - Switch form layout to inline (input flexible width + button fixed width on same row)
    - Increase section vertical spacing to --space-7 gaps
    - Widen margins and centering for desktop
    - Apply 2-column CSS grid to route stage `<dl>` elements (label | value)
    - Ensure no fixed-px container widths; use relative units and max-width
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 8. Add footer and decorative cartographic elements
  - [x] 8.1 Style the footer and add decorative CSS details
    - Style `<footer>` with thin top border, --text-sm, --color-text-muted, centered text
    - Add section separators using dotted/dashed borders between major content blocks
    - Ensure decorative elements use only CSS (no images, no external resources)
    - Verify generous whitespace between all major sections for documentary calm
    - _Requirements: 8.3, 8.4, 8.5, 13.3_

- [x] 9. Checkpoint - Verify HTML and CSS integrity
  - Ensure all tests pass, ask the user if questions arise.
  - Run: `npm run typecheck`, `npm run build:client`, `npm test`

- [x] 10. Write structural and accessibility tests
  - [x] 10.1 Create `tests/web-design-structure.test.ts` with HTML structure assertions
    - Read `public/index.html` as string in test
    - Verify protected IDs exist: `query-form`, `question-input`, `submit-btn`, `validation-msg`, `loading`, `results`
    - Verify ARIA attributes present: `aria-live="polite"`, `aria-live="assertive"`, `aria-label`, `aria-labelledby="examples-heading"`, `role="alert"`
    - Verify `<script type="module" src="/js/app.client.js">` present
    - Verify `lang="es"` on `<html>`
    - Verify `<label for="question-input">` present
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 10.2 Add CSS validation assertions to the test file
    - Read `public/styles.css` as string in test
    - Verify color custom properties are defined (--color-bg, --color-text, etc.)
    - Verify `@media (min-width: 768px)` media query exists
    - Verify no `@import` of external resources
    - Verify no `url()` references to external images or CDN fonts
    - _Requirements: 13.2, 13.3, 14.4, 14.5_

- [x] 11. Final checkpoint - Full verification
  - Ensure all tests pass, ask the user if questions arise.
  - Run: `npm run typecheck`, `npm run build:client`, `npm test`
  - Verify that the 116 existing tests plus new structural tests all pass together.
  - _Requirements: 12.5, 13.6, 13.7_

## Notes

- Property-based testing does NOT apply to this feature (purely visual/presentational — no data transformations or algorithms)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Only `public/index.html` and `public/styles.css` are modified; new test file added in `tests/`
- All CSS is pure — no frameworks, preprocessors, CDN fonts, or external images
- The existing 116 tests must remain unmodified and passing

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "4.1"] },
    { "id": 4, "tasks": ["4.2", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3"] },
    { "id": 6, "tasks": ["6.1", "7.1"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["9"] },
    { "id": 9, "tasks": ["10.1"] },
    { "id": 10, "tasks": ["10.2"] },
    { "id": 11, "tasks": ["11"] }
  ]
}
```
