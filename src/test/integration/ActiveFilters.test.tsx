import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActiveFilters } from '../../components/load-board/ActiveFilters';

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

    expect(screen.getByRole('button', { name: 'Remove Status filter: Available' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Remove Status filter: Available' }));
    expect(onClearFilter).toHaveBeenCalledWith('status');
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalledOnce();
  });
});
