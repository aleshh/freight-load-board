# Freightflow load board

An accessible dispatcher workspace for searching, filtering, sorting, and paging through freight loads. The mock implementation uses the same query boundary intended for a future paginated API.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer (included with current Node.js releases)

## Setup and commands

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

```bash
npm run build          # type-check and create a production build
npm run preview        # serve the production build locally
npm test               # run unit and component tests
npm run test:watch     # run tests interactively
npm run test:e2e       # build, launch, and run Playwright + axe tests
```

Install the Playwright browser once before the first end-to-end run:

```bash
npx playwright install chromium
```

## Project structure

- `src/app` — application shell and providers
- `src/components/ui` — reusable shadcn-style controls, variants, and colocated CSS Modules
- `src/components/load-board` — grid, toolbar, filters, chips, pagination, and feature-owned CSS Modules
- `src/services/loads` — replaceable service interface and mock implementation
- `src/hooks` — TanStack Query access and URL-backed query state
- `src/theme/theme.ts` — centralized light/dark design tokens
- `src/index.css` — document defaults and the small set of universal accessibility utilities
- `src/data/mockLoads.json` — initial freight dataset
- `src/data/mockLoads.large.json` — optional 10,000-record performance dataset
- `scripts/generate-large-dataset.mjs` — deterministic large-dataset generator
- `src/test` and `e2e` — unit, component, accessibility, and workflow coverage
- `src/spec/architecture.md` — design rationale and production path

## Keyboard use

- Press `Ctrl+K` or `⌘K` to focus global search.
- Tab to filters, paging, and theme controls; Enter or Space activates buttons.
- In a single select, use arrow keys to move and Enter to select. Multi-select filters use standard checkbox controls and Escape closes their popover.
- In the grid, use arrow keys to move between headers and cells. Enter sorts a focused sortable header.
- A skip link appears when focused at the beginning of the page.
- Open Settings from the gear button to choose light, dark, or system theme and enable the 10,000-record dataset.

## Accessibility validation

Automated component tests and Playwright axe scans are included, but they do not replace manual checks. Before release, validate:

1. Keyboard-only search, filter, sort, grid, paging, and theme operation.
2. VoiceOver on macOS, including result-count announcements and grid position.
3. Browser zoom at 200% with no loss of function.
4. Light, dark, system, and reduced-motion preferences.
5. Loading, empty, and simulated error states.

See [the architecture notes](src/spec/architecture.md) for the service boundary, performance strategy, limitations, and future improvements.
