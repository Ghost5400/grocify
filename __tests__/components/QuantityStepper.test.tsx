// __tests__/components/QuantityStepper.test.tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { QuantityStepper } from '@/components/QuantityStepper';

describe('QuantityStepper Component', () => {
  it('renders initial value correctly', async () => {
    const onChange = jest.fn();
    await render(<QuantityStepper value={3} onChange={onChange} />);

    const valueEl = screen.getByTestId('stepper-value');
    expect(valueEl.props.children).toBe(3);
  });

  it('calls onChange with incremented value when plus is tapped', async () => {
    const onChange = jest.fn();
    await render(<QuantityStepper value={5} onChange={onChange} />);

    const plusBtn = screen.getByTestId('stepper-increment');
    fireEvent.press(plusBtn);
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('calls onChange with decremented value when minus is tapped', async () => {
    const onChange = jest.fn();
    await render(<QuantityStepper value={5} onChange={onChange} />);

    const minusBtn = screen.getByTestId('stepper-decrement');
    fireEvent.press(minusBtn);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('disables decrement button when at min value (1)', async () => {
    const onChange = jest.fn();
    await render(<QuantityStepper value={1} min={1} onChange={onChange} />);

    const minusBtn = screen.getByTestId('stepper-decrement');
    expect(minusBtn.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(minusBtn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables increment button when at max value (99)', async () => {
    const onChange = jest.fn();
    await render(<QuantityStepper value={99} max={99} onChange={onChange} />);

    const plusBtn = screen.getByTestId('stepper-increment');
    expect(plusBtn.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(plusBtn);
    expect(onChange).not.toHaveBeenCalled();
  });
});
