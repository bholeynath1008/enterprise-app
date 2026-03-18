import { ROLE_PERMISSIONS, Permission } from '@/permissions/permissions';
import type { UserRole } from '@/types';

describe('ROLE_PERMISSIONS', () => {
  describe('super_admin', () => {
    const perms = new Set(ROLE_PERMISSIONS.super_admin);

    it('has all permissions', () => {
      const allPerms = Object.values(Permission);
      allPerms.forEach(p => {
        expect(perms.has(p)).toBe(true);
      });
    });
  });

  describe('franchisor_staff', () => {
    const perms = new Set(ROLE_PERMISSIONS.franchisor_staff);

    it('can read franchises', () => expect(perms.has(Permission.FRANCHISE_READ)).toBe(true));
    it('cannot delete franchises', () => expect(perms.has(Permission.FRANCHISE_DELETE)).toBe(false));
    it('can broadcast announcements', () => expect(perms.has(Permission.ANNOUNCEMENT_BROADCAST)).toBe(true));
    it('cannot delete announcements', () => expect(perms.has(Permission.ANNOUNCEMENT_DELETE)).toBe(false));
    it('can approve royalties', () => expect(perms.has(Permission.ROYALTY_APPROVE)).toBe(true));
    it('cannot manage users', () => expect(perms.has(Permission.USER_WRITE)).toBe(false));
  });

  describe('franchisee_owner', () => {
    const perms = new Set(ROLE_PERMISSIONS.franchisee_owner);

    it('can view dashboard', () => expect(perms.has(Permission.DASHBOARD_VIEW)).toBe(true));
    it('cannot access analytics', () => expect(perms.has(Permission.ANALYTICS_VIEW)).toBe(false));
    it('can submit sales', () => expect(perms.has(Permission.SALES_SUBMIT)).toBe(true));
    it('cannot approve sales', () => expect(perms.has(Permission.SALES_APPROVE)).toBe(false));
    it('can create tickets', () => expect(perms.has(Permission.TICKET_CREATE)).toBe(true));
    it('cannot assign tasks', () => expect(perms.has(Permission.TASK_ASSIGN)).toBe(false));
    it('can access onboarding', () => expect(perms.has(Permission.ONBOARDING_ACCESS)).toBe(true));
  });

  describe('location_manager', () => {
    const perms = new Set(ROLE_PERMISSIONS.location_manager);

    it('can view dashboard', () => expect(perms.has(Permission.DASHBOARD_VIEW)).toBe(true));
    it('cannot access analytics', () => expect(perms.has(Permission.ANALYTICS_VIEW)).toBe(false));
    it('cannot read royalties', () => expect(perms.has(Permission.ROYALTY_READ)).toBe(false));
    it('can complete tasks', () => expect(perms.has(Permission.TASK_COMPLETE)).toBe(true));
    it('cannot assign tasks', () => expect(perms.has(Permission.TASK_ASSIGN)).toBe(false));
    it('cannot access onboarding', () => expect(perms.has(Permission.ONBOARDING_ACCESS)).toBe(false));
  });

  it('all roles have DASHBOARD_VIEW', () => {
    const roles: UserRole[] = ['super_admin', 'franchisor_staff', 'franchisee_owner', 'location_manager'];
    roles.forEach(role => {
      expect(ROLE_PERMISSIONS[role]).toContain(Permission.DASHBOARD_VIEW);
    });
  });

  it('no role has undefined permissions', () => {
    const allPerms = new Set(Object.values(Permission));
    Object.values(ROLE_PERMISSIONS).forEach(rolePerms => {
      rolePerms.forEach(p => {
        expect(allPerms.has(p)).toBe(true);
      });
    });
  });
});
