## Process

### Tech stack decisions

#### Data Grid

The most important component in this app is the data grid, and several options were considered. AG Grid was selected for its balance of power, flexibility, and ease of use. MUI Data Grid was considered. While its integration with the MUI system would have been a valuable foundation, the free version at least is missing key features like multi-filtering.

#### Other components

### Theme styling approach

In order to make our theme reusable and portable, we've expressed it in a typescript object (theme.ts). The theme values get injected into HTML as CSS variables. This approach gives us good performance, and it saves code complexity, because styling in components can be CSS based, not requiring importing the theme each time.

## Notes

### Performance

Since performance is a priority with this system, I wanted to see how it functioned under load. So, we load the default 48 records of sample data by default, but also provide the option of loading a 10,000-record data set. Doing this proves that (1) the application remains performant, (2) loading all data and manipulating it in the frontend is a reasonable choice for records of this size.

### Accessibility

We have the proper semantic markup, including labels, fieldsets, and live announcements for results counts, page changes, etc.

Tested with keyboard-only navigation. Not tested with a screen reader; however, we have provided screen-reader landmarks and other features to make the application navigable.

### Testing

Our test suite has three layers:

- Unit tests verify isolated logic such as filtering
- Integration tests render React components and simulate user behavior like pagination, keyboard navigation, and filter interactions
- Playwright end-to-end tests exercise the complete application in Chromium and include automated accessibility checks with axe.
