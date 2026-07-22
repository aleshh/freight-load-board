import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActiveFilters } from '../../components/load-board/ActiveFilters/ActiveFilters';
import type { LoadFilters } from '../../services/loads/types';

describe('ActiveFilters', () => {
  it('shows active state and exposes named removal actions', async () => {
    const user = userEvent.setup();
    const onClearFilter = vi.fn();
    const onClearAll = vi.fn();
    render(
      <ActiveFilters
        search="Denver"
        filters={{ status: 'Available', minPrice: 1200 }}
        onClearSearch={vi.fn()}
        onClearFilter={onClearFilter}
        onClearAll={onClearAll}
      />,
    );

    expect(screen.getByRole('group', { name: 'Active search and filters' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove Status filter: Available' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove Min price filter: $1,200' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Remove Status filter: Available' }));
    expect(onClearFilter).toHaveBeenCalledWith('status');
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it('moves focus forward after removing a chip and back to Filters after removing the last chip', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [filters, setFilters] = useState<LoadFilters>({ status: 'Available', minPrice: 1200 });
      return (
        <>
          <button id="load-filters-trigger">Filters</button>
          <ActiveFilters
            filters={filters}
            onClearSearch={() => undefined}
            onClearFilter={(key) => setFilters((current) => ({ ...current, [key]: undefined }))}
            onClearAll={() => setFilters({})}
          />
        </>
      );
    }

    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Remove Status filter: Available' }));
    expect(screen.getByRole('button', { name: 'Remove Min price filter: $1,200' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Remove Min price filter: $1,200' }));
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveFocus();
  });
});
