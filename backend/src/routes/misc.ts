import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticate, requireHQ, requireSuperAdmin } from '../middleware/auth';

// ---- SALES ----
export const salesRouter = Router();
salesRouter.get('/', authenticate, (req, res) => {
  const { franchiseId, locationId, status, page = '1', limit = '30' } = req.query;
  let list = [...db.salesReports];
  const u = req.user!;
  if (u.role === 'franchisee_owner') list = list.filter(r => u.franchiseIds?.includes(r.franchiseId));
  else if (u.role === 'location_manager') list = list.filter(r => u.locationIds?.includes(r.locationId));
  if (franchiseId) list = list.filter(r => r.franchiseId === franchiseId);
  if (locationId) list = list.filter(r => r.locationId === locationId);
  if (status && status !== 'all') list = list.filter(r => r.status === status);
  const summary = { totalGross: list.reduce((s, r) => s + r.grossSales, 0), totalNet: list.reduce((s, r) => s + r.netSales, 0), totalRoyalty: list.reduce((s, r) => s + r.royaltyDue, 0), count: list.length };
  const p = parseInt(String(page)), l = parseInt(String(limit));
  res.json({ data: list.slice((p - 1) * l, p * l), total: list.length, page: p, limit: l, summary });
});
salesRouter.post('/', authenticate, (req, res) => {
  const { franchiseId, locationId, month, grossSales } = req.body;
  if (!franchiseId || !locationId || !month || !grossSales) return res.status(400).json({ error: 'Missing fields' });
  const fran = db.franchisees.find(f => f.id === franchiseId);
  const net = Math.round(grossSales * 0.97);
  const royaltyDue = Math.round(net * (fran?.royaltyRate ?? 6) / 100);
  const r = { id: `s_${uuidv4()}`, franchiseId, locationId, month, grossSales: parseInt(grossSales), netSales: net, royaltyDue, status: 'submitted' as const, submittedAt: new Date().toISOString().split('T')[0], submittedBy: req.user!.id, attachmentUrl: req.body.attachmentUrl ?? null, notes: req.body.notes ?? '' };
  db.salesReports.unshift(r);
  db.activityLog.unshift({ id: uuidv4(), action: 'Sales report submitted', actor: req.user!.name, actorId: req.user!.id, target: `${locationId} — ${month}`, targetId: r.id, entityType: 'sales_report', franchiseId, timestamp: new Date().toISOString() });
  return res.status(201).json(r);
});
salesRouter.put('/:id/approve', authenticate, requireHQ, (req, res) => {
  const idx = db.salesReports.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.salesReports[idx] = { ...db.salesReports[idx], status: 'approved' };
  return res.json(db.salesReports[idx]);
});

// ---- LOCATIONS ----
export const locationsRouter = Router();
locationsRouter.get('/', authenticate, (req, res) => {
  const { franchiseId, search } = req.query;
  let list = [...db.locations];
  const u = req.user!;
  if (u.role === 'franchisee_owner') list = list.filter(l => u.franchiseIds?.includes(l.franchiseId));
  else if (u.role === 'location_manager') list = list.filter(l => u.locationIds?.includes(l.id));
  if (franchiseId) list = list.filter(l => l.franchiseId === franchiseId);
  if (search) { const q = String(search).toLowerCase(); list = list.filter(l => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)); }
  res.json({ data: list, total: list.length });
});
locationsRouter.post('/', authenticate, requireSuperAdmin, (req, res) => {
  const { name, franchiseId, city, state, address, manager, managerId, phone, openedDate } = req.body;
  if (!name || !franchiseId) return res.status(400).json({ error: 'name and franchiseId required' });
  const fran = db.franchisees.find(f => f.id === franchiseId);
  const loc = { id: `l_${uuidv4()}`, name, franchiseId, franchiseName: fran?.name ?? '', city: city ?? '', state: state ?? '', address: address ?? '', manager: manager ?? '', managerId: managerId ?? '', status: 'active' as const, monthSales: 0, phone: phone ?? '', openedDate: openedDate ?? new Date().toISOString().split('T')[0] };
  db.locations.push(loc);
  if (fran) fran.locationCount += 1;
  return res.status(201).json(loc);
});

// ---- ANNOUNCEMENTS ----
export const announcementsRouter = Router();
announcementsRouter.get('/', authenticate, (_req, res) => {
  const list = [...db.announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
  });
  res.json({ data: list, total: list.length });
});
announcementsRouter.post('/', authenticate, requireHQ, (req, res) => {
  const { title, body, audience, priority, pinned } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });
  const a = { id: `a_${uuidv4()}`, title, body, sentBy: req.user!.id, sentByName: req.user!.name, sentAt: new Date().toISOString().split('T')[0], audience: audience ?? 'all', priority: priority ?? 'medium', pinned: pinned ?? false };
  db.announcements.unshift(a);
  db.activityLog.unshift({ id: uuidv4(), action: 'Announcement sent', actor: req.user!.name, actorId: req.user!.id, target: title, targetId: a.id, entityType: 'announcement', franchiseId: null, timestamp: new Date().toISOString() });
  return res.status(201).json(a);
});
announcementsRouter.delete('/:id', authenticate, requireSuperAdmin, (req, res) => {
  const idx = db.announcements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.announcements.splice(idx, 1);
  return res.json({ message: 'Deleted' });
});

// ---- USERS ----
export const usersRouter = Router();
usersRouter.get('/', authenticate, requireSuperAdmin, (_req, res) => {
  res.json({ data: db.users.map(({ password: _p, ...u }) => u), total: db.users.length });
});
usersRouter.post('/', authenticate, requireSuperAdmin, (req, res) => {
  const { email, password, name, role, franchiseIds, locationIds } = req.body;
  if (!email || !password || !name || !role) return res.status(400).json({ error: 'Missing fields' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email exists' });
  const u = { id: `u_${uuidv4()}`, email, password, name, role, avatarColor: ['blue', 'emerald', 'amber', 'purple'][Math.floor(Math.random() * 4)], franchiseIds: franchiseIds ?? null, locationIds: locationIds ?? null, createdAt: new Date().toISOString().split('T')[0], isActive: true };
  db.users.push(u);
  const { password: _p, ...safe } = u;
  return res.status(201).json(safe);
});
usersRouter.put('/:id/deactivate', authenticate, requireSuperAdmin, (req, res) => {
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (db.users[idx].role === 'super_admin') return res.status(400).json({ error: 'Cannot deactivate super admin' });
  db.users[idx].isActive = false;
  return res.json({ message: 'Deactivated' });
});

// ---- ACTIVITY ----
export const activityRouter = Router();
activityRouter.get('/', authenticate, (req, res) => {
  const { page = '1', limit = '30' } = req.query;
  let list = [...db.activityLog];
  const u = req.user!;
  if (u.role === 'franchisee_owner') list = list.filter(a => !a.franchiseId || u.franchiseIds?.includes(a.franchiseId));
  const p = parseInt(String(page)), l = parseInt(String(limit));
  res.json({ data: list.slice((p - 1) * l, p * l), total: list.length, page: p, limit: l });
});
