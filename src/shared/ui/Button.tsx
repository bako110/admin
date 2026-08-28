import { type ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
