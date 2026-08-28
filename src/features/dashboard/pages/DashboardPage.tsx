import { Link } from 'react-router-dom';
import {
  Map,
  BedDouble,
  UtensilsCrossed,
  Landmark,
  Wifi,
  Bus,
  Compass,
  PartyPopper,
  ScrollText,
  ShoppingBasket,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';

import { Card, Spinner } from '../../../shared/ui';
import { useDashboardStats } from '../hooks/useDashboardStats';
import styles from './DashboardPage.module.css';

const ICONS: Record<string, typeof Map> = {
  destinations: Map,
  hotels: BedDouble,
  restaurants: UtensilsCrossed,
  guides: Compass,
  events: PartyPopper,
  culture: ScrollText,
  market: ShoppingBasket,
  mobility: Bus,
  health: Stethoscope,
  finance: Landmark,
  connectivity: Wifi,
};

export function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const total = stats?.reduce((sum, s) => sum + s.total, 0) ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Vue d'ensemble du contenu publié sur GoTours.</p>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && stats && (
        <>
          <Card className={styles.totalCard}>
            <span className={styles.totalLabel}>Total des contenus enregistrés</span>
            <span className={styles.totalValue}>{total}</span>
          </Card>

          <div className={styles.grid}>
            {stats.map((stat) => {
              const Icon = ICONS[stat.key] ?? Map;
              return (
                <Link key={stat.key} to={stat.to} className={styles.statLink}>
                  <Card className={styles.statCard}>
                    <span className={styles.statIcon}>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div className={styles.statBody}>
                      <span className={styles.statValue}>{stat.total}</span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                    <ArrowRight size={16} strokeWidth={2} className={styles.statArrow} />
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
