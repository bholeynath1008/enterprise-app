import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import type { UserRole } from '../types';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer mock_token_')) {
    res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
    return;
  }
  const userId = authHeader.replace('Bearer mock_token_', '');
  const user = db.users.find(u => u.id === userId && u.isActive);
  if (!user) { res.status(401).json({ error: 'Unauthorized: user not found' }); return; }
  req.user = user;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden: requires ${roles.join(' or ')}` });
      return;
    }
    next();
  };
}

export function requireHQ(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || !['super_admin', 'franchisor_staff'].includes(req.user.role)) {
    res.status(403).json({ error: 'Forbidden: HQ access only' }); return;
  }
  next();
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'super_admin') {
    res.status(403).json({ error: 'Forbidden: Super Admin only' }); return;
  }
  next();
}

export function canAccessFranchise(userId: string, franchiseId: string): boolean {
  const user = db.users.find(u => u.id === userId);
  if (!user) return false;
  if (['super_admin', 'franchisor_staff'].includes(user.role)) return true;
  return user.franchiseIds?.includes(franchiseId) ?? false;
}
