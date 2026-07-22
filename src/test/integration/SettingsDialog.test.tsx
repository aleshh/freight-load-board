import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { DatasetProvider } from '../../app/DatasetProvider';
import { ThemeProvider } from '../../app/ThemeProvider';
import { SettingsDialog } from '../../components/ui/SettingsDialog/SettingsDialog';

describe('SettingsDialog', () => {
  beforeEach(() => localStorage.clear());

  it('exposes all theme states and the large-dataset switch', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <DatasetProvider>
          <SettingsDialog />
        </DatasetProvider>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Light' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Dark' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'System' })).toBeVisible();

    const datasetSwitch = screen.getByRole('switch', { name: 'Load large dataset' });
    expect(datasetSwitch).toHaveAttribute('aria-checked', 'false');
    await user.click(datasetSwitch);
    expect(datasetSwitch).toHaveAttribute('aria-checked', 'true');
  });
});
