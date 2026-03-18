import type { UserRole } from '@/types';

/**
 * Permission constants — use these everywhere, never check role strings directly.
 *
 * Adding a new permission: add entry here + add to ROLE_PERMISSIONS below.
 * Adding a new role: add to ROLE_PERMISSIONS — zero route file changes needed.
 */
export const Permission = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  ANALYTICS_VIEW: 'analytics:view',

  // Franchisees
  FRANCHISE_READ: 'franchise:read',
  FRANCHISE_WRITE: 'franchise:write',
  FRANCHISE_DELETE: 'franchise:delete',

  // Locations
  LOCATION_READ: 'location:read',
  LOCATION_WRITE: 'location:write',

  // Users
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DEACTIVATE: 'user:deactivate',

  // Sales
  SALES_READ: 'sales:read',
  SALES_SUBMIT: 'sales:submit',
  SALES_APPROVE: 'sales:approve',

  // Royalties
  ROYALTY_READ: 'royalty:read',
  ROYALTY_APPROVE: 'royalty:approve',
  ROYALTY_REMIND: 'royalty:remind',

  // Tasks
  TASK_READ: 'task:read',
  TASK_WRITE: 'task:write',
  TASK_ASSIGN: 'task:assign',
  TASK_COMPLETE: 'task:complete',
  TASK_DELETE: 'task:delete',

  // Tickets
  TICKET_READ: 'ticket:read',
  TICKET_CREATE: 'ticket:create',
  TICKET_RESOLVE: 'ticket:resolve',
  TICKET_ASSIGN: 'ticket:assign',
  TICKET_REPLY: 'ticket:reply',

  // Announcements
  ANNOUNCEMENT_READ: 'announcement:read',
  ANNOUNCEMENT_BROADCAST: 'announcement:broadcast',
  ANNOUNCEMENT_DELETE: 'announcement:delete',

  // Activity
  ACTIVITY_READ: 'activity:read',

  // Documents
  DOCUMENT_READ: 'document:read',
  DOCUMENT_UPLOAD: 'document:upload',

  // Onboarding
  ONBOARDING_ACCESS: 'onboarding:access',

  // Styleguide
  STYLEGUIDE_VIEW: 'styleguide:view',
} as const;

export type PermissionKey = typeof Permission[keyof typeof Permission];

/** Role → Permissions mapping */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: Object.values(Permission) as PermissionKey[],

  franchisor_staff: [
    Permission.DASHBOARD_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.FRANCHISE_READ,
    Permission.LOCATION_READ,
    Permission.USER_READ,
    Permission.SALES_READ,
    Permission.SALES_APPROVE,
    Permission.ROYALTY_READ,
    Permission.ROYALTY_APPROVE,
    Permission.ROYALTY_REMIND,
    Permission.TASK_READ,
    Permission.TASK_WRITE,
    Permission.TASK_ASSIGN,
    Permission.TASK_COMPLETE,
    Permission.TICKET_READ,
    Permission.TICKET_RESOLVE,
    Permission.TICKET_ASSIGN,
    Permission.TICKET_REPLY,
    Permission.ANNOUNCEMENT_READ,
    Permission.ANNOUNCEMENT_BROADCAST,
    Permission.ACTIVITY_READ,
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_UPLOAD,
    Permission.STYLEGUIDE_VIEW,
  ],

  franchisee_owner: [
    Permission.DASHBOARD_VIEW,
    Permission.FRANCHISE_READ,
    Permission.LOCATION_READ,
    Permission.SALES_READ,
    Permission.SALES_SUBMIT,
    Permission.ROYALTY_READ,
    Permission.TASK_READ,
    Permission.TASK_COMPLETE,
    Permission.TICKET_READ,
    Permission.TICKET_CREATE,
    Permission.TICKET_REPLY,
    Permission.ANNOUNCEMENT_READ,
    Permission.ACTIVITY_READ,
    Permission.DOCUMENT_READ,
    Permission.ONBOARDING_ACCESS,
  ],

  location_manager: [
    Permission.DASHBOARD_VIEW,
    Permission.LOCATION_READ,
    Permission.SALES_READ,
    Permission.SALES_SUBMIT,
    Permission.TASK_READ,
    Permission.TASK_COMPLETE,
    Permission.TICKET_READ,
    Permission.TICKET_CREATE,
    Permission.TICKET_REPLY,
    Permission.ANNOUNCEMENT_READ,
    Permission.DOCUMENT_READ,
  ],
};
