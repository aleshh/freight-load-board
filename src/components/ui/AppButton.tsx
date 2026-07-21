import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'app-button inline-flex items-center justify-center gap-2 rounded-control text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'app-button--primary',
        secondary: 'app-button--secondary',
        destructive: 'app-button--destructive',
        ghost: 'app-button--ghost',
        icon: 'app-button--icon',
        compact: 'app-button--compact',
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
