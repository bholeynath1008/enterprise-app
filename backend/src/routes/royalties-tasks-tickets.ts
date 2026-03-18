// ============================================================
// royalties.ts
// ============================================================
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticate, requireHQ, canAccessFranchise } from '../middleware/auth';

export const royaltiesRouter = Router();

royaltiesRouter.get('/', authenticate, (req, res) => {
  const { status, franchiseId, page = '1', limit = '20' } = req.query;
  let list = [...db.royalties];
  if (req.user?.role === 'franchisee_owner' || req.user?.role === 'location_manager') {
    list = list.filter(r => req.user?.franchiseIds?.includes(r.franchiseId));
  }
  if (franchiseId) list = list.filter(r => r.franchiseId === franchiseId);
  if (status && status !== 'all') list = list.filter(r => r.status === status);
  const summary = { totalDue: list.reduce((s, r) => s + r.amountDue, 0), totalPaid: list.reduce((s, r) => s + r.amountPaid, 0), totalOverdue: list.filter(r => r.status === 'overdue').reduce((s, r) => s + r.amountDue, 0), overdueCount: list.filter(r => r.status === 'overdue').length };
  const p = parseInt(String(page)), l = parseInt(String(limit));
  res.json({ data: list.slice((p - 1) * l, p * l), total: list.length, page: p, limit: l, summary });
});

royaltiesRouter.put('/:id/pay', authenticate, requireHQ, (req, res) => {
  const idx = db.royalties.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.royalties[idx] = { ...db.royalties[idx], status: 'paid', amountPaid: db.royalties[idx].amountDue, paidDate: new Date().toISOString().split('T')[0] };
  db.activityLog.unshift({ id: uuidv4(), action: 'Royalty payment recorded', actor: req.user!.name, actorId: req.user!.id, target: `${db.royalties[idx].franchiseName} — ${db.royalties[idx].period}`, targetId: req.params.id, entityType: 'royalty', franchiseId: db.royalties[idx].franchiseId, timestamp: new Date().toISOString() });
  return res.json(db.royalties[idx]);
});

royaltiesRouter.post('/:id/remind', authenticate, requireHQ, (req, res) => {
  const r = db.royalties.find(r => r.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  return res.json({ message: `Reminder sent to ${r.franchiseName}` });
});

// ============================================================
// tasks.ts
// ============================================================
export const tasksRouter = Router();

tasksRouter.get('/', authenticate, (req, res) => {
  const { status, priority, page = '1', limit = '50' } = req.query;
  let list = [...db.tasks];
  const u = req.user!;
  if (u.role === 'franchisee_owner') list = list.filter(t => t.assignedType === 'global' || (t.assignedType === 'franchisee' && u.franchiseIds?.includes(t.assignedTo)) || (t.assignedType === 'location' && u.locationIds?.includes(t.assignedTo)));
  else if (u.role === 'location_manager') list = list.filter(t => t.assignedType === 'global' || (t.assignedType === 'location' && u.locationIds?.includes(t.assignedTo)));
  if (status && status !== 'all') list = list.filter(t => t.status === status);
  if (priority && priority !== 'all') list = list.filter(t => t.priority === priority);
  const p = parseInt(String(page)), l = parseInt(String(limit));
  res.json({ data: list.slice((p - 1) * l, p * l), total: list.length, page: p, limit: l });
});

tasksRouter.post('/', authenticate, (req, res) => {
  if (!['super_admin', 'franchisor_staff'].includes(req.user!.role)) return res.status(403).json({ error: 'Forbidden' });
  const { title, description, assignedTo, assignedType, assignedToName, priority, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const t = { id: `t_${uuidv4()}`, title, description: description ?? '', assignedTo: assignedTo ?? 'all', assignedType: assignedType ?? 'global', assignedToName: assignedToName ?? 'All', priority: priority ?? 'medium', status: 'pending' as const, dueDate: dueDate ?? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], createdBy: req.user!.id, createdAt: new Date().toISOString().split('T')[0], completedAt: null, completedBy: null, photoProofUrl: null };
  db.tasks.unshift(t);
  return res.status(201).json(t);
});

tasksRouter.put('/:id/complete', authenticate, (req, res) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.tasks[idx] = { ...db.tasks[idx], status: 'completed', completedAt: new Date().toISOString().split('T')[0], completedBy: req.user!.id, photoProofUrl: req.body.photoProofUrl ?? null };
  db.activityLog.unshift({ id: uuidv4(), action: 'Task marked complete', actor: req.user!.name, actorId: req.user!.id, target: db.tasks[idx].title, targetId: req.params.id, entityType: 'task', franchiseId: null, timestamp: new Date().toISOString() });
  return res.json(db.tasks[idx]);
});

tasksRouter.delete('/:id', authenticate, (req, res) => {
  if (!['super_admin', 'franchisor_staff'].includes(req.user!.role)) return res.status(403).json({ error: 'Forbidden' });
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.tasks.splice(idx, 1);
  return res.json({ message: 'Deleted' });
});

// ============================================================
// tickets.ts
// ============================================================
export const ticketsRouter = Router();

ticketsRouter.get('/', authenticate, (req, res) => {
  const { status, priority, franchiseId, page = '1', limit = '25' } = req.query;
  let list = [...db.tickets];
  const u = req.user!;
  if (u.role === 'franchisee_owner') list = list.filter(t => u.franchiseIds?.includes(t.franchiseId));
  else if (u.role === 'location_manager') list = list.filter(t => u.franchiseIds?.includes(t.franchiseId));
  if (franchiseId) list = list.filter(t => t.franchiseId === franchiseId);
  if (status && status !== 'all') list = list.filter(t => t.status === status);
  if (priority && priority !== 'all') list = list.filter(t => t.priority === priority);
  const summary = { open: list.filter(t => t.status === 'open').length, in_progress: list.filter(t => t.status === 'in_progress').length, resolved: list.filter(t => t.status === 'resolved').length, high: list.filter(t => t.priority === 'high').length };
  const p = parseInt(String(page)), l = parseInt(String(limit));
  res.json({ data: list.slice((p - 1) * l, p * l), total: list.length, page: p, limit: l, summary });
});

ticketsRouter.post('/', authenticate, (req, res) => {
  const { title, description, priority, locationId } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const u = req.user!;
  const franchiseId = u.franchiseIds?.[0] ?? req.body.franchiseId ?? 'hq';
  const t = { id: `tk_${uuidv4()}`, title, description: description ?? '', franchiseId, locationId: locationId ?? null, priority: priority ?? 'medium', status: 'open' as const, createdBy: u.id, createdByName: u.name, createdAt: new Date().toISOString().split('T')[0], assignedTo: null, assignedToName: null, resolvedAt: null, replies: [] };
  db.tickets.unshift(t);
  db.activityLog.unshift({ id: uuidv4(), action: 'Ticket opened', actor: u.name, actorId: u.id, target: title, targetId: t.id, entityType: 'ticket', franchiseId, timestamp: new Date().toISOString() });
  return res.status(201).json(t);
});

ticketsRouter.put('/:id/resolve', authenticate, (req, res) => {
  const idx = db.tickets.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.tickets[idx] = { ...db.tickets[idx], status: 'resolved', resolvedAt: new Date().toISOString().split('T')[0] };
  db.activityLog.unshift({ id: uuidv4(), action: 'Ticket resolved', actor: req.user!.name, actorId: req.user!.id, target: db.tickets[idx].title, targetId: req.params.id, entityType: 'ticket', franchiseId: db.tickets[idx].franchiseId, timestamp: new Date().toISOString() });
  return res.json(db.tickets[idx]);
});

ticketsRouter.post('/:id/reply', authenticate, (req, res) => {
  const idx = db.tickets.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const reply = { id: uuidv4(), authorId: req.user!.id, authorName: req.user!.name, body: req.body.body ?? '', createdAt: new Date().toISOString().split('T')[0] };
  db.tickets[idx].replies.push(reply);
  if (db.tickets[idx].status === 'open' && ['super_admin', 'franchisor_staff'].includes(req.user!.role)) {
    db.tickets[idx].status = 'in_progress';
    db.tickets[idx].assignedTo = req.user!.id;
    db.tickets[idx].assignedToName = req.user!.name;
  }
  return res.json(db.tickets[idx]);
});
