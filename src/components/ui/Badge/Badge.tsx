import type { PropsWithChildren } from 'react';
import { cn } from '../../../lib/utils';
import styles from './Badge.module.css';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'brand';

export function Badge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: BadgeTone }>) {
  return <span className={cn(styles.badge, styles[tone])}>{children}</span>;
}
