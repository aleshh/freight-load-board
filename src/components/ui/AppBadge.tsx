import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'brand';

export function AppBadge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: BadgeTone }>) {
  return <span className={cn('app-badge', `app-badge--${tone}`)}>{children}</span>;
}
