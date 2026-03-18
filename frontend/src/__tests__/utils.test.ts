import { fmt, fmtPct, getInitials, labelStatus, statusVariant, relativeTime } from '@/lib/utils';

describe('fmt', () => {
  it('formats currency with dollar sign', () => {
    expect(fmt(1000)).toBe('$1,000');
    expect(fmt(1500000)).toBe('$1,500,000');
  });
  it('formats zero', () => {
    expect(fmt(0)).toBe('$0');
  });
  it('handles negative values', () => {
    expect(fmt(-500)).toContain('500');
  });
});

describe('fmtPct', () => {
  it('returns percentage string', () => {
    expect(fmtPct(75)).toBe('75.0%');
    expect(fmtPct(100, 0)).toBe('100%');
  });
});

describe('getInitials', () => {
  it('returns two initials from full name', () => {
    expect(getInitials('John Smith')).toBe('JS');
    expect(getInitials('Alexandra Chen')).toBe('AC');
  });
  it('handles single word', () => {
    expect(getInitials('Admin')).toBe('AD');
  });
  it('caps at 2 characters', () => {
    expect(getInitials('John Paul Smith').length).toBe(2);
  });
});

describe('labelStatus', () => {
  it('maps known statuses', () => {
    expect(labelStatus('in_progress')).toBe('In Progress');
    expect(labelStatus('super_admin')).toBe('Super Admin');
    expect(labelStatus('location_manager')).toBe('Location Manager');
  });
  it('capitalizes unknown statuses', () => {
    expect(labelStatus('active')).toBe('Active');
    expect(labelStatus('pending')).toBe('Pending');
  });
});

describe('statusVariant', () => {
  it('maps success statuses', () => {
    expect(statusVariant('active')).toBe('success');
    expect(statusVariant('paid')).toBe('success');
    expect(statusVariant('completed')).toBe('success');
  });
  it('maps danger statuses', () => {
    expect(statusVariant('overdue')).toBe('danger');
    expect(statusVariant('suspended')).toBe('danger');
    expect(statusVariant('open')).toBe('danger');
  });
  it('maps warning statuses', () => {
    expect(statusVariant('pending')).toBe('warning');
    expect(statusVariant('warning')).toBe('warning');
  });
  it('returns default for unknown', () => {
    expect(statusVariant('unknown_status')).toBe('default');
  });
});
