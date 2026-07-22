# Freight Load Board architecture

## Technology choices

React and TypeScript provide composable UI boundaries and compile-time contracts for load records, filter state, and service results. Vite keeps local startup and production builds fast without imposing application-specific runtime conventions.

AG Grid Community supplies row virtualization, stable keyboard navigation, accessible grid semantics, column resizing, and sort interactions. It is used as the rendering engine rather than replaced by a custom table. The application retains external, server-shaped page and sort state so the mock service can later be replaced by an API.

The UI layer follows the shadcn/ui model: code-owned application components built over accessible primitives. Radix Select provides the complex select behavior, while `AppButton`, `AppInput`, `AppSelect`, and `AppBadge` centralize variants and interaction states. This prevents filter and toolbar features from repeating visual policy.

TanStack Query owns asynchronous load data, request cancellation, caching, retry behavior, and transitional page data. Local React state is limited to transient UI, such as whether the filter panel is open. Search, filters, sorting, page, and page size are serializable and synchronized with the URL.

## Centralized theme

`src/theme/theme.ts` is the design-token source of truth. It defines light and dark color values plus typography, spacing, borders, radii, shadows, focus rings, and control sizes. The theme provider turns those tokens into CSS custom properties. Tailwind, shared controls, feature layout, and AG Grid all consume the same properties. AG Grid background, text, border, hover, selection, input, and focus variables therefore update with the application theme without a second design system.

Theme preference supports light, dark, and system values, is stored in local storage, reacts to operating-system changes, and is applied by a small startup script before the application renders to reduce flashing.

## Data flow and scalability

`LoadService` defines a paginated contract with search, filters, multi-column sorting, and paging. `mockLoadService` reads `mockLoads.json`, applies the query, simulates latency, and returns a promise. UI code does not import mock JSON. A future HTTP service can implement the same interface without changing the grid.

Settings can switch to an additional deterministic 10,000-record dataset. That JSON is dynamically imported only when enabled, so the standard experience does not download the larger fixture. Its first 48 entries match the standard dataset, and the remaining records can be reproduced with `scripts/generate-large-dataset.mjs`.

Search input is debounced. TanStack Query cancels superseded requests and keeps the previous page visible while the next page is retrieved. Column definitions and defaults are memoized, row IDs are stable, derived rate-per-mile values are calculated without changing source data, and AG Grid renders only visible rows and columns.

## Accessibility

The application uses a skip link, native labels, named icon buttons, visible focus rings, live result announcements, non-color status text, keyboard shortcuts, and reduced-motion support. Radix manages select focus and keyboard behavior. AG Grid retains its own roles and keyboard model. Error and loading states use live semantics, and URL-driven state makes the current view recoverable.

Automated coverage includes accessible-name component tests and an axe Playwright check. Manual checks remain required with keyboard-only navigation, VoiceOver on macOS, browser zoom at 200%, both themes, reduced motion, and loading/error/empty states.

## Known limitations and next steps

- Mock data is intentionally small; production should use AG Grid's server-side or infinite row model backed by indexed API queries.
- URL updates use replacement history to avoid filling browser history during rapid filter changes. Product research may justify explicit “Apply” actions and navigable history entries.
- Load assignment is out of scope. A future detail dialog should retain focus restoration and use optimistic mutation handling.
- Locale, units, time zones, saved views, column preferences, and authorization require product decisions before production rollout.
- Automated accessibility tests cannot validate screen-reader usability or every contrast state; manual validation is part of release readiness.
