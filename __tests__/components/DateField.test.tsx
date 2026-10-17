// __tests__/components/DateField.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DateField } from '@/components/DateField';

describe('DateField Component', () => {
  it('renders placeholder text when value is not provided', async () => {
    const onChange = jest.fn();
    await render(<DateField onChange={onChange} />);

    const textEl = screen.getByTestId('date-field-text');
    expect(textEl.props.children).toBe('DD / MM / YYYY');
  });

  it('renders formatted date when valid ISO date value is provided', async () => {
    const onChange = jest.fn();
    await render(<DateField value="2026-12-25" onChange={onChange} />);

    const textEl = screen.getByTestId('date-field-text');
    expect(textEl.props.children).toBe('25 / 12 / 2026');
  });

  it('renders default helper text when there is no error', async () => {
    const onChange = jest.fn();
    await render(<DateField value="2026-12-25" onChange={onChange} />);

    const helperEl = screen.getByTestId('date-field-helper');
    expect(helperEl.props.children).toBe("We'll remind you before it expires.");
  });

  it('renders custom error text when error string is passed', async () => {
    const onChange = jest.fn();
    await render(
      <DateField
        value="2020-01-01"
        onChange={onChange}
        error="Pick today or a later date"
      />
    );

    const helperEl = screen.getByTestId('date-field-helper');
    expect(helperEl.props.children).toBe('Pick today or a later date');
  });

  it('renders default error text when boolean error is passed', async () => {
    const onChange = jest.fn();
    await render(
      <DateField
        value="2020-01-01"
        onChange={onChange}
        error={true}
      />
    );

    const helperEl = screen.getByTestId('date-field-helper');
    expect(helperEl.props.children).toBe('Pick today or a later date');
  });
});
