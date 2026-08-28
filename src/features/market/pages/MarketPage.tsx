import { useState } from 'react';

import { Tabs } from '../../../shared/ui';
import { ProductsTab } from './ProductsTab';
import { ArtisansTab } from './ArtisansTab';
import styles from '../../../shared/ui/listPage.module.css';

const TABS = [
  { key: 'products', label: 'Produits' },
  { key: 'artisans', label: 'Artisans' },
];

export function MarketPage() {
  const [tab, setTab] = useState('products');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Artisanat</h1>
        </div>
      </div>

      <Tabs items={TABS} active={tab} onChange={setTab} />

      {tab === 'products' && <ProductsTab />}
      {tab === 'artisans' && <ArtisansTab />}
    </div>
  );
}
