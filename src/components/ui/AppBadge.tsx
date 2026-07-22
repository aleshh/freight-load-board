import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';
import styles from './AppBadge.module.css';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'brand';

export function AppBadge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: BadgeTone }>) {
  return <span className={cn(styles.badge, styles[tone])}>{children}</span>;
}
