import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { seedDatabase, db } from './db';
import authRouter from './routes/auth';
import franchiseesRouter from './routes/franchisees';
import royaltiesRouter from './routes/royalties';
import tasksRouter from './routes/tasks';
import ticketsRouter from './routes/tickets';
import secureRouter from './routes/secure';
import {
  salesRouter, locationsRouter, announcementsRouter,
  usersRouter, activityRouter,
} from './routes/misc';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Inject user from token for all routes
app.use((req, _res, next) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer mock_token_')) {
    const userId = auth.replace('Bearer mock_token_', '');
    req.user = db.users.find(u => u.id === userId);
  }
  next();
});

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use('/api/auth', authRouter);
app.use('/api/franchisees', franchiseesRouter);
app.use('/api/royalties', royaltiesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/users', usersRouter);
app.use('/api/activity', activityRouter);
app.use('/api/secure', secureRouter);

// Upload mock
app.post('/api/upload', (_req, res) => {
  setTimeout(() => res.json({ url: `https://mock-storage.fms.dev/uploads/${Date.now()}.pdf`, filename: `upload_${Date.now()}.pdf` }), 600);
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  return res.json({
    totalFranchisees: db.franchisees.length,
    activeFranchisees: db.franchisees.filter(f => f.status === 'active').length,
    totalLocations: db.locations.length,
    openTickets: db.tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    pendingTasks: db.tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    totalSalesYTD: db.salesReports.reduce((s, r) => s + r.grossSales, 0),
    totalRoyaltiesCollected: db.royalties.filter(r => r.status === 'paid').reduce((s, r) => s + r.amountPaid, 0),
    overdueRoyalties: db.royalties.filter(r => r.status === 'overdue').reduce((s, r) => s + r.amountDue, 0),
    overdueRoyaltyCount: db.royalties.filter(r => r.status === 'overdue').length,
  });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal server error' });
});

seedDatabase();
app.listen(PORT, () => {
  console.log(`🚀 FMS API on http://localhost:${PORT}`);
  console.log(`\n🔑 Credentials:`);
  console.log(`   admin@fms.com / admin123 (Super Admin)`);
  console.log(`   ops@fms.com / ops123 (HQ Staff)`);
  console.log(`   owner1@pizzapalace.com / owner123 (Owner)`);
  console.log(`   mgr1@pizzapalace.com / mgr123 (Manager)\n`);
});

export default app;
