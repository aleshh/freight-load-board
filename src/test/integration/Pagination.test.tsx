import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../../components/load-board/Pagination/Pagination';

describe('Pagination', () => {
  it('provides a skip target, announces page status, and preserves native button controls', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={2}
        pageSize={25}
        total={100}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );

    const pagination = screen.getByRole('navigation', { name: 'Load results pagination' });
    expect(pagination).toHaveAttribute('id', 'load-pagination');
    expect(pagination).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('Page 2 of 4')).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
