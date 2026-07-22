import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import styles from './AppButton.module.css';

const buttonVariants = cva(
  styles.button,
  {
    variants: {
      variant: {
        primary: styles.primary,
        secondary: styles.secondary,
        destructive: styles.destructive,
        ghost: styles.ghost,
        icon: styles.icon,
        compact: styles.compact,
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

export interface AppButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant }), className)} {...props} />
  ),
);
AppButton.displayName = 'AppButton';
