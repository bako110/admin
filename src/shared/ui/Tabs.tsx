import clsx from 'clsx';

import styles from './Tabs.module.css';

export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
}

export function Tabs({ items, active, onChange }: TabsProps) {
  return (
    <div className={styles.tabs}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={clsx(styles.tab, active === item.key && styles.tabActive)}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
