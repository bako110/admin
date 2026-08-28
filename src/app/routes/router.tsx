import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '../layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { DestinationsPage } from '../../features/destinations/pages/DestinationsPage';
import { HotelsPage } from '../../features/hotels/pages/HotelsPage';
import { RestaurantsPage } from '../../features/restaurants/pages/RestaurantsPage';
import { GuidesPage } from '../../features/guides/pages/GuidesPage';
import { EventsPage } from '../../features/events/pages/EventsPage';
import { CulturePage } from '../../features/culture/pages/CulturePage';
import { MarketPage } from '../../features/market/pages/MarketPage';
import { MobilityPage } from '../../features/mobility/pages/MobilityPage';
import { HealthPage } from '../../features/health/pages/HealthPage';
import { FinancePage } from '../../features/finance/pages/FinancePage';
import { ConnectivityPage } from '../../features/connectivity/pages/ConnectivityPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/destinations', element: <DestinationsPage /> },
          { path: '/hotels', element: <HotelsPage /> },
          { path: '/restaurants', element: <RestaurantsPage /> },
          { path: '/guides', element: <GuidesPage /> },
          { path: '/events', element: <EventsPage /> },
          { path: '/culture', element: <CulturePage /> },
          { path: '/market', element: <MarketPage /> },
          { path: '/mobility', element: <MobilityPage /> },
          { path: '/health', element: <HealthPage /> },
          { path: '/finance', element: <FinancePage /> },
          { path: '/connectivity', element: <ConnectivityPage /> },
        ],
      },
    ],
  },
]);
