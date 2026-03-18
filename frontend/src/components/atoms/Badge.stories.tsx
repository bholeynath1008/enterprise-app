import type { Meta, StoryObj } from '@storybook/react';
import { Badge, StatusBadge, PriorityBadge } from '@/components/atoms';

/**
 * Badges convey status and priority across the FMS platform.
 * They use a CVA-driven variant system for consistent theming.
 */
const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'danger', 'info', 'purple'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'Standard', variant: 'default' } };
export const Success: Story = { args: { children: 'Active', variant: 'success' } };
export const Warning: Story = { args: { children: 'Pending', variant: 'warning' } };
export const Danger: Story = { args: { children: 'Overdue', variant: 'danger' } };
export const Info: Story = { args: { children: 'In Progress', variant: 'info' } };
export const Purple: Story = { args: { children: 'Premium', variant: 'purple' } };

export const AllStatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 16 }}>
      {['active', 'pending', 'overdue', 'in_progress', 'resolved', 'suspended', 'warning', 'paid', 'approved', 'submitted'].map(s => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  ),
};

export const AllPriorityBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, padding: 16 }}>
      <PriorityBadge priority="high" />
      <PriorityBadge priority="medium" />
      <PriorityBadge priority="low" />
    </div>
  ),
};
