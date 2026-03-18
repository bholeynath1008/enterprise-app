// ============================================================
// auth.ts
// ============================================================
import { Router } from 'express';
import { db } from '../db';
import { authenticate } from '../middleware/auth';

const authRouter = Router();
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password && u.isActive);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const { password: _pw, ...safe } = user;
  return res.json({ token: `mock_token_${user.id}`, user: safe });
});
authRouter.get('/me', authenticate, (req, res) => {
  const { password: _pw, ...safe } = req.user!;
  return res.json(safe);
});
authRouter.post('/logout', authenticate, (_req, res) => res.json({ message: 'Logged out' }));
export default authRouter;
