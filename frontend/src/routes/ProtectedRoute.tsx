import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { useHasAllPermissions } from '@/permissions/usePermissions';
import type { PermissionKey } from '@/permissions/permissions';

interface ProtectedRouteProps {
  permissions: PermissionKey[];
  children: React.ReactNode;
}

/**
 * Permission-based route guard.
 * - Unauthenticated → redirect to /login
 * - Missing permission → 403 page
 * - All perms satisfied → render children
 */
export function ProtectedRoute({ permissions, children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hasAll = useHasAllPermissions(...permissions);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permissions.length > 0 && !hasAll) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}

function ForbiddenPage() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <p className="text-7xl font-black text-muted-foreground/20 mb-4">403</p>
        <p className="text-xl font-bold text-foreground mb-2">Access Denied</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          You don't have permission to access this page. Contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
