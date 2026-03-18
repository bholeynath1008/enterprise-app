import { v4 as uuidv4 } from 'uuid';
import type {
  User, Franchisee, Location, SalesReport,
  Royalty, Task, Ticket, Announcement, ActivityLog,
} from './types';

export const db = {
  users: [] as User[],
  franchisees: [] as Franchisee[],
  locations: [] as Location[],
  salesReports: [] as SalesReport[],
  royalties: [] as Royalty[],
  tasks: [] as Task[],
  tickets: [] as Ticket[],
  announcements: [] as Announcement[],
  activityLog: [] as ActivityLog[],
};

export function seedDatabase(): void {
  console.log('\n🌱 Seeding in-memory database...');

  // ---- USERS ----
  db.users = [
    { id: 'u1', email: 'admin@fms.com', password: 'admin123', name: 'Alexandra Chen', role: 'super_admin', avatarColor: 'blue', franchiseIds: null, locationIds: null, createdAt: '2020-01-01', isActive: true },
    { id: 'u2', email: 'ops@fms.com', password: 'ops123', name: 'Marcus Webb', role: 'franchisor_staff', avatarColor: 'purple', franchiseIds: null, locationIds: null, createdAt: '2020-03-15', isActive: true },
    { id: 'u3', email: 'support@fms.com', password: 'support123', name: 'Priya Sharma', role: 'franchisor_staff', avatarColor: 'cyan', franchiseIds: null, locationIds: null, createdAt: '2021-01-10', isActive: true },
    { id: 'u4', email: 'owner1@pizzapalace.com', password: 'owner123', name: 'Tony Ricci', role: 'franchisee_owner', avatarColor: 'amber', franchiseIds: ['f1'], locationIds: ['l1', 'l2', 'l3'], createdAt: '2021-03-15', isActive: true },
    { id: 'u5', email: 'owner2@burgerbarn.com', password: 'owner123', name: 'Sarah Kim', role: 'franchisee_owner', avatarColor: 'emerald', franchiseIds: ['f2'], locationIds: ['l4', 'l5'], createdAt: '2022-01-10', isActive: true },
    { id: 'u6', email: 'owner3@tacotime.com', password: 'owner123', name: 'Carlos Rivera', role: 'franchisee_owner', avatarColor: 'amber', franchiseIds: ['f3'], locationIds: ['l6', 'l7', 'l8'], createdAt: '2020-08-22', isActive: true },
    { id: 'u7', email: 'owner4@subshop.com', password: 'owner123', name: 'Janet Moore', role: 'franchisee_owner', avatarColor: 'blue', franchiseIds: ['f4'], locationIds: ['l9'], createdAt: '2022-06-05', isActive: true },
    { id: 'u8', email: 'mgr1@pizzapalace.com', password: 'mgr123', name: 'Dave Logan', role: 'location_manager', avatarColor: 'purple', franchiseIds: ['f1'], locationIds: ['l1'], createdAt: '2021-04-01', isActive: true },
    { id: 'u9', email: 'mgr2@pizzapalace.com', password: 'mgr123', name: 'Amy Chen', role: 'location_manager', avatarColor: 'emerald', franchiseIds: ['f1'], locationIds: ['l2'], createdAt: '2021-05-15', isActive: true },
    { id: 'u10', email: 'mgr3@burgerbarn.com', password: 'mgr123', name: 'Jake Wilson', role: 'location_manager', avatarColor: 'blue', franchiseIds: ['f2'], locationIds: ['l4'], createdAt: '2022-02-01', isActive: true },
  ];

  // ---- FRANCHISEES ----
  db.franchisees = [
    { id: 'f1', name: 'Pizza Palace Group', owner: 'Tony Ricci', ownerId: 'u4', status: 'active', plan: 'Premium', joinDate: '2021-03-15', locationCount: 3, complianceScore: 92, phone: '(212) 555-0101', address: '100 Broadway, New York, NY 10001', royaltyRate: 5.5 },
    { id: 'f2', name: 'Burger Barn Co.', owner: 'Sarah Kim', ownerId: 'u5', status: 'active', plan: 'Standard', joinDate: '2022-01-10', locationCount: 2, complianceScore: 78, phone: '(310) 555-0202', address: '200 Sunset Blvd, Los Angeles, CA 90028', royaltyRate: 6.0 },
    { id: 'f3', name: 'Taco Time LLC', owner: 'Carlos Rivera', ownerId: 'u6', status: 'active', plan: 'Premium', joinDate: '2020-08-22', locationCount: 3, complianceScore: 95, phone: '(512) 555-0303', address: '300 Congress Ave, Austin, TX 78701', royaltyRate: 5.5 },
    { id: 'f4', name: 'Sub Shop Inc.', owner: 'Janet Moore', ownerId: 'u7', status: 'warning', plan: 'Standard', joinDate: '2022-06-05', locationCount: 1, complianceScore: 61, phone: '(312) 555-0404', address: '400 Michigan Ave, Chicago, IL 60601', royaltyRate: 6.0 },
    { id: 'f5', name: 'Noodle Nation', owner: 'Robert Park', ownerId: 'u11', status: 'active', plan: 'Enterprise', joinDate: '2019-11-30', locationCount: 5, complianceScore: 88, phone: '(415) 555-0505', address: '500 Market St, San Francisco, CA 94105', royaltyRate: 5.0 },
    { id: 'f6', name: 'Wrap World', owner: 'Lisa Torres', ownerId: 'u12', status: 'active', plan: 'Standard', joinDate: '2023-02-14', locationCount: 2, complianceScore: 83, phone: '(305) 555-0606', address: '600 Biscayne Blvd, Miami, FL 33101', royaltyRate: 6.0 },
    { id: 'f7', name: 'Wing Zone HQ', owner: 'Mike Anderson', ownerId: 'u13', status: 'suspended', plan: 'Standard', joinDate: '2021-09-01', locationCount: 4, complianceScore: 45, phone: '(404) 555-0707', address: '700 Peachtree St, Atlanta, GA 30308', royaltyRate: 6.0 },
    { id: 'f8', name: 'Smoothie Stop', owner: 'Emma Davis', ownerId: 'u14', status: 'active', plan: 'Premium', joinDate: '2022-04-18', locationCount: 2, complianceScore: 97, phone: '(206) 555-0808', address: '800 Pike St, Seattle, WA 98101', royaltyRate: 5.5 },
  ];

  // ---- LOCATIONS ----
  db.locations = [
    { id: 'l1', name: 'Pizza Palace - Downtown', franchiseId: 'f1', franchiseName: 'Pizza Palace Group', city: 'New York', state: 'NY', address: '123 Main St', manager: 'Dave Logan', managerId: 'u8', status: 'active', monthSales: 48200, phone: '(212) 555-1001', openedDate: '2021-04-01' },
    { id: 'l2', name: 'Pizza Palace - Midtown', franchiseId: 'f1', franchiseName: 'Pizza Palace Group', city: 'New York', state: 'NY', address: '456 5th Ave', manager: 'Amy Chen', managerId: 'u9', status: 'active', monthSales: 52100, phone: '(212) 555-1002', openedDate: '2021-06-15' },
    { id: 'l3', name: 'Pizza Palace - Brooklyn', franchiseId: 'f1', franchiseName: 'Pizza Palace Group', city: 'Brooklyn', state: 'NY', address: '789 Atlantic Ave', manager: 'Pat Silva', managerId: 'u16', status: 'active', monthSales: 39800, phone: '(718) 555-1003', openedDate: '2022-01-10' },
    { id: 'l4', name: 'Burger Barn - Westside', franchiseId: 'f2', franchiseName: 'Burger Barn Co.', city: 'Los Angeles', state: 'CA', address: '321 Wilshire Blvd', manager: 'Jake Wilson', managerId: 'u10', status: 'active', monthSales: 61400, phone: '(310) 555-2001', openedDate: '2022-02-01' },
    { id: 'l5', name: 'Burger Barn - Valley', franchiseId: 'f2', franchiseName: 'Burger Barn Co.', city: 'Los Angeles', state: 'CA', address: '654 Ventura Blvd', manager: 'Sam Park', managerId: 'u17', status: 'active', monthSales: 44300, phone: '(818) 555-2002', openedDate: '2022-05-20' },
    { id: 'l6', name: 'Taco Time - Austin Central', franchiseId: 'f3', franchiseName: 'Taco Time LLC', city: 'Austin', state: 'TX', address: '111 6th St', manager: 'Rosa Diaz', managerId: 'u15', status: 'active', monthSales: 38700, phone: '(512) 555-3001', openedDate: '2020-09-01' },
    { id: 'l7', name: 'Taco Time - South Lamar', franchiseId: 'f3', franchiseName: 'Taco Time LLC', city: 'Austin', state: 'TX', address: '222 S Lamar Blvd', manager: 'Juan Perez', managerId: 'u18', status: 'active', monthSales: 42500, phone: '(512) 555-3002', openedDate: '2021-03-15' },
    { id: 'l8', name: 'Taco Time - Round Rock', franchiseId: 'f3', franchiseName: 'Taco Time LLC', city: 'Round Rock', state: 'TX', address: '333 University Blvd', manager: 'Ana Cruz', managerId: 'u19', status: 'active', monthSales: 31200, phone: '(512) 555-3003', openedDate: '2021-08-01' },
    { id: 'l9', name: 'Sub Shop - Chicago Loop', franchiseId: 'f4', franchiseName: 'Sub Shop Inc.', city: 'Chicago', state: 'IL', address: '444 State St', manager: 'Tom Brady', managerId: 'u20', status: 'active', monthSales: 29800, phone: '(312) 555-4001', openedDate: '2022-07-01' },
  ];

  // ---- SALES REPORTS ----
  const salesBase = [
    { franchiseId: 'f1', locationId: 'l1', base: 46000 },
    { franchiseId: 'f1', locationId: 'l2', base: 51000 },
    { franchiseId: 'f2', locationId: 'l4', base: 60000 },
    { franchiseId: 'f3', locationId: 'l6', base: 37000 },
    { franchiseId: 'f4', locationId: 'l9', base: 28000 },
  ];
  const months = ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'];
  let srId = 1;
  for (const s of salesBase) {
    for (let mi = 0; mi < months.length; mi++) {
      const gross = Math.round(s.base * (0.85 + Math.random() * 0.3));
      const net = Math.round(gross * 0.97);
      const fran = db.franchisees.find(f => f.id === s.franchiseId);
      const royaltyDue = Math.round(net * (fran?.royaltyRate ?? 6) / 100);
      const isRecent = mi >= 4;
      db.salesReports.push({
        id: `s${srId++}`,
        franchiseId: s.franchiseId, locationId: s.locationId,
        month: months[mi], grossSales: gross, netSales: net, royaltyDue,
        status: isRecent ? (Math.random() > 0.4 ? 'submitted' : 'pending') : 'approved',
        submittedAt: !isRecent ? `2024-12-${10 + mi}` : null,
        submittedBy: 'u4', attachmentUrl: null, notes: '',
      });
    }
  }

  // ---- ROYALTIES ----
  const periods = ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'];
  let rId = 1;
  for (const f of db.franchisees) {
    for (let pi = 0; pi < periods.length; pi++) {
      const isLatest = pi === periods.length - 1;
      const base = f.locationCount * 18000 + Math.round(Math.random() * 8000);
      let status: 'paid' | 'pending' | 'overdue' = 'paid';
      if (isLatest) {
        if (f.status === 'suspended' || f.status === 'warning') status = 'overdue';
        else if (Math.random() > 0.7) status = 'pending';
      }
      db.royalties.push({
        id: `r${rId++}`, franchiseId: f.id, franchiseName: f.name,
        period: periods[pi],
        amountDue: base, amountPaid: status === 'paid' ? base : 0,
        status,
        dueDate: ['2024-07-15', '2024-10-15', '2025-01-15', '2025-04-15'][pi],
        paidDate: status === 'paid' ? `2025-0${1 + pi}-10` : null,
        notes: status === 'overdue' ? 'Payment overdue.' : '',
      });
    }
  }

  // ---- TASKS ----
  const taskTitles = [
    'Complete Q1 Food Safety Audit', 'Update Menu Pricing Spring 2025',
    'Staff Training — Food Allergen Module', 'Quarterly Equipment Inspection',
    'POS System Update v4.2', 'Health Code Compliance Check',
    'Employee Handbook Acknowledgment', 'Deep Clean Kitchen Monthly',
    'Submit Monthly Sales Report', 'Review Royalty Invoice',
    'Brand Standards Visual Audit', 'Fire Safety Equipment Check',
    'Customer Survey Distribution', 'Waste Management Log Update',
    'Royalty Overdue Follow Up',
  ];
  let tId = 1;
  const statuses: Array<'pending' | 'in_progress' | 'completed'> = ['pending', 'in_progress', 'completed'];
  const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];

  for (let i = 0; i < 5; i++) {
    db.tasks.push({ id: `t${tId++}`, title: taskTitles[i % taskTitles.length], description: 'Global task for all franchisees.', assignedTo: 'all', assignedType: 'global', assignedToName: 'All Franchisees', priority: priorities[tId % 3], status: statuses[tId % 3], dueDate: new Date(Date.now() + (tId * 3) * 86400000).toISOString().split('T')[0], createdBy: 'u1', createdAt: '2025-04-01', completedAt: null, completedBy: null, photoProofUrl: null });
  }
  for (const fid of ['f1', 'f2', 'f3', 'f4']) {
    for (let i = 0; i < 5; i++) {
      const st = statuses[(tId + i) % 3];
      db.tasks.push({ id: `t${tId++}`, title: taskTitles[(tId + i) % taskTitles.length], description: `Task assigned to franchise ${fid}.`, assignedTo: fid, assignedType: 'franchisee', assignedToName: db.franchisees.find(f => f.id === fid)?.name ?? fid, priority: priorities[tId % 3], status: st, dueDate: new Date(Date.now() + (tId * 2) * 86400000).toISOString().split('T')[0], createdBy: 'u2', createdAt: '2025-03-15', completedAt: st === 'completed' ? '2025-04-15' : null, completedBy: st === 'completed' ? 'u4' : null, photoProofUrl: null });
    }
  }
  for (const lid of ['l1', 'l2', 'l4', 'l6']) {
    for (let i = 0; i < 4; i++) {
      const st = statuses[(tId + i) % 3];
      const loc = db.locations.find(l => l.id === lid);
      db.tasks.push({ id: `t${tId++}`, title: taskTitles[(tId + i + 3) % taskTitles.length], description: `Location-specific task.`, assignedTo: lid, assignedType: 'location', assignedToName: loc?.name ?? lid, priority: priorities[tId % 3], status: st, dueDate: new Date(Date.now() + tId * 86400000).toISOString().split('T')[0], createdBy: 'u3', createdAt: '2025-04-01', completedAt: st === 'completed' ? '2025-04-25' : null, completedBy: null, photoProofUrl: null });
    }
  }

  // ---- TICKETS ----
  const ticketTemplates = [
    { title: 'POS System Freezing', desc: 'Freezes every few hours. Need urgent fix.', priority: 'high' as const },
    { title: 'Royalty Portal Error 502', desc: 'Cannot login to payment portal.', priority: 'high' as const },
    { title: 'Training Videos Broken', desc: 'Module 3 and 4 return 404.', priority: 'medium' as const },
    { title: 'Royalty Rate Question', desc: 'Q2 invoice shows wrong rate.', priority: 'low' as const },
    { title: 'Walk-In Cooler Failure', desc: 'Temperature above safe levels.', priority: 'high' as const },
    { title: 'Digital Menu Board Wrong Prices', desc: 'Showing old prices after update.', priority: 'medium' as const },
    { title: 'Uniform Order Delay', desc: 'No delivery confirmation after 3 weeks.', priority: 'low' as const },
    { title: 'HQ App Login Issues', desc: 'Unauthorized error after recent update.', priority: 'medium' as const },
    { title: 'Insurance Certificate Notice', desc: 'Renewal submitted, need confirmation.', priority: 'high' as const },
    { title: 'Delivery Platform Down', desc: 'Not syncing with POS since Wednesday.', priority: 'high' as const },
  ];

  const ticketOwners = [
    { franchiseId: 'f1', locationId: 'l1', createdBy: 'u8', name: 'Dave Logan' },
    { franchiseId: 'f1', locationId: null, createdBy: 'u4', name: 'Tony Ricci' },
    { franchiseId: 'f2', locationId: 'l4', createdBy: 'u10', name: 'Jake Wilson' },
    { franchiseId: 'f2', locationId: null, createdBy: 'u5', name: 'Sarah Kim' },
    { franchiseId: 'f3', locationId: null, createdBy: 'u6', name: 'Carlos Rivera' },
  ];

  const ticketStatuses: Array<'open' | 'in_progress' | 'resolved'> = ['open', 'in_progress', 'resolved'];
  let tkId = 1;
  for (const to of ticketOwners) {
    for (let i = 0; i < 9; i++) {
      const tmpl = ticketTemplates[(tkId + i) % ticketTemplates.length];
      const st = ticketStatuses[(tkId + i) % 3];
      const assigned = st !== 'open' ? (tkId % 2 === 0 ? 'u2' : 'u3') : null;
      db.tickets.push({
        id: `tk${tkId++}`, title: tmpl.title, description: tmpl.desc,
        franchiseId: to.franchiseId, locationId: to.locationId,
        priority: tmpl.priority, status: st,
        createdBy: to.createdBy, createdByName: to.name,
        createdAt: `2025-0${3 + (tkId % 3)}-${String(1 + (tkId % 27)).padStart(2, '0')}`,
        assignedTo: assigned,
        assignedToName: assigned === 'u2' ? 'Marcus Webb' : assigned === 'u3' ? 'Priya Sharma' : null,
        resolvedAt: st === 'resolved' ? '2025-05-10' : null,
        replies: st !== 'open' ? [{ id: `rep_${tkId}`, authorId: 'u2', authorName: 'Marcus Webb', body: 'We are investigating this issue.', createdAt: `2025-04-${String(10 + (tkId % 18)).padStart(2, '0')}` }] : [],
      });
    }
  }

  // ---- ANNOUNCEMENTS ----
  db.announcements = [
    { id: 'a1', title: 'Q2 2025 Royalty Rate Update', body: 'Standard rate adjusts to 6% of net sales effective July 1. Premium stays at 5.5%. Enterprise at 5.0%.', sentBy: 'u1', sentByName: 'Alexandra Chen', sentAt: '2025-05-01', audience: 'all', priority: 'high', pinned: true },
    { id: 'a2', title: 'New Training Portal June 1', body: 'Upgraded training portal with video courses and certifications. Migrate by May 31.', sentBy: 'u2', sentByName: 'Marcus Webb', sentAt: '2025-04-28', audience: 'managers', priority: 'medium', pinned: false },
    { id: 'a3', title: 'Summer LTO Menu Approved', body: 'Summer limited-time items approved. Assets in Brand Resources. Launch June 1–Aug 31.', sentBy: 'u1', sentByName: 'Alexandra Chen', sentAt: '2025-04-25', audience: 'all', priority: 'low', pinned: false },
    { id: 'a4', title: 'System Maintenance May 25', body: 'Platform under maintenance 2–4 AM EST. No action required.', sentBy: 'u3', sentByName: 'Priya Sharma', sentAt: '2025-05-20', audience: 'all', priority: 'medium', pinned: false },
    { id: 'a5', title: 'Q1 Compliance Deadline May 31', body: 'Submit food safety audit, equipment photos, and training certificates.', sentBy: 'u1', sentByName: 'Alexandra Chen', sentAt: '2025-05-15', audience: 'all', priority: 'high', pinned: true },
    { id: 'a6', title: 'Annual Summit — Nashville Sept 18-20', body: 'Save the date: FMS Annual Franchisee Summit 2025 in Nashville, TN.', sentBy: 'u1', sentByName: 'Alexandra Chen', sentAt: '2025-04-18', audience: 'owners', priority: 'medium', pinned: false },
  ];

  // ---- ACTIVITY LOG ----
  db.activityLog = [
    { id: 'al1', action: 'Sales report submitted', actor: 'Tony Ricci', actorId: 'u4', target: 'Pizza Palace Downtown — Apr 2025', targetId: 's1', entityType: 'sales_report', franchiseId: 'f1', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'al2', action: 'Support ticket opened', actor: 'Sarah Kim', actorId: 'u5', target: 'Royalty Portal Error', targetId: 'tk2', entityType: 'ticket', franchiseId: 'f2', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: 'al3', action: 'Task marked complete', actor: 'Jake Wilson', actorId: 'u10', target: 'Health Code Check', targetId: 't7', entityType: 'task', franchiseId: 'f2', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'al4', action: 'Announcement broadcast', actor: 'Alexandra Chen', actorId: 'u1', target: 'Q2 Royalty Rate Update', targetId: 'a1', entityType: 'announcement', franchiseId: null, timestamp: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: 'al5', action: 'Royalty payment recorded', actor: 'System', actorId: 'system', target: 'Pizza Palace Group — Q1 2025', targetId: 'r1', entityType: 'royalty', franchiseId: 'f1', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'al6', action: 'Ticket resolved', actor: 'Marcus Webb', actorId: 'u2', target: 'Training Video Links Broken', targetId: 'tk3', entityType: 'ticket', franchiseId: 'f3', timestamp: new Date(Date.now() - 12 * 86400000).toISOString() },
  ];

  console.log(`✅ Users: ${db.users.length} | Franchisees: ${db.franchisees.length} | Locations: ${db.locations.length}`);
  console.log(`✅ Sales: ${db.salesReports.length} | Royalties: ${db.royalties.length} | Tasks: ${db.tasks.length}`);
  console.log(`✅ Tickets: ${db.tickets.length} | Announcements: ${db.announcements.length}\n`);
}
