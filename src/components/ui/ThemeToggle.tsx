import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../app/ThemeProvider';
import type { ThemePreference } from '../../theme/theme';
import { AppButton } from './AppButton';

const choices: ThemePreference[] = ['light', 'dark', 'system'];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const next = choices[(choices.indexOf(preference) + 1) % choices.length];
  const Icon = preference === 'light' ? Sun : preference === 'dark' ? Moon : Monitor;

  return (
    <AppButton
      variant="secondary"
      onClick={() => setPreference(next)}
      aria-label={`Theme: ${preference}. Activate to use ${next} theme.`}
      title={`Theme: ${preference}`}
    >
      <Icon size={17} aria-hidden="true" />
      <span className="theme-toggle__label">{preference}</span>
    </AppButton>
  );
}
