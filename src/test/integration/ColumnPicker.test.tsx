import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ColumnPicker } from '../../components/load-board/ColumnPicker/ColumnPicker';

const columns = [
  { id: 'id', label: 'Load ID', visible: true, pinned: true },
  { id: 'company', label: 'Company', visible: true, pinned: false },
];

describe('ColumnPicker', () => {
  it('exposes visible and pinned controls and returns focus after Escape', async () => {
    const user = userEvent.setup();
    const onVisibilityChange = vi.fn();
    const onPinnedChange = vi.fn();
    render(
      <ColumnPicker
        columns={columns}
        onVisibilityChange={onVisibilityChange}
        onPinnedChange={onPinnedChange}
        onReset={vi.fn()}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Columns' });
    await user.click(trigger);
    expect(screen.getByRole('checkbox', { name: 'Show Load ID' })).toHaveFocus();

    await user.click(screen.getByRole('checkbox', { name: 'Show Company' }));
    expect(onVisibilityChange).toHaveBeenCalledWith('company', false);
    await user.click(screen.getByRole('checkbox', { name: 'Pin Company' }));
    expect(onPinnedChange).toHaveBeenCalledWith('company', true);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Columns' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
