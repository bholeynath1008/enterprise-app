export type UserRole =
  | 'super_admin'
  | 'franchisor_staff'
  | 'franchisee_owner'
  | 'location_manager';

export type FranchiseeStatus = 'active' | 'warning' | 'suspended' | 'inactive';
export type RoyaltyStatus = 'paid' | 'pending' | 'overdue';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SalesReportStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarColor: string;
  franchiseIds: string[] | null;
  locationIds: string[] | null;
  createdAt: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface Franchisee {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  status: FranchiseeStatus;
  plan: string;
  joinDate: string;
  locationCount: number;
  complianceScore: number;
  phone: string;
  address: string;
  royaltyRate: number;
}

export interface Location {
  id: string;
  name: string;
  franchiseId: string;
  franchiseName: string;
  city: string;
  state: string;
  address: string;
  manager: string;
  managerId: string;
  status: 'active' | 'inactive' | 'suspended';
  monthSales: number;
  phone: string;
  openedDate: string;
}

export interface SalesReport {
  id: string;
  franchiseId: string;
  locationId: string;
  month: string;
  grossSales: number;
  netSales: number;
  royaltyDue: number;
  status: SalesReportStatus;
  submittedAt: string | null;
  submittedBy: string | null;
  attachmentUrl: string | null;
  notes: string;
}

export interface SalesSummary {
  totalGross: number;
  totalNet: number;
  totalRoyalty: number;
  count: number;
}

export interface Royalty {
  id: string;
  franchiseId: string;
  franchiseName: string;
  period: string;
  amountDue: number;
  amountPaid: number;
  status: RoyaltyStatus;
  dueDate: string;
  paidDate: string | null;
  notes: string;
}

export interface RoyaltySummary {
  totalDue: number;
  totalPaid: number;
  totalOverdue: number;
  overdueCount: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedType: 'global' | 'franchisee' | 'location';
  assignedToName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
  completedBy: string | null;
  photoProofUrl: string | null;
}

export interface TicketReply {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  franchiseId: string;
  locationId: string | null;
  priority: TaskPriority;
  status: TicketStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  assignedTo: string | null;
  assignedToName: string | null;
  resolvedAt: string | null;
  replies: TicketReply[];
}

export interface TicketSummary {
  open: number;
  in_progress: number;
  resolved: number;
  high: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  sentBy: string;
  sentByName: string;
  sentAt: string;
  audience: 'all' | 'owners' | 'managers';
  priority: TaskPriority;
  pinned: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  actor: string;
  actorId: string;
  target: string;
  targetId: string;
  entityType: string;
  franchiseId: string | null;
  timestamp: string;
}

export interface DashboardStats {
  totalFranchisees: number;
  activeFranchisees: number;
  totalLocations: number;
  openTickets: number;
  pendingTasks: number;
  totalSalesYTD: number;
  totalRoyaltiesCollected: number;
  overdueRoyalties: number;
  overdueRoyaltyCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
