import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticate, requireSuperAdmin, canAccessFranchise } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req, res) => {
  const { status, search, page = '1', limit = '20' } = req.query;
  let list = [...db.franchisees];
  if (req.user?.role === 'franchisee_owner') list = list.filter(f => req.user?.franchiseIds?.includes(f.id));
  if (status && status !== 'all') list = list.filter(f => f.status === status);
  if (search) { const q = String(search).toLowerCase(); list = list.filter(f => f.name.toLowerCase().includes(q) || f.owner.toLowerCase().includes(q)); }
  const total = list.length;
  const p = parseInt(String(page)), l = parseInt(String(limit));
  res.json({ data: list.slice((p - 1) * l, p * l), total, page: p, limit: l });
});

router.get('/:id', authenticate, (req, res) => {
  const f = db.franchisees.find(f => f.id === req.params.id);
  if (!f) return res.status(404).json({ error: 'Not found' });
  if (!canAccessFranchise(req.user!.id, f.id)) return res.status(403).json({ error: 'Forbidden' });
  return res.json(f);
});

router.post('/', authenticate, requireSuperAdmin, (req, res) => {
  const { name, owner, plan, phone, address, royaltyRate } = req.body;
  if (!name || !owner) return res.status(400).json({ error: 'name and owner required' });
  const f = { id: `f_${uuidv4()}`, name, owner, ownerId: req.body.ownerId ?? '', status: 'active' as const, plan: plan ?? 'Standard', joinDate: new Date().toISOString().split('T')[0], locationCount: 0, complianceScore: 100, phone: phone ?? '', address: address ?? '', royaltyRate: royaltyRate ?? 6.0 };
  db.franchisees.push(f);
  return res.status(201).json(f);
});

router.put('/:id', authenticate, requireSuperAdmin, (req, res) => {
  const idx = db.franchisees.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.franchisees[idx] = { ...db.franchisees[idx], ...req.body, id: req.params.id };
  return res.json(db.franchisees[idx]);
});

router.delete('/:id', authenticate, requireSuperAdmin, (req, res) => {
  const idx = db.franchisees.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.franchisees.splice(idx, 1);
  return res.json({ message: 'Deleted' });
});

export default router;
