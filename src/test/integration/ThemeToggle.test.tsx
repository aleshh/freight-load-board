import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../app/ThemeProvider';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { THEME_STORAGE_KEY } from '../../theme/theme';

describe('ThemeToggle', () => {
  beforeEach(() => localStorage.clear());

  it('persists the selected preference', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Theme: system/ }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
