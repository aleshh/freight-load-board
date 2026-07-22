# Freight Load Board architecture

## Technology choices

React and TypeScript provide composable UI boundaries and compile-time contracts for load records, filter state, and service results. Vite keeps local startup and production builds fast without imposing application-specific runtime conventions.

AG Grid Community supplies stable keyboard navigation, accessible grid semantics, column resizing, and sort interactions. It is used as the rendering engine rather than replaced by a custom table. The application retains external, server-shaped page and sort state so the mock service can later be replaced by an API.

The UI layer follows the shadcn/ui model: code-owned application components built over accessible primitives. Radix Select provides single-select behavior, while the checkbox-based `MultiSelect` supports categorical filters. `Button`, `Input`, `Select`, `MultiSelect`, and `Badge` centralize variants and interaction states so features do not repeat visual policy.

Each component has its own directory containing its implementation and colocated CSS Module. `src/index.css` is intentionally limited to document defaults, the screen-reader and skip-link utilities, the universal focus-visible policy, and reduced-motion handling. Shared field structure has a small shared module; all other selectors are owned by the component that renders them. AG Grid selectors are isolated in `Grid.module.css` with explicit `:global(...)` escapes.

TanStack Query owns asynchronous load data, request cancellation, in-memory result caching, retry behavior, and transitional page data. Local React state is limited to transient UI, such as whether the filter panel is open. Search, filters, sorting, page, and page size are serializable and synchronized with the URL. Categorical selections use repeated URL parameters; values within one category are ORed while separate filter categories are ANDed.

## Project organization

- `src/app` contains the application shell and providers.
- `src/components/ui` contains reusable controls, variants, and their colocated CSS Modules.
- `src/components/load-board` contains the grid, toolbar, filters, active-filter chips, pagination, and other feature-owned components.
- `src/services/loads` defines the replaceable load-service interface and mock implementation.
- `src/hooks` contains TanStack Query access and URL-backed query state.
- `src/theme/theme.ts` defines centralized light, dark, and shared design tokens.
- `src/index.css` contains document defaults and universal accessibility utilities.
- `src/data` contains the standard and optional 10,000-record mock datasets.
- `scripts/generate-large-dataset.mjs` reproducibly generates the large fixture.
- `src/test` contains Vitest unit and integration coverage; `e2e` contains Playwright accessibility and workflow coverage.

## Centralized theme

`src/theme/theme.ts` is the design-token source of truth. It defines light and dark color values plus typography, spacing, borders, radii, shadows, focus rings, and control sizes. The theme provider turns those tokens into CSS custom properties. Global CSS, scoped CSS Modules, shared controls, feature layout, and AG Grid all consume the same properties. AG Grid background, text, border, hover, selection, input, and focus variables therefore update with the application theme without a second design system.

Theme preference supports light, dark, and system values, is stored in local storage, reacts to operating-system changes, and is applied by a small startup script before the application renders to reduce flashing.

## Data flow and scalability

`LoadService` defines a paginated contract with search, filters, multi-column sorting, and paging. `mockLoadService` reads `mockLoads.json`, applies the query, simulates latency, and returns a promise. UI code does not import mock JSON. A future HTTP service can implement the same interface without changing the grid.

The provided mock data stores locations as `City, ST` strings. A single parsing helper derives state filter options and matches state queries; a production model should expose structured city and state fields directly. Origin and Destination each expose one mutually exclusive City/State mode so hidden location criteria cannot contradict the visible selection.

Settings can switch to an additional deterministic 10,000-record dataset. That JSON is dynamically imported only when enabled, so the standard experience does not download the larger fixture. Its first 48 entries match the standard dataset, and the remaining records can be reproduced with `scripts/generate-large-dataset.mjs`.

Search input is debounced. TanStack Query cancels superseded requests and keeps the previous page visible while the next page is retrieved. Column definitions and defaults are memoized, row IDs are stable, and derived rate-per-mile values are calculated without changing source data.

The grid uses external pagination to bound each rendered page to at most 100 rows. `ensureDomOrder` is enabled and row and column virtualization are disabled so screen readers can inspect every cell on the current page in visual order. This intentionally trades some DOM-rendering efficiency for more reliable accessibility while keeping the rendered dataset bounded; the full 10,000-record fixture is still filtered, sorted, and paginated in memory by the mock service.

## Accessibility

The application uses skip links, native labels and checkboxes, named icon buttons, visible focus rings, live result announcements, non-color status text, keyboard shortcuts, and reduced-motion support. Radix manages single-select focus and keyboard behavior; multi-select popovers support initial focus, Escape dismissal, and focus restoration. AG Grid retains its own roles and keyboard model, uses ordered DOM output, and renders every cell on the current page for assistive technology. Result announcements wait briefly after settled searches so they do not compete as aggressively with screen-reader text-entry feedback. Error and loading states use live semantics, and URL-driven state makes the current view recoverable.

Automated coverage includes accessible-name component tests and an axe Playwright check. Vitest runs before commits; production builds and Playwright tests run before pushes. These local hooks provide feedback but can be bypassed. Manual checks remain required with keyboard-only navigation, VoiceOver on macOS, browser zoom at 200%, both themes, reduced motion, and loading/error/empty states.

## Known limitations and next steps

- The 10,000-record fixture demonstrates that this client-side prototype remains comfortable at that scale; it does not establish an unlimited production scaling boundary. Larger or frequently changing production datasets should use server-side pagination backed by indexed API queries.
- URL updates use replacement history to avoid filling browser history during rapid filter changes. Product research may justify explicit “Apply” actions and navigable history entries.
- Load assignment is out of scope. A future detail dialog should retain focus restoration and use optimistic mutation handling.
- Locale, units, time zones, saved views, persisted column layouts, and authorization require product decisions before production rollout.
- Automated accessibility tests cannot validate screen-reader usability or every contrast state; manual validation is part of release readiness.
