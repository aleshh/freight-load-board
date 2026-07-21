import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

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
      <div className="app-field">
        <label className={hideLabel ? 'sr-only' : 'app-field__label'} htmlFor={inputId}>
          {label}
        </label>
        <div className="app-input-shell">
          {leadingIcon ? <span className="app-input-shell__icon" aria-hidden="true">{leadingIcon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            className={cn('app-input', leadingIcon && 'app-input--with-icon', className)}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? descriptionId : undefined}
            {...props}
          />
        </div>
        {error || hint ? (
          <p id={descriptionId} className={error ? 'app-field__error' : 'app-field__hint'}>
            {error ?? hint}
          </p>
        ) : null}
      </div>
    );
  },
);
AppInput.displayName = 'AppInput';
