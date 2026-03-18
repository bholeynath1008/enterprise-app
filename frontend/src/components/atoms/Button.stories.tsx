import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/atoms';
import { Plus, Loader2, Check, Trash2 } from 'lucide-react';

/**
 * The Button atom is the primary interactive element in FMS.
 * It supports 5 variants, 3 sizes, loading states, icons, and full a11y.
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'success'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Save Changes', variant: 'primary', size: 'md' },
};

export const Secondary: Story = {
  args: { children: 'Cancel', variant: 'secondary', size: 'md' },
};

export const Ghost: Story = {
  args: { children: 'View Details', variant: 'ghost', size: 'md' },
};

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger', size: 'md', leftIcon: <Trash2 size={14} /> },
};

export const Success: Story = {
  args: { children: 'Mark Complete', variant: 'success', size: 'md', leftIcon: <Check size={14} /> },
};

export const Loading: Story = {
  args: { children: 'Submitting...', variant: 'primary', loading: true },
};

export const WithIcon: Story = {
  args: { children: 'New Franchisee', variant: 'primary', leftIcon: <Plus size={14} /> },
};

export const Small: Story = {
  args: { children: 'Approve', variant: 'success', size: 'sm', leftIcon: <Check size={11} /> },
};

export const Large: Story = {
  args: { children: 'Sign in to FMS', variant: 'primary', size: 'lg' },
};

export const Disabled: Story = {
  args: { children: 'Cannot Click', variant: 'primary', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 16 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
