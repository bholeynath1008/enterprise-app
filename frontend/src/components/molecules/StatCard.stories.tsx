import type { Meta, StoryObj } from '@storybook/react';
import { TrendingUp, DollarSign, AlertTriangle, Ticket, CheckSquare } from 'lucide-react';
import { StatCard } from '@/components/molecules';

/**
 * StatCard is the primary KPI display molecule in FMS dashboards.
 * Supports 5 accent colors, directional change indicators, and loading skeleton.
 */
const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    accent: { control: 'select', options: ['blue', 'emerald', 'amber', 'red', 'purple'] },
    changeType: { control: 'select', options: ['up', 'down', 'flat'] },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const SalesYTD: Story = {
  args: {
    label: 'Total Sales YTD',
    value: '$2,850,000',
    change: '↑ 12.4% vs last year',
    changeType: 'up',
    accent: 'blue',
    icon: <TrendingUp />,
  },
};

export const RoyaltiesCollected: Story = {
  args: {
    label: 'Royalties Collected',
    value: '$248,740',
    change: 'Q1 on track',
    changeType: 'up',
    accent: 'emerald',
    icon: <DollarSign />,
  },
};

export const OverdueRoyalties: Story = {
  args: {
    label: 'Overdue Royalties',
    value: '$40,550',
    change: '2 franchisees',
    changeType: 'down',
    accent: 'red',
    icon: <AlertTriangle />,
  },
};

export const OpenTickets: Story = {
  args: {
    label: 'Open Tickets',
    value: 8,
    change: 'Need attention',
    changeType: 'flat',
    accent: 'amber',
    icon: <Ticket />,
  },
};

export const LoadingState: Story = {
  args: {
    label: 'Loading...',
    value: 0,
    loading: true,
    accent: 'blue',
  },
};

export const DashboardRow: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 16 }}>
      <StatCard label="Total Sales YTD" value="$2.85M" change="↑ 12.4%" changeType="up" accent="blue" icon={<TrendingUp />} />
      <StatCard label="Royalties" value="$248K" change="On track" changeType="up" accent="emerald" icon={<DollarSign />} />
      <StatCard label="Open Tickets" value={8} change="Needs review" changeType="flat" accent="amber" icon={<Ticket />} />
    </div>
  ),
};
