import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useTheme } from '../../app/ThemeProvider';
import type { ThemePreference } from '../../theme/theme';
import { AppButton } from './AppButton';
import styles from './ThemeToggle.module.css';

const choices: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className={styles.choices} role="group" aria-label="Theme preference">
      {choices.map(({ value, label, icon: Icon }) => (
        <AppButton
          key={value}
          variant={preference === value ? 'primary' : 'secondary'}
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
          className={styles.button}
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </AppButton>
      ))}
    </div>
  );
}
