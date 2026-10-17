// __tests__/components/PrimaryButton.test.tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { PrimaryButton } from '@/components/PrimaryButton';

describe('PrimaryButton Component', () => {
  it('renders label correctly', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Continue" onPress={onPress} />);

    expect(screen.getByText('Continue')).toBeTruthy();
  });

  it('triggers onPress when enabled and pressed', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Continue" onPress={onPress} />);

    const button = screen.getByRole('button');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Continue" onPress={onPress} disabled />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders correctly with check variant', async () => {
    const onPress = jest.fn();
    await render(
      <PrimaryButton label="Add to fridge" onPress={onPress} variant="check" />
    );

    expect(screen.getByText('Add to fridge')).toBeTruthy();
  });
});
