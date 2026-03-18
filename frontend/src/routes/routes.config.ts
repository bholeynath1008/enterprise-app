import { lazy } from 'react';
import type { PermissionKey } from '@/permissions/permissions';
import { Permission } from '@/permissions/permissions';

// Code-split all pages
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const AnalyticsPage = lazy(() => import('@/features/dashboard/AnalyticsPage'));
const FranchiseesPage = lazy(() => import('@/features/franchisees/FranchiseesPage'));
const LocationsPage = lazy(() => import('@/features/franchisees/LocationsPage'));
const UsersPage = lazy(() => import('@/features/franchisees/UsersPage'));
const RoyaltiesPage = lazy(() => import('@/features/royalties/RoyaltiesPage'));
const SalesPage = lazy(() => import('@/features/sales/SalesPage'));
const TasksPage = lazy(() => import('@/features/tasks/TasksPage'));
const TicketsPage = lazy(() => import('@/features/tickets/TicketsPage'));
const AnnouncementsPage = lazy(() => import('@/features/announcements/AnnouncementsPage'));
const ActivityPage = lazy(() => import('@/features/announcements/ActivityPage'));
const DocumentsPage = lazy(() => import('@/features/announcements/DocumentsPage'));
const OnboardingWizard = lazy(() => import('@/features/onboarding/OnboardingWizard'));
const StyleguidePage = lazy(() => import('@/features/styleguide/StyleguidePage'));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<() => JSX.Element>;
  requiredPermissions: PermissionKey[];
  label: string;
  /** Nav section label */
  section?: string;
  /** Lucide icon name (used by Sidebar) */
  icon?: string;
  /** Show in sidebar nav */
  inNav?: boolean;
}

/**
 * Single source of truth for all app routes.
 * To add a new route: add entry here. Zero other file changes needed.
 */
export const ROUTES: RouteConfig[] = [
  {
    path: '/dashboard',
    element: DashboardPage,
    requiredPermissions: [Permission.DASHBOARD_VIEW],
    label: 'nav.dashboard',
    section: 'nav.sections.overview',
    icon: 'LayoutDashboard',
    inNav: true,
  },
  {
    path: '/analytics',
    element: AnalyticsPage,
    requiredPermissions: [Permission.ANALYTICS_VIEW],
    label: 'nav.analytics',
    section: 'nav.sections.overview',
    icon: 'BarChart3',
    inNav: true,
  },
  {
    path: '/franchisees',
    element: FranchiseesPage,
    requiredPermissions: [Permission.FRANCHISE_READ],
    label: 'nav.franchisees',
    section: 'nav.sections.management',
    icon: 'Building2',
    inNav: true,
  },
  {
    path: '/locations',
    element: LocationsPage,
    requiredPermissions: [Permission.LOCATION_READ],
    label: 'nav.locations',
    section: 'nav.sections.management',
    icon: 'MapPin',
    inNav: true,
  },
  {
    path: '/users',
    element: UsersPage,
    requiredPermissions: [Permission.USER_READ],
    label: 'nav.users',
    section: 'nav.sections.management',
    icon: 'Users',
    inNav: true,
  },
  {
    path: '/royalties',
    element: RoyaltiesPage,
    requiredPermissions: [Permission.ROYALTY_READ],
    label: 'nav.royalties',
    section: 'nav.sections.finance',
    icon: 'DollarSign',
    inNav: true,
  },
  {
    path: '/sales',
    element: SalesPage,
    requiredPermissions: [Permission.SALES_READ],
    label: 'nav.sales',
    section: 'nav.sections.finance',
    icon: 'FileText',
    inNav: true,
  },
  {
    path: '/tasks',
    element: TasksPage,
    requiredPermissions: [Permission.TASK_READ],
    label: 'nav.tasks',
    section: 'nav.sections.operations',
    icon: 'CheckSquare',
    inNav: true,
  },
  {
    path: '/tickets',
    element: TicketsPage,
    requiredPermissions: [Permission.TICKET_READ],
    label: 'nav.tickets',
    section: 'nav.sections.operations',
    icon: 'Ticket',
    inNav: true,
  },
  {
    path: '/announcements',
    element: AnnouncementsPage,
    requiredPermissions: [Permission.ANNOUNCEMENT_READ],
    label: 'nav.announcements',
    section: 'nav.sections.operations',
    icon: 'Megaphone',
    inNav: true,
  },
  {
    path: '/activity',
    element: ActivityPage,
    requiredPermissions: [Permission.ACTIVITY_READ],
    label: 'nav.activity',
    section: 'nav.sections.operations',
    icon: 'Activity',
    inNav: true,
  },
  {
    path: '/documents',
    element: DocumentsPage,
    requiredPermissions: [Permission.DOCUMENT_READ],
    label: 'nav.documents',
    section: 'nav.sections.operations',
    icon: 'FolderOpen',
    inNav: true,
  },
  {
    path: '/onboarding',
    element: OnboardingWizard,
    requiredPermissions: [Permission.ONBOARDING_ACCESS],
    label: 'nav.onboarding',
    section: 'nav.sections.operations',
    icon: 'ClipboardList',
    inNav: true,
  },
  {
    path: '/styleguide',
    element: StyleguidePage,
    requiredPermissions: [Permission.STYLEGUIDE_VIEW],
    label: 'nav.styleguide',
    section: 'nav.sections.system',
    icon: 'Palette',
    inNav: true,
  },
];
