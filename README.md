# Freightflow load board

An accessible dispatcher workspace for searching, filtering, sorting, and paging through freight loads. The mock implementation uses the same query boundary intended for a future paginated API.

## Prerequisites

- Node.js 20 or newer
- pnpm 10 or newer (`corepack enable` can provide pnpm)

## Setup and commands

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

```bash
pnpm build          # type-check and create a production build
pnpm preview        # serve the production build locally
pnpm test           # run unit and component tests
pnpm test:watch     # run tests interactively
pnpm test:e2e       # build, launch, and run Playwright + axe tests
```

Install the Playwright browser once before the first end-to-end run:

```bash
pnpm exec playwright install chromium
```

## Project structure

- `src/app` — application shell and providers
- `src/components/ui` — reusable shadcn-style controls and variants
- `src/components/load-board` — grid, toolbar, filters, chips, and pagination
- `src/services/loads` — replaceable service interface and mock implementation
- `src/hooks` — TanStack Query access and URL-backed query state
- `src/theme/theme.ts` — centralized light/dark design tokens
- `src/data/mockLoads.json` — initial freight dataset
- `src/test` and `e2e` — unit, component, accessibility, and workflow coverage
- `src/spec/architecture.md` — design rationale and production path

## Keyboard use

- Press `Ctrl+K` or `⌘K` to focus global search.
- Tab to filters, paging, and theme controls; Enter or Space activates buttons.
- In a select, use arrow keys to move and Enter to select.
- In the grid, use arrow keys to move between headers and cells. Enter sorts a focused sortable header.
- A skip link appears when focused at the beginning of the page.

## Accessibility validation

Automated component tests and Playwright axe scans are included, but they do not replace manual checks. Before release, validate:

1. Keyboard-only search, filter, sort, grid, paging, and theme operation.
2. VoiceOver on macOS, including result-count announcements and grid position.
3. Browser zoom at 200% with no loss of function.
4. Light, dark, system, and reduced-motion preferences.
5. Loading, empty, and simulated error states.

See [the architecture notes](src/spec/architecture.md) for the service boundary, performance strategy, limitations, and future improvements.
