import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, BarChart3, Building2, MapPin, Users, DollarSign,
  FileText, CheckSquare, Ticket, Megaphone, Activity, FolderOpen,
  LogOut, ClipboardList, Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/atoms';
import { useAuth } from '@/features/auth/useAuth';
import { useCurrentUserPermissions } from '@/permissions/usePermissions';
import { ROUTES } from '@/routes/routes.config';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={15} />,
  BarChart3: <BarChart3 size={15} />,
  Building2: <Building2 size={15} />,
  MapPin: <MapPin size={15} />,
  Users: <Users size={15} />,
  DollarSign: <DollarSign size={15} />,
  FileText: <FileText size={15} />,
  CheckSquare: <CheckSquare size={15} />,
  Ticket: <Ticket size={15} />,
  Megaphone: <Megaphone size={15} />,
  Activity: <Activity size={15} />,
  FolderOpen: <FolderOpen size={15} />,
  ClipboardList: <ClipboardList size={15} />,
  Palette: <Palette size={15} />,
};

export const Sidebar = React.memo(() => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const perms = useCurrentUserPermissions();

  // Only render routes this user has permission for
  const visibleRoutes = useMemo(
    () => ROUTES.filter(r => r.inNav && r.requiredPermissions.every(p => perms.has(p))),
    [perms]
  );

  // Group by section
  const sections = useMemo(() => {
    const map = new Map<string, typeof ROUTES>();
    for (const route of visibleRoutes) {
      const section = route.section ?? 'nav.sections.operations';
      if (!map.has(section)) map.set(section, []);
      map.get(section)!.push(route);
    }
    return map;
  }, [visibleRoutes]);

  if (!user) return null;

  return (
    <aside
      className="w-60 flex-shrink-0 bg-card border-r border-border flex flex-col h-screen overflow-y-auto"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            FMS
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">Franchise Management</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">System v2.0</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2.5 px-1">
          <Avatar name={user.name} color={user.avatarColor} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">
              {user.role === 'super_admin' ? 'Super Admin'
                : user.role === 'franchisor_staff' ? 'HQ Staff'
                : user.role === 'franchisee_owner' ? 'Franchisee Owner'
                : 'Location Manager'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto" aria-label="Sidebar navigation">
        {Array.from(sections.entries()).map(([sectionKey, routes]) => (
          <div key={sectionKey} className="mb-4">
            <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              {t(sectionKey)}
            </p>
            {routes.map(route => {
              const isActive = location.pathname === route.path || location.pathname.startsWith(`${route.path}/`);
              return (
                <button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  className={cn('nav-item', isActive && 'active')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="opacity-70">{route.icon ? ICON_MAP[route.icon] : null}</span>
                  <span className="flex-1">{t(route.label)}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-border">
        <button
          onClick={logout}
          className="nav-item text-red-400 hover:text-red-300 hover:bg-red-500/10"
          aria-label="Sign out"
        >
          <LogOut size={15} className="opacity-70" />
          <span>{t('nav.signOut')}</span>
        </button>
      </div>
    </aside>
  );
});
Sidebar.displayName = 'Sidebar';
