import type { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Badge.module.css';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={clsx(styles.badge, styles[tone])}>{children}</span>;
}
