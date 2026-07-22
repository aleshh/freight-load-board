import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Filters } from '../../components/load-board/Filters/Filters';

function FiltersHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id="load-filters-trigger"
        aria-expanded={open}
        aria-controls="load-filters"
        onClick={() => setOpen((current) => !current)}
      >
        Filters
      </button>
      <Filters filters={{}} onChange={() => undefined} onClose={() => setOpen(false)} open={open} />
    </>
  );
}

describe('Filters', () => {
  it('focuses the first control when opened and restores trigger focus when Escape closes it', async () => {
    const user = userEvent.setup();
    render(<FiltersHarness />);

    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Company' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('region', { name: 'Refine loads' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('explains that changes apply automatically and provides an explicit close action', async () => {
    const user = userEvent.setup();
    render(<FiltersHarness />);

    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);

    expect(screen.getByText('Changes apply automatically. Press Escape to close.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Origin' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Destination' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Origin' }));
    expect(screen.getByRole('group', { name: 'Filter origin by' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'City' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'State' })).toHaveAttribute('aria-pressed', 'false');
    await user.click(screen.getByRole('button', { name: 'Close filters' }));
    expect(screen.queryByRole('region', { name: 'Refine loads' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
