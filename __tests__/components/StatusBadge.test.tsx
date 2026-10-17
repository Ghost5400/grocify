// __tests__/components/StatusBadge.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StatusBadge } from '@/components/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders explicit fresh status with label', async () => {
    await render(<StatusBadge status="fresh" label="Fresh" />);

    const textEl = screen.getByTestId('status-badge-text');
    expect(textEl.props.children).toBe('Fresh');
  });

  it('renders explicit expiringSoon status with label', async () => {
    await render(<StatusBadge status="expiringSoon" label="Expires in 2 days" />);

    const textEl = screen.getByTestId('status-badge-text');
    expect(textEl.props.children).toBe('Expires in 2 days');
  });

  it('renders explicit expired status with label', async () => {
    await render(<StatusBadge status="expired" label="Expired 3 days ago" />);

    const textEl = screen.getByTestId('status-badge-text');
    expect(textEl.props.children).toBe('Expired 3 days ago');
  });

  it('auto-resolves status and label from an expiryDate in the future', async () => {
    await render(<StatusBadge expiryDate="2099-01-01" reminderDays={2} />);

    const textEl = screen.getByTestId('status-badge-text');
    expect(textEl.props.children).toContain('Expires in');
  });

  it('auto-resolves expired status and label from a past date', async () => {
    await render(<StatusBadge expiryDate="2020-01-01" reminderDays={2} />);

    const textEl = screen.getByTestId('status-badge-text');
    expect(textEl.props.children).toContain('Expired');
  });
});
