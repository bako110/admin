import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
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
  LogOut,
  Shield,
} from 'lucide-react';
import clsx from 'clsx';

import { ToastViewport } from '../../shared/ui';
import { useAuthStore } from '../../store/auth.store';
import styles from './AppLayout.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Tableau de bord', Icon: LayoutDashboard },
  { to: '/destinations', label: 'Destinations', Icon: Map },
  { to: '/hotels', label: 'Hébergements', Icon: BedDouble },
  { to: '/restaurants', label: 'Restaurants', Icon: UtensilsCrossed },
  { to: '/guides', label: 'Guides', Icon: Compass },
  { to: '/events', label: 'Événements', Icon: PartyPopper },
  { to: '/culture', label: 'Culture', Icon: ScrollText },
  { to: '/market', label: 'Artisanat', Icon: ShoppingBasket },
  { to: '/mobility', label: 'Transport', Icon: Bus },
  { to: '/health', label: 'Santé', Icon: Stethoscope },
  { to: '/finance', label: 'Banques & argent', Icon: Landmark },
  { to: '/connectivity', label: 'Connectivité', Icon: Wifi },
] as const;

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <Shield size={20} strokeWidth={1.75} />
          </span>
          <span>GoTours Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
            >
              <Icon size={17} strokeWidth={2} className={styles.navIcon} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.full_name}</span>
              <span className={styles.userRole}>{user.role === 'admin' ? 'Administrateur' : 'Modérateur'}</span>
            </div>
          )}
          <button type="button" className={styles.logoutBtn} onClick={clearSession}>
            <LogOut size={16} strokeWidth={2} />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  );
}
