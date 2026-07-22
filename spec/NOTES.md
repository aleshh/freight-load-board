# Freight Load Board development notes

## Tech stack decisions

### Data Grid

The most important component in this app is the data grid, and several options were considered. AG Grid was selected for its balance of power, flexibility, and ease of use. MUI Data Grid was considered. While its integration with the MUI system would have been a valuable foundation, the free version at least is missing key features like multi-filtering.

### Other components

Most of our other dependencies are standard fare: React, Radix UI for some basic components, TanStack Query for handling data, Lucide icons.

## Theme styling approach

In order to make our theme reusable and portable, we've expressed it in a TypeScript object (theme.ts). The theme values get injected into HTML as CSS variables. This approach gives us good performance, and it saves code complexity, because styling in components can be CSS based, not requiring importing the theme each time.

We have a minimal global stylesheet, and use CSS Modules for scoped component styles. Both use the centralized theme variables.

## Performance and data

Since performance is a priority with this system, I wanted to see how it functioned under load. So, we load the default 48 records of sample data by default, but also provide the option of loading a 10,000-record data set. Doing this demonstrates that (1) the application remains performant, (2) loading all data and manipulating it in the frontend is a reasonable choice for records of this size.

Production scale may still require server-side pagination and indexed queries. The UI queries LoadService, not JSON directly, so an HTTP implementation can replace the mock without restructuring the grid.

We use TanStack Query to cache results for search, filter, sort, and pagination query keys. We have deliberately disabled AG Grid virtualization to avoid problems for screen readers; nonetheless, performance is fine with 100 rows per page.

## Accessibility

We have the proper semantic markup, including labels, fieldsets, and live announcements for results counts, page changes, etc.

Tested with keyboard-only navigation. Briefly tested with VoiceOver. We have screen-reader landmarks and other features to make the application navigable, and announcements where applicable. Tested at 200%. We also have axe to help catch potential accessibility issues.

## Testing

Our test suite has three layers:

- Unit tests verify isolated logic such as filtering
- Integration tests render React components and simulate user behavior like pagination, keyboard navigation, and filter interactions
- Playwright end-to-end tests exercise the complete application in Chromium and include automated accessibility checks with axe.

We have pre-commit hooks to run unit and integration tests before commit, and run a production build and end to end tests before push.

## Additional details

For detailed implementation boundaries, tradeoffs, and future work, see the [architecture notes](../src/spec/architecture.md).
