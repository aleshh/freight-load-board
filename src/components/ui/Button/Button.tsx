import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import styles from './Button.module.css';

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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
