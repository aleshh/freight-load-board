import * as Dialog from '@radix-ui/react-dialog';
import { Settings, X } from 'lucide-react';
import { useDatasetPreference } from '../../app/DatasetProvider';
import { AppButton } from './AppButton';
import { AppSwitch } from './AppSwitch';
import { ThemeToggle } from './ThemeToggle';

export function SettingsDialog() {
  const { largeDataset, setLargeDataset } = useDatasetPreference();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <AppButton variant="icon" aria-label="Open settings">
          <Settings size={19} aria-hidden="true" />
        </AppButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="settings-dialog__overlay" />
        <Dialog.Content className="settings-dialog__content">
          <div className="settings-dialog__header">
            <div>
              <Dialog.Title className="settings-dialog__title">Settings</Dialog.Title>
              <Dialog.Description className="settings-dialog__description">Customize the load board for this browser.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <AppButton variant="icon" aria-label="Close settings">
                <X size={18} aria-hidden="true" />
              </AppButton>
            </Dialog.Close>
          </div>

          <section className="settings-section" aria-labelledby="theme-setting-heading">
            <h2 id="theme-setting-heading">Appearance</h2>
            <p>Choose how Freightflow looks.</p>
            <ThemeToggle />
          </section>

          <section className="settings-section" aria-labelledby="data-setting-heading">
            <h2 id="data-setting-heading">Demonstration data</h2>
            <AppSwitch
              id="large-dataset"
              checked={largeDataset}
              onCheckedChange={setLargeDataset}
              label="Load large dataset"
              description="Use 10,000 freight records instead of the standard 48."
            />
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
