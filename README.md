# Freightboard

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

## Development notes

Developer-written notes covering major architectural decisions and features are in [NOTES.md](spec/NOTES.md). There are also more detailed machine-generated notes in [architecture.md](src/spec/architecture.md).
