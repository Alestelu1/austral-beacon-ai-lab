# Implementation Plan: Minimal Web Interface

## Overview

This plan implements a lightweight web interface served by the existing Node.js HTTP server. The approach adds a static file handler to `app.ts`, pure TypeScript rendering functions in `src/ui/web/`, a client entry point compiled to ES modules, and static HTML/CSS assets in `public/`. Testing uses Vitest with `fast-check` for property-based tests on the pure rendering functions.

## Tasks

- [x] 1. Set up project infrastructure and client build pipeline
  - [x] 1.1 Create `tsconfig.client.json` for client-side TypeScript compilation
    - Configure target ES2022, module ES2022, outDir `public/js`, rootDir `src/ui/web`
    - Set `verbatimModuleSyntax: true`, no declaration, no sourceMap
    - Add `build:client` script to `package.json`
    - _Requirements: 10.1, 10.3_

  - [x] 1.2 Install `fast-check` as a devDependency for property-based testing
    - Add `fast-check` to devDependencies in `package.json`
    - _Requirements: 13.1, 11.8_

  - [x] 1.3 Create `public/` directory structure with `index.html` and `styles.css`
    - Create `public/index.html` with semantic HTML structure: header, example questions, form with labeled input, submit button, loading indicator, results section
    - Include `aria-live`, `aria-label`, proper `<label>` associations, and `lang="es"`
    - Create `public/styles.css` with mobile-first responsive design, system fonts, high-contrast colors (WCAG AA 4.5:1), documentary tone
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. Implement pure rendering functions
  - [x] 2.1 Create `src/ui/web/renderConnectivity.ts`
    - Pure function accepting `TravelAnswer` with status "supported" and intent "connectivity"
    - Returns HTML string with sections: resumen, etapas (from/to/mode/note per stage), advertencias, fuentes (title/publisher/URL/verifiedAt), and general verifiedAt
    - Use semantic HTML: `<article>`, `<section>`, `<dl>`, `<ol>`, `<a>`
    - Apply BEM-lite CSS classes (`.answer-connectivity`, `.route-stage`, `.source-item`)
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 2.2 Create `src/ui/web/renderDestination.ts`
    - Pure function accepting `DestinationCardAnswer` with status "supported"
    - Returns HTML string with: destination name, summary, geographic context, cultural context, warnings, sources (title/publisher/clickable URL/verifiedAt), internal links (path/label), confidence level, verifiedAt
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 2.3 Create `src/ui/web/renderUnsupported.ts`
    - Pure function accepting `TravelAnswer | DestinationCardAnswer` with status "unsupported"
    - Show "destino no disponible" for intent "destination-info", "consulta no reconocida" for intent "unknown"
    - No invented suggestions or alternative data
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 2.4 Create `src/ui/web/renderError.ts`
    - Define `HttpErrorInfo` interface with type "network" | "http", optional status and message
    - Pure function: network → connection failure message; HTTP 400 → show API error message; HTTP 500 → generic internal error message; other → unexpected error
    - Messages in Spanish, no stack traces or internal details
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 2.5 Create `src/ui/web/renderAnswer.ts`
    - Dispatcher function that routes to `renderConnectivity`, `renderDestination`, or `renderUnsupported` based on answer status and intent
    - Import and delegate to the appropriate renderer
    - _Requirements: 4.1, 5.1, 6.1, 6.2_

- [x] 3. Implement client application and input validation
  - [x] 3.1 Create `src/ui/web/app.client.ts`
    - Implement `validateQuestion(text: string): ValidationResult` — reject empty/whitespace-only input
    - Attach event listeners on DOMContentLoaded for form submit (button click + Enter)
    - Manage loading state: disable form, show/hide loading indicator
    - Call `fetch("/api/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) })` on valid input
    - Handle response: parse JSON, call `renderAnswer()` for 200, call `renderError()` for HTTP errors and network failures
    - Insert result HTML into `#results` via `innerHTML`
    - Restore form state after response/error
    - Show inline validation message for empty input
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 7.1, 7.2, 7.3, 7.4, 9.5_

- [x] 4. Checkpoint - Ensure rendering functions compile and client builds
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement static file handler and wire into server
  - [x] 5.1 Create `src/api/staticHandler.ts`
    - Implement `handleStaticRequest(req, res): boolean`
    - Whitelist root static routes: `/` → `public/index.html`, `/styles.css` → `public/styles.css`
    - Dynamically resolve `/js/*.js` requests within `public/js/` directory
    - Validate resolved path stays inside `public/js/` (prevent directory traversal with `path.resolve` check)
    - Only allow `.js` extension for dynamic JS paths
    - Read files from disk, serve with correct Content-Type headers
    - Return `false` for unrecognized paths (let existing router handle them)
    - Return 404 for files not found on disk, 500 for read errors
    - _Requirements: 12.1, 12.2, 12.3, 12.5, 12.6_

  - [x] 5.2 Modify `src/api/app.ts` to integrate static handler
    - Import `handleStaticRequest` from `./staticHandler.js`
    - Add static file handling at the top of the request handler for GET requests
    - Ensure `POST /api/answer` and `GET /health` remain unchanged
    - Unknown GETs that don't match static files still return 404
    - _Requirements: 12.4, 12.5, 10.5, 10.6_

- [ ] 6. Write unit and integration tests
  - [x] 6.1 Create `tests/web-render.test.ts` with unit tests for all rendering functions
    - Test `renderConnectivity`: verify output contains summary, all stages (from/to/mode/note), warnings, sources with dates, section labels
    - Test `renderDestination`: verify output contains name, summary, geographic/cultural context, warnings, sources with clickable URLs, internal links, confidence, verifiedAt
    - Test `renderUnsupported`: verify correct message per intent type
    - Test `renderError`: verify network → connection message, 400 → API message preserved, 500 → generic message
    - Test `validateQuestion`: whitespace → false, non-empty → true
    - _Requirements: 11.1, 11.3, 11.4, 11.5, 11.6, 11.7, 13.2, 13.4_

  - [x]* 6.2 Create `tests/web-render.property.test.ts` with property-based tests using `fast-check`
    - **Property 1: Whitespace-only input is always rejected**
    - Generate strings from whitespace character set; verify `validateQuestion` returns `{valid: false}`. Generate strings with at least one non-whitespace; verify returns `{valid: true}`.
    - **Validates: Requirements 2.2, 11.7**

  - [x]* 6.3 Write property test for connectivity rendering completeness
    - **Property 2: Connectivity rendering includes all response data**
    - Generate `TravelAnswer` objects with random stages (0–5), warnings (0–3), sources (0–3); verify output contains all field values and section labels
    - **Validates: Requirements 4.1, 4.2, 11.3**

  - [x]* 6.4 Write property test for destination rendering completeness
    - **Property 3: Destination rendering includes all response data**
    - Generate `DestinationCardAnswer` objects with random card data, sources, links; verify output contains all field values including href attributes
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 11.4**

  - [x]* 6.5 Write property test for error message preservation
    - **Property 4: Error rendering preserves API error messages**
    - Generate random non-empty strings as error messages; verify 400 output contains exact message, 500 uses generic message, network uses connection message
    - **Validates: Requirements 7.1, 7.2, 7.3, 11.6**

  - [x]* 6.6 Write property test for non-empty HTML output
    - **Property 5: All render functions produce non-empty HTML**
    - Generate valid `TravelAnswer` or `DestinationCardAnswer` objects; verify `renderAnswer()` returns non-empty string matching `<[a-z]` pattern
    - **Validates: Requirements 13.4**

  - [x] 6.7 Create `tests/staticHandler.test.ts` with integration tests
    - Test `GET /` returns 200 with `text/html` content type
    - Test `GET /styles.css` returns 200 with `text/css`
    - Test `GET /js/app.client.js` returns 200 with `application/javascript`
    - Test `GET /js/renderAnswer.js` returns 200
    - Test `GET /js/../../../etc/passwd` returns 404 (directory traversal blocked)
    - Test `POST /api/answer` still works (existing behavior)
    - Test `GET /health` still works
    - Test unknown `GET /foo` returns 404
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 11.8_

- [ ] 7. Compile client and verify end-to-end
  - [x] 7.1 Run `build:client` script to compile `src/ui/web/*.ts` to `public/js/*.js`
    - Verify all ES module files are generated in `public/js/`
    - Verify import paths in compiled JS use `.js` extensions
    - Verify no domain runtime dependencies leak into client bundle
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 7.2 Wire everything together and verify full integration
    - Ensure server starts and serves `GET /` with the HTML page
    - Ensure the HTML page loads CSS and JS correctly
    - Ensure existing API tests still pass unchanged
    - Run full `vitest run` test suite
    - _Requirements: 11.8, 12.4, 12.6_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The `fast-check` library is used exclusively for property-based tests (devDependency only)
- No jsdom or browser dependencies are needed — all rendering is tested via pure function output
- Client TypeScript is compiled to ES modules via a separate `tsconfig.client.json`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["2.5", "3.1"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["5.2"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["7.2"] }
  ]
}
```
