import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import fieldStyles from './FormField.module.css';
import styles from './AppInput.module.css';

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  error?: string;
  hint?: string;
  leadingIcon?: ReactNode;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, hideLabel, error, hint, leadingIcon, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;

    return (
      <div className={fieldStyles.field}>
        <label className={hideLabel ? 'sr-only' : fieldStyles.label} htmlFor={inputId}>
          {label}
        </label>
        <div className={styles.shell}>
          {leadingIcon ? <span className={styles.icon} aria-hidden="true">{leadingIcon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            className={cn(styles.input, leadingIcon && styles.withIcon, className)}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? descriptionId : undefined}
            {...props}
          />
        </div>
        {error || hint ? (
          <p id={descriptionId} className={error ? styles.error : styles.hint}>
            {error ?? hint}
          </p>
        ) : null}
      </div>
    );
  },
);
AppInput.displayName = 'AppInput';
