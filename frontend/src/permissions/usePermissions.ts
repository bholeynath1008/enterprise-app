import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { ROLE_PERMISSIONS, type PermissionKey } from './permissions';

/**
 * Returns the full Set of permissions for the current user.
 * Memoized — only recomputes when the user changes.
 */
export function useCurrentUserPermissions(): Set<PermissionKey> {
  const user = useAppSelector(selectCurrentUser);
  return useMemo(() => {
    if (!user) return new Set<PermissionKey>();
    return new Set(ROLE_PERMISSIONS[user.role] ?? []);
  }, [user]);
}

/**
 * Returns true if the current user has the given permission.
 * @example
 *   const canBroadcast = useHasPermission(Permission.ANNOUNCEMENT_BROADCAST);
 */
export function useHasPermission(permission: PermissionKey): boolean {
  const perms = useCurrentUserPermissions();
  return perms.has(permission);
}

/**
 * Returns true if the current user has ALL of the given permissions.
 */
export function useHasAllPermissions(...permissions: PermissionKey[]): boolean {
  const perms = useCurrentUserPermissions();
  return permissions.every(p => perms.has(p));
}

/**
 * Returns true if the current user has ANY of the given permissions.
 */
export function useHasAnyPermission(...permissions: PermissionKey[]): boolean {
  const perms = useCurrentUserPermissions();
  return permissions.some(p => perms.has(p));
}
