// ============================================================
// Barrel - all page components in one file for brevity
// In production these would be separate files per feature folder
// ============================================================
import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import {
  Building2, DollarSign, AlertTriangle, Ticket as TicketIcon, CheckSquare,
  TrendingUp, Plus, Check, Send, ChevronUp, ChevronDown,
  RefreshCw, Download, ChevronLeft, ChevronRight,
} from 'lucide-react';

import { Button, Badge, StatusBadge, PriorityBadge, Avatar, ProgressBar, Spinner } from '@/components/atoms';
import { Card, CardHeader, CardTitle, CardContent, StatCard, FilterBar, EmptyState, TableSkeleton } from '@/components/molecules';
import {
  useGetDashboardStatsQuery, useGetFranchiseesQuery, useGetLocationsQuery,
  useGetRoyaltiesQuery, useGetTasksQuery, useGetTicketsQuery, useGetSalesReportsQuery,
  useGetAnnouncementsQuery, useGetActivityQuery, useGetUsersQuery,
  useMarkRoyaltyPaidMutation, useSendRoyaltyReminderMutation,
  useCompleteTaskMutation, useDeleteTaskMutation,
  useResolveTicketMutation, useCreateTicketMutation,
  useApproveSalesReportMutation, useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation, useDeactivateUserMutation,
} from '@/features/api';
import { useAuth } from '@/features/auth/useAuth';
import { useHasPermission } from '@/permissions/usePermissions';
import { Permission } from '@/permissions/permissions';
import { fmt, fmtDate, relativeTime, labelStatus } from '@/lib/utils';
import { useTrackEvent } from '@/hooks/useTrackEvent';
import { useDebounce } from '@/hooks/useDebounce';
import type { Franchisee, Royalty, Task, Ticket } from '@/types';

// ============================================================
// DASHBOARD PAGE — routes to role-specific dashboard
// ============================================================
export function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'super_admin') return <SuperAdminDashboard />;
  if (user.role === 'franchisor_staff') return <StaffDashboard />;
  if (user.role === 'franchisee_owner') return <OwnerDashboard />;
  return <ManagerDashboard />;
}

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const SALES_DATA = MONTHS.map((m, i) => ({ month: m, total: [2180000, 2340000, 2410000, 2580000, 2720000, 2850000][i] }));
const CHART_STYLE = { contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }, labelStyle: { color: '#94a3b8' } };

function SuperAdminDashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const { data: fData } = useGetFranchiseesQuery({});
  const { data: ticketData } = useGetTicketsQuery({});
  const { data: activityData } = useGetActivityQuery({});
  const { data: royaltyData } = useGetRoyaltiesQuery({});

  const royaltyPie = royaltyData ? [
    { name: 'Paid', value: royaltyData.data.filter(r => r.status === 'paid').length },
    { name: 'Pending', value: royaltyData.data.filter(r => r.status === 'pending').length },
    { name: 'Overdue', value: royaltyData.data.filter(r => r.status === 'overdue').length },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label={t('dashboard.totalSalesYTD')} value={fmt(stats?.totalSalesYTD ?? 0)} change="↑ 12.4% vs last year" changeType="up" accent="blue" icon={<TrendingUp />} loading={isLoading} />
        <StatCard label={t('dashboard.royaltiesCollected')} value={fmt(stats?.totalRoyaltiesCollected ?? 0)} change="Q1 on track" changeType="up" accent="emerald" icon={<DollarSign />} loading={isLoading} />
        <StatCard label={t('dashboard.overdueRoyalties')} value={fmt(stats?.overdueRoyalties ?? 0)} change={`${stats?.overdueRoyaltyCount ?? 0} franchisees`} changeType="down" accent="red" icon={<AlertTriangle />} loading={isLoading} />
        <StatCard label={t('dashboard.openTickets')} value={stats?.openTickets ?? 0} change="Need attention" changeType="flat" accent="amber" icon={<TicketIcon />} loading={isLoading} />
        <StatCard label={t('dashboard.pendingTasks')} value={stats?.pendingTasks ?? 0} change="Across all units" changeType="flat" accent="purple" icon={<CheckSquare />} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Monthly Sales — All Franchises</CardTitle><span className="text-xs text-muted-foreground">Last 6 months</span></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SALES_DATA}>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_STYLE} formatter={(v: number) => [fmt(v), 'Sales']} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#sg)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Royalty Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={royaltyPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {royaltyPie.map((_, i) => <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444'][i]} />)}
                </Pie>
                <Tooltip {...CHART_STYLE} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>{t('dashboard.leaderboard')}</CardTitle></CardHeader>
          <div>
            {fData?.data.slice(0, 7).map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${i === 0 ? 'bg-amber-500/20 text-amber-300' : i === 1 ? 'bg-slate-400/20 text-slate-300' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                  <ProgressBar value={f.complianceScore} color="auto" />
                </div>
                <StatusBadge status={f.status} />
                <span className="text-sm font-bold text-foreground min-w-[40px] text-right">{f.complianceScore}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('dashboard.recentActivity')}</CardTitle></CardHeader>
          <div>
            {activityData?.data.slice(0, 8).map(a => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.actor} · {a.target}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{relativeTime(a.timestamp)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StaffDashboard() {
  const { data: fData } = useGetFranchiseesQuery({});
  const { data: ticketData } = useGetTicketsQuery({});
  const { data: royaltyData } = useGetRoyaltiesQuery({});
  const barData = fData?.data.map(f => ({ name: f.name.split(' ')[0], score: f.complianceScore })) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Tickets" value={ticketData?.summary?.open ?? 0} changeType="down" accent="red" />
        <StatCard label="In Progress" value={ticketData?.summary?.in_progress ?? 0} changeType="flat" accent="blue" />
        <StatCard label="Resolved Today" value={3} changeType="up" accent="emerald" />
        <StatCard label="Overdue Royalties" value={royaltyData?.summary?.overdueCount ?? 0} changeType="down" accent="amber" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Franchisee Compliance Leaderboard</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_STYLE} formatter={(v: number) => [`${v}%`, 'Compliance']} />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Support Queue</CardTitle></CardHeader>
          <div>
            {ticketData?.data.filter(t => t.status !== 'resolved').slice(0, 6).map(ticket => (
              <div key={ticket.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ticket.priority === 'high' ? 'bg-red-400' : ticket.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">{ticket.franchiseId} · {ticket.createdAt}</p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function OwnerDashboard() {
  const { user } = useAuth();
  const franchiseId = user?.franchiseIds?.[0] ?? 'f1';
  const { data: fData } = useGetFranchiseesQuery({});
  const { data: royaltyData } = useGetRoyaltiesQuery({ franchiseId });
  const { data: ticketData } = useGetTicketsQuery({ franchiseId });
  const { data: locData } = useGetLocationsQuery({ franchiseId });
  const { data: annData } = useGetAnnouncementsQuery();
  const myFranchise = fData?.data.find(f => f.id === franchiseId);
  const totalSales = locData?.data.reduce((s, l) => s + l.monthSales, 0) ?? 0;
  const [completeTask] = useCompleteTaskMutation();
  const { data: taskData } = useGetTasksQuery({});

  return (
    <div className="space-y-6">
      {myFranchise && (
        <div className="flex items-center gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">{myFranchise.name.slice(0, 2).toUpperCase()}</div>
          <div className="flex-1"><p className="font-bold text-foreground">{myFranchise.name}</p><p className="text-xs text-muted-foreground">{myFranchise.locationCount} locations · {myFranchise.plan} Plan · Since {myFranchise.joinDate}</p></div>
          <StatusBadge status={myFranchise.status} />
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Sales" value={fmt(totalSales)} change="↑ 8.2%" changeType="up" accent="blue" />
        <StatCard label="Royalties Paid Q1" value={fmt(royaltyData?.summary?.totalPaid ?? 0)} change="On time" changeType="up" accent="emerald" />
        <StatCard label="Pending Tasks" value={taskData?.data.filter(t => t.status === 'pending').length ?? 0} changeType="flat" accent="amber" />
        <StatCard label="Open Tickets" value={ticketData?.data.filter(t => t.status !== 'resolved').length ?? 0} changeType="flat" accent="purple" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Compliance Score</CardTitle></CardHeader>
            <CardContent className="text-center">
              {myFranchise && <>
                <p className={`text-5xl font-black mb-1 ${myFranchise.complianceScore >= 80 ? 'text-emerald-400' : myFranchise.complianceScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{myFranchise.complianceScore}</p>
                <p className="text-xs text-muted-foreground mb-3">out of 100</p>
                <ProgressBar value={myFranchise.complianceScore} color="auto" />
              </>}
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-2">
          <Card>
            <CardHeader><CardTitle>Latest Announcements</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {annData?.data.slice(0, 3).map(a => (
                <div key={a.id} className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-start gap-2 mb-1"><p className="text-sm font-semibold text-foreground flex-1">{a.title}</p><PriorityBadge priority={a.priority} /></div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.body}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{a.sentByName} · {a.sentAt}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  const { user } = useAuth();
  const locationId = user?.locationIds?.[0] ?? 'l1';
  const franchiseId = user?.franchiseIds?.[0] ?? 'f1';
  const { data: locData } = useGetLocationsQuery({ franchiseId });
  const { data: taskData } = useGetTasksQuery({});
  const { data: ticketData } = useGetTicketsQuery({ franchiseId });
  const [completeTask] = useCompleteTaskMutation();
  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Morning opening checklist complete', done: true },
    { id: 'c2', text: 'Temperature logs updated', done: true },
    { id: 'c3', text: 'Staff safety briefing conducted', done: false },
    { id: 'c4', text: 'Daily sales reconciliation', done: false },
    { id: 'c5', text: 'End-of-day sanitization', done: false },
  ]);

  const myLocation = locData?.data.find(l => l.id === locationId);
  const donePct = Math.round(checklist.filter(c => c.done).length / checklist.length * 100);

  return (
    <div className="space-y-6">
      {myLocation && (
        <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <div className="flex-1"><p className="font-bold text-foreground">{myLocation.name}</p><p className="text-xs text-muted-foreground">{myLocation.city}, {myLocation.state} · Manager: {myLocation.manager}</p></div>
          <StatusBadge status={myLocation.status} />
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="This Month Sales" value={fmt(myLocation?.monthSales ?? 0)} changeType="up" change="↑ 5.1%" accent="blue" />
        <StatCard label="Checklist Done" value={`${checklist.filter(c => c.done).length}/${checklist.length}`} changeType={donePct === 100 ? 'up' : 'flat'} accent="emerald" />
        <StatCard label="Pending Tasks" value={taskData?.data.filter(t => t.status === 'pending').length ?? 0} accent="amber" />
        <StatCard label="Open Tickets" value={ticketData?.data.filter(t => t.status !== 'resolved').length ?? 0} accent="red" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Daily Checklist</CardTitle><span className="text-xs text-muted-foreground">{fmtDate(new Date().toISOString())}</span></CardHeader>
          <CardContent>
            <div className="mb-4"><ProgressBar value={donePct} color={donePct === 100 ? 'emerald' : 'blue'} /><p className="text-xs text-muted-foreground mt-1">{checklist.filter(c => c.done).length} of {checklist.length} complete</p></div>
            {checklist.map(item => (
              <button key={item.id} onClick={() => setChecklist(p => p.map(c => c.id === item.id ? { ...c, done: !c.done } : c))} className="flex items-center gap-3 w-full py-2.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors text-left">
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>{item.done && <Check size={12} className="text-white" />}</div>
                <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.text}</span>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>My Tasks</CardTitle></CardHeader>
          <div>
            {taskData?.data.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{t.title}</p><p className="text-xs text-muted-foreground">Due: {t.dueDate}</p></div>
                {t.status === 'pending' ? (
                  <Button size="sm" variant="success" onClick={() => { completeTask({ id: t.id }); toast.success('Task complete!'); }}>Done</Button>
                ) : <StatusBadge status={t.status} />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// ANALYTICS PAGE
// ============================================================
export function AnalyticsPage() {
  const { data: fData } = useGetFranchiseesQuery({});
  const trendData = MONTHS.map((m, i) => ({
    month: m,
    'Pizza Palace': [136000, 140200, 145800, 150100, 154200, 160100][i],
    'Burger Barn': [98000, 105400, 110200, 115800, 118400, 122000][i],
    'Taco Time': [109000, 112100, 115800, 118200, 122100, 126400][i],
  }));
  const complianceData = fData?.data.map(f => ({ name: f.name.split(' ')[0], score: f.complianceScore, fill: f.complianceScore >= 80 ? '#10b981' : f.complianceScore >= 60 ? '#f59e0b' : '#ef4444' })) ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Sales Trend by Franchise</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_STYLE} formatter={(v: number) => [fmt(v)]} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Line type="monotone" dataKey="Pizza Palace" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Burger Barn" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Taco Time" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Compliance Scores</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_STYLE} formatter={(v: number) => [`${v}%`, 'Score']} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>{complianceData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// TanStack Table helper component
// ============================================================
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  loading?: boolean;
  pageSize?: number;
}

function DataTable<T>({ data, columns, loading, pageSize = 15 }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  if (loading) return <TableSkeleton rows={6} cols={columns.length} />;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-border">
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h.isPlaceholder ? null : (
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={h.column.getToggleSortingHandler()}
                        aria-sort={h.column.getIsSorted() === 'asc' ? 'ascending' : h.column.getIsSorted() === 'desc' ? 'descending' : 'none'}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === 'asc' ? <ChevronUp size={12} /> : h.column.getIsSorted() === 'desc' ? <ChevronDown size={12} /> : null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="data-table-row">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-muted-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} · {table.getFilteredRowModel().rows.length} rows</span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page"><ChevronLeft size={14} /></Button>
            <Button size="sm" variant="ghost" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page"><ChevronRight size={14} /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FRANCHISEES PAGE
// ============================================================
export function FranchiseesPage() {
  const { t } = useTranslation();
  const canWrite = useHasPermission(Permission.FRANCHISE_WRITE);
  const [search, setSearch] = useState('');
  const dSearch = useDebounce(search, 300);
  const [status, setStatus] = useState('');
  const { data, isLoading } = useGetFranchiseesQuery({ search: dSearch, status });
  const track = useTrackEvent();

  const columns = useMemo<ColumnDef<Franchisee, unknown>[]>(() => [
    { accessorKey: 'name', header: 'Franchisee', cell: ({ getValue }) => <span className="font-semibold text-foreground">{getValue() as string}</span> },
    { accessorKey: 'owner', header: 'Owner' },
    { accessorKey: 'plan', header: 'Plan', cell: ({ getValue }) => <StatusBadge status={(getValue() as string).toLowerCase()} /> },
    { accessorKey: 'locationCount', header: 'Locations' },
    { accessorKey: 'complianceScore', header: 'Compliance', cell: ({ getValue }) => {
      const v = getValue() as number;
      return <div className="flex items-center gap-2 w-28"><ProgressBar value={v} color="auto" /><span className="text-xs">{v}%</span></div>;
    }},
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'joinDate', header: 'Joined', cell: ({ getValue }) => <span className="text-xs">{getValue() as string}</span> },
  ], []);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={[{ key: 'status', label: 'Status', options: [{ value: '', label: 'All Statuses' }, { value: 'active', label: 'Active' }, { value: 'warning', label: 'Warning' }, { value: 'suspended', label: 'Suspended' }], value: status }]}
        onFilterChange={(_, v) => setStatus(v)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search franchisees..."
        rightContent={canWrite && <Button size="sm" variant="primary" leftIcon={<Plus size={14} />} onClick={() => { track('franchise_add_click'); toast.info('New franchisee form'); }}>Add Franchisee</Button>}
      />
      <Card><DataTable data={data?.data ?? []} columns={columns} loading={isLoading} /></Card>
    </div>
  );
}

// ============================================================
// ROYALTIES PAGE
// ============================================================
export function RoyaltiesPage() {
  const { data, isLoading } = useGetRoyaltiesQuery({});
  const [markPaid] = useMarkRoyaltyPaidMutation();
  const [sendReminder] = useSendRoyaltyReminderMutation();
  const canApprove = useHasPermission(Permission.ROYALTY_APPROVE);

  const columns = useMemo<ColumnDef<Royalty, unknown>[]>(() => [
    { accessorKey: 'franchiseName', header: 'Franchisee', cell: ({ getValue }) => <span className="font-semibold text-foreground">{getValue() as string}</span> },
    { accessorKey: 'period', header: 'Period' },
    { accessorKey: 'amountDue', header: 'Due', cell: ({ getValue }) => <span className="font-medium">{fmt(getValue() as number)}</span> },
    { accessorKey: 'amountPaid', header: 'Paid', cell: ({ row, getValue }) => {
      const v = getValue() as number;
      const due = row.original.amountDue;
      return <span className={v === due ? 'text-emerald-400 font-medium' : v === 0 ? 'text-red-400 font-medium' : 'text-amber-400 font-medium'}>{fmt(v)}</span>;
    }},
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'dueDate', header: 'Due Date', cell: ({ row, getValue }) => <span className={row.original.status === 'overdue' ? 'text-red-400 font-medium text-xs' : 'text-xs'}>{getValue() as string}</span> },
    ...(canApprove ? [{
      id: 'actions', header: 'Actions',
      cell: ({ row }: { row: { original: Royalty } }) => {
        const r = row.original;
        return (
          <div className="flex gap-1.5">
            {r.status === 'overdue' && <Button size="sm" variant="ghost" leftIcon={<Send size={11} />} onClick={() => { sendReminder(r.id); toast.success(`Reminder sent to ${r.franchiseName}`); }}>Remind</Button>}
            {(r.status === 'overdue' || r.status === 'pending') && <Button size="sm" variant="success" leftIcon={<Check size={11} />} onClick={() => { markPaid(r.id); toast.success('Marked paid!'); }}>Paid</Button>}
          </div>
        );
      },
    }] : []) as ColumnDef<Royalty, unknown>[],
  ], [canApprove, markPaid, sendReminder]);

  return (
    <div className="space-y-4">
      {data?.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Due" value={fmt(data.summary.totalDue)} accent="blue" />
          <StatCard label="Collected" value={fmt(data.summary.totalPaid)} accent="emerald" />
          <StatCard label="Overdue" value={fmt(data.summary.totalOverdue)} accent="red" />
          <StatCard label="Collection Rate" value={data.summary.totalDue ? `${Math.round(data.summary.totalPaid / data.summary.totalDue * 100)}%` : '0%'} accent="amber" />
        </div>
      )}
      <Card><DataTable data={data?.data ?? []} columns={columns} loading={isLoading} /></Card>
    </div>
  );
}

// ============================================================
// TASKS PAGE
// ============================================================
export function TasksPage() {
  const canAssign = useHasPermission(Permission.TASK_ASSIGN);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const { data, isLoading } = useGetTasksQuery({ status, priority });
  const [completeTask] = useCompleteTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const track = useTrackEvent();

  const columns = useMemo<ColumnDef<Task, unknown>[]>(() => [
    { accessorKey: 'title', header: 'Task', cell: ({ row, getValue }) => (
      <div><p className="font-medium text-foreground">{getValue() as string}</p><p className="text-xs text-muted-foreground truncate max-w-xs">{row.original.description.slice(0, 60)}…</p></div>
    )},
    { accessorKey: 'assignedToName', header: 'Assigned To', cell: ({ getValue }) => <span className="text-xs bg-muted border border-border rounded px-2 py-0.5">{getValue() as string}</span> },
    { accessorKey: 'priority', header: 'Priority', cell: ({ getValue }) => <PriorityBadge priority={getValue() as string} /> },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'dueDate', header: 'Due', cell: ({ row, getValue }) => (
      <span className={`text-xs ${new Date(getValue() as string) < new Date() && row.original.status !== 'completed' ? 'text-red-400 font-medium' : ''}`}>{getValue() as string}</span>
    )},
    { id: 'actions', header: 'Actions', cell: ({ row }) => {
      const t = row.original;
      return (
        <div className="flex gap-1.5">
          {t.status !== 'completed' && <Button size="sm" variant="success" leftIcon={<Check size={11} />} onClick={() => { completeTask({ id: t.id }); track('task_completed', { taskId: t.id }); toast.success('Task complete!'); }}>Done</Button>}
          {canAssign && t.status === 'completed' && <Button size="sm" variant="danger" onClick={() => deleteTask(t.id)}>Delete</Button>}
        </div>
      );
    }},
  ], [canAssign, completeTask, deleteTask, track]);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={[
          { key: 'status', label: 'Status', options: [{ value: '', label: 'All Statuses' }, { value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }], value: status },
          { key: 'priority', label: 'Priority', options: [{ value: '', label: 'All Priorities' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }], value: priority },
        ]}
        onFilterChange={(k, v) => { if (k === 'status') setStatus(v); else setPriority(v); }}
        rightContent={canAssign && <Button size="sm" variant="primary" leftIcon={<Plus size={14} />} onClick={() => toast.info('New task form')}>New Task</Button>}
      />
      <Card><DataTable data={data?.data ?? []} columns={columns} loading={isLoading} /></Card>
    </div>
  );
}

// ============================================================
// TICKETS PAGE
// ============================================================
export function TicketsPage() {
  const canCreate = useHasPermission(Permission.TICKET_CREATE);
  const canResolve = useHasPermission(Permission.TICKET_RESOLVE);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const { user } = useAuth();
  const { data, isLoading } = useGetTicketsQuery({ status, priority });
  const [resolveTicket] = useResolveTicketMutation();
  const [createTicket] = useCreateTicketMutation();
  const track = useTrackEvent();

  const handleCreate = async () => {
    if (!newTitle.trim()) { toast.error('Subject required'); return; }
    await createTicket({ title: newTitle, priority: newPriority as 'low' | 'medium' | 'high', franchiseId: user?.franchiseIds?.[0] ?? 'hq' }).unwrap();
    toast.success('Ticket created!');
    track('ticket_created', { priority: newPriority });
    setShowForm(false); setNewTitle('');
  };

  const columns = useMemo<ColumnDef<Ticket, unknown>[]>(() => [
    { accessorKey: 'id', header: '#', cell: ({ getValue }) => <span className="text-xs font-mono text-muted-foreground">{(getValue() as string).slice(0, 8)}</span> },
    { accessorKey: 'title', header: 'Title', cell: ({ row, getValue }) => (
      <div><p className="font-medium text-foreground">{getValue() as string}</p><p className="text-xs text-muted-foreground truncate max-w-[200px]">{row.original.description.slice(0, 50)}…</p></div>
    )},
    { accessorKey: 'priority', header: 'Priority', cell: ({ getValue }) => <PriorityBadge priority={getValue() as string} /> },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ getValue }) => <span className="text-xs">{getValue() as string}</span> },
    { accessorKey: 'assignedToName', header: 'Assigned', cell: ({ getValue }) => <span className="text-xs">{(getValue() as string | null) ?? 'Unassigned'}</span> },
    ...(canResolve ? [{
      id: 'actions', header: 'Actions',
      cell: ({ row }: { row: { original: Ticket } }) => {
        const t = row.original;
        return t.status !== 'resolved' && t.status !== 'closed'
          ? <Button size="sm" variant="success" leftIcon={<Check size={11} />} onClick={() => { resolveTicket(t.id); toast.success('Ticket resolved!'); }}>Resolve</Button>
          : <span className="text-xs text-muted-foreground">Closed</span>;
      },
    }] : []) as ColumnDef<Ticket, unknown>[],
  ], [canResolve, resolveTicket]);

  return (
    <div className="space-y-4">
      {data?.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open" value={data.summary.open} accent="red" />
          <StatCard label="In Progress" value={data.summary.in_progress} accent="blue" />
          <StatCard label="Resolved" value={data.summary.resolved} accent="emerald" />
          <StatCard label="High Priority" value={data.summary.high} accent="amber" />
        </div>
      )}
      <FilterBar
        filters={[
          { key: 'status', label: 'Status', options: [{ value: '', label: 'All' }, { value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }], value: status },
          { key: 'priority', label: 'Priority', options: [{ value: '', label: 'All' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }], value: priority },
        ]}
        onFilterChange={(k, v) => { if (k === 'status') setStatus(v); else setPriority(v); }}
        rightContent={canCreate && <Button size="sm" variant="primary" leftIcon={<Plus size={14} />} onClick={() => setShowForm(!showForm)}>New Ticket</Button>}
      />
      {showForm && (
        <Card>
          <CardContent className="space-y-3">
            <p className="font-semibold text-foreground">New Support Ticket</p>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Subject..." className="form-input" />
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="form-input">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={handleCreate}>Submit</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card><DataTable data={data?.data ?? []} columns={columns} loading={isLoading} /></Card>
    </div>
  );
}

// ============================================================
// SALES PAGE
// ============================================================
export function SalesPage() {
  const { data, isLoading } = useGetSalesReportsQuery({});
  const [approve] = useApproveSalesReportMutation();
  const canApprove = useHasPermission(Permission.SALES_APPROVE);

  return (
    <div className="space-y-4">
      {data?.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Gross" value={fmt(data.summary.totalGross)} accent="blue" />
          <StatCard label="Total Net" value={fmt(data.summary.totalNet)} accent="emerald" />
          <StatCard label="Total Royalty Due" value={fmt(data.summary.totalRoyalty)} accent="amber" />
          <StatCard label="Reports" value={data.summary.count} accent="purple" />
        </div>
      )}
      <Card>
        {isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">{['Period', 'Location', 'Gross Sales', 'Net Sales', 'Royalty Due', 'Status', 'Submitted', canApprove ? 'Actions' : ''].filter(Boolean).map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>)}</tr></thead>
              <tbody>
                {data?.data.map(r => (
                  <tr key={r.id} className="data-table-row">
                    <td className="px-4 py-3 font-semibold text-foreground">{r.month}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.locationId}</td>
                    <td className="px-4 py-3 font-medium">{fmt(r.grossSales)}</td>
                    <td className="px-4 py-3">{fmt(r.netSales)}</td>
                    <td className="px-4 py-3 text-amber-400 font-medium">{fmt(r.royaltyDue)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.submittedAt ?? '—'}</td>
                    {canApprove && <td className="px-4 py-3">{r.status === 'submitted' && <Button size="sm" variant="success" leftIcon={<Check size={11} />} onClick={() => { approve(r.id); toast.success('Approved!'); }}>Approve</Button>}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// LOCATIONS PAGE
// ============================================================
export function LocationsPage() {
  const { data, isLoading } = useGetLocationsQuery({});
  return (
    <Card>
      {isLoading ? <TableSkeleton /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">{['Location', 'Franchise', 'City / State', 'Manager', 'Monthly Sales', 'Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {data?.data.map(l => (
                <tr key={l.id} className="data-table-row">
                  <td className="px-4 py-3 font-semibold text-foreground">{l.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{l.franchiseName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.city}, {l.state}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.manager}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">{fmt(l.monthSales)}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ============================================================
// USERS PAGE
// ============================================================
export function UsersPage() {
  const { data, isLoading } = useGetUsersQuery();
  const [deactivate] = useDeactivateUserMutation();
  const { user: me } = useAuth();
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button size="sm" variant="primary" leftIcon={<Plus size={14} />} onClick={() => toast.info('Invite user')}>Invite User</Button></div>
      <Card>
        {isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">{['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>)}</tr></thead>
              <tbody>
                {(data?.data as any[])?.map(u => (
                  <tr key={u.id} className="data-table-row">
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={u.name} color={u.avatarColor} size="sm" /><span className="font-medium text-foreground">{u.name}</span></div></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.role} /></td>
                    <td className="px-4 py-3"><StatusBadge status={u.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Edit ${u.name}`)}>Edit</Button>
                        {u.role !== 'super_admin' && u.id !== me?.id && u.isActive && <Button size="sm" variant="danger" onClick={() => { deactivate(u.id); toast.success('Deactivated'); }}>Deactivate</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// ANNOUNCEMENTS PAGE
// ============================================================
export function AnnouncementsPage() {
  const canBroadcast = useHasPermission(Permission.ANNOUNCEMENT_BROADCAST);
  const canDelete = useHasPermission(Permission.ANNOUNCEMENT_DELETE);
  const { data, isLoading } = useGetAnnouncementsQuery();
  const [createAnn] = useCreateAnnouncementMutation();
  const [deleteAnn] = useDeleteAnnouncementMutation();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState(''); const [body, setBody] = useState(''); const [priority, setPriority] = useState('medium');

  const handleCreate = async () => {
    if (!title || !body) { toast.error('Title and body required'); return; }
    await createAnn({ title, body, priority, audience: 'all' }).unwrap();
    toast.success('Announcement sent!'); setShowForm(false); setTitle(''); setBody('');
  };

  return (
    <div className="space-y-4">
      {canBroadcast && <div className="flex justify-end"><Button size="sm" variant="primary" leftIcon={<Send size={14} />} onClick={() => setShowForm(!showForm)}>Send Broadcast</Button></div>}
      {showForm && (
        <Card>
          <CardContent className="space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title..." className="form-input" />
            <select value={priority} onChange={e => setPriority(e.target.value)} className="form-input">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Message..." className="form-input resize-none" />
            <div className="flex gap-2"><Button size="sm" variant="primary" onClick={handleCreate}>Send</Button><Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></div>
          </CardContent>
        </Card>
      )}
      {isLoading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-card border border-border rounded-xl animate-pulse" />)}</div> : (
        <div className="space-y-3">
          {data?.data.map(a => (
            <Card key={a.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {a.pinned && <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded px-1.5 py-0.5">📌 Pinned</span>}
                      <h3 className="font-semibold text-foreground">{a.title}</h3>
                      <PriorityBadge priority={a.priority} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{a.body}</p>
                    <p className="text-xs text-muted-foreground/70">By {a.sentByName} · {a.sentAt} · {a.audience}</p>
                  </div>
                  {canDelete && <Button size="sm" variant="danger" onClick={() => { deleteAnn(a.id); toast.success('Deleted'); }}>Delete</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ACTIVITY PAGE
// ============================================================
export function ActivityPage() {
  const { data, isLoading, refetch } = useGetActivityQuery({});
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button size="sm" variant="ghost" leftIcon={<RefreshCw size={13} />} onClick={() => refetch()}>Refresh</Button></div>
      <Card>
        {isLoading ? <TableSkeleton rows={10} cols={3} /> : (
          data?.data.map(a => (
            <div key={a.id} className="flex items-start gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20">
              <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0 text-sm">📋</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground/80">{a.actor}</span> · {a.target}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">{relativeTime(a.timestamp)}</p>
                <span className="text-[10px] bg-muted border border-border rounded px-1.5 py-0.5 text-muted-foreground uppercase">{a.entityType}</span>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

// ============================================================
// DOCUMENTS PAGE
// ============================================================
const DOCS = [
  { name: 'Franchise Agreement 2025.pdf', type: 'Agreement', date: '2025-01-15', size: '2.4 MB' },
  { name: 'Operations Manual v8.2.pdf', type: 'Manual', date: '2025-03-01', size: '18.7 MB' },
  { name: 'Brand Standards Guide v3.0.pdf', type: 'Brand', date: '2025-02-20', size: '5.1 MB' },
  { name: 'Food Safety Protocol 2025.pdf', type: 'Compliance', date: '2025-04-10', size: '1.8 MB' },
  { name: 'Employee Handbook 2025.pdf', type: 'HR', date: '2025-01-30', size: '3.2 MB' },
  { name: 'Royalty Rate Schedule Q2 2025.pdf', type: 'Finance', date: '2025-04-01', size: '0.4 MB' },
];

export function DocumentsPage() {
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);
  const canUpload = useHasPermission(Permission.DOCUMENT_UPLOAD);

  const sim = () => {
    if (!canUpload) { toast.error('You do not have upload permission'); return; }
    setUploading(true); setPct(0);
    const iv = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(iv); setUploading(false); toast.success('File uploaded!'); return 0; } return p + Math.random() * 25; }), 300);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-blue-500/40 transition-colors cursor-pointer" onClick={sim}>
        <p className="text-2xl mb-2" aria-hidden>📎</p>
        <p className="text-sm font-medium text-foreground">Click to upload a document</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX — max 50MB</p>
        {uploading && <div className="mt-3 max-w-xs mx-auto"><ProgressBar value={pct} /><p className="text-xs text-blue-400 mt-1">Uploading… {Math.round(pct)}%</p></div>}
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">{['Document', 'Type', 'Date', 'Size', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {DOCS.map(d => (
                <tr key={d.name} className="data-table-row">
                  <td className="px-4 py-3"><div className="flex items-center gap-2.5"><span aria-hidden>📄</span><span className="font-medium text-foreground">{d.name}</span></div></td>
                  <td className="px-4 py-3"><span className="text-xs bg-muted border border-border rounded px-2 py-0.5 text-muted-foreground">{d.type}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.size}</td>
                  <td className="px-4 py-3"><Button size="sm" variant="ghost" leftIcon={<Download size={12} />} onClick={() => toast.info(`Downloading ${d.name}…`)}>Download</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// STYLE GUIDE PAGE
// ============================================================
export function StyleguidePage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Style Guide & Asset Gallery</h2>
        <p className="text-sm text-muted-foreground">Component library reference for the Franchise Management System.</p>
      </div>
      <Card><CardHeader><CardTitle>Badges — Status Variants</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {['active', 'pending', 'overdue', 'in_progress', 'resolved', 'suspended', 'warning', 'high', 'medium', 'low', 'premium', 'enterprise'].map(s => <StatusBadge key={s} status={s} />)}
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Stat Cards</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Revenue YTD" value="$2.85M" change="↑ 12.4%" changeType="up" accent="blue" />
            <StatCard label="Royalties" value="$248K" change="On track" changeType="up" accent="emerald" />
            <StatCard label="Overdue" value="$40K" change="2 franchisees" changeType="down" accent="red" />
            <StatCard label="Open Tickets" value={8} change="Need review" changeType="flat" accent="amber" />
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Avatars & Progress Bars</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {(['blue', 'emerald', 'amber', 'purple', 'cyan'] as const).map(c => <Avatar key={c} name={`${c} user`} color={c} size="lg" />)}
          </div>
          <div className="space-y-2 max-w-xs">
            <ProgressBar value={97} color="emerald" />
            <ProgressBar value={72} color="blue" />
            <ProgressBar value={45} color="amber" />
            <ProgressBar value={23} color="red" />
            <ProgressBar value={68} color="auto" />
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Buttons</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
        </CardContent>
      </Card>
    </div>
  );
}
