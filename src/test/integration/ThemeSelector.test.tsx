import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../app/ThemeProvider';
import { ThemeSelector } from '../../components/ui/ThemeSelector/ThemeSelector';
import { THEME_STORAGE_KEY } from '../../theme/theme';

describe('ThemeSelector', () => {
  beforeEach(() => localStorage.clear());

  it('persists the selected preference', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Light' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');
  });
});
