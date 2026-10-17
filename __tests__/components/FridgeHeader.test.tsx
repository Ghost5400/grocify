// __tests__/components/FridgeHeader.test.tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FridgeHeader } from '@/components/fridge/FridgeHeader';

describe('FridgeHeader Component', () => {
  it('renders count chip as "0 items" when count is 0', async () => {
    await render(<FridgeHeader totalCount={0} onPressAdd={jest.fn()} />);
    expect(screen.getByText('0 items')).toBeTruthy();
    expect(screen.getByText('GROCIFY')).toBeTruthy();
  });

  it('renders singular "1 item" when count is 1', async () => {
    await render(<FridgeHeader totalCount={1} onPressAdd={jest.fn()} />);
    expect(screen.getByText('1 item')).toBeTruthy();
  });

  it('renders plural "12 items" when count is 12', async () => {
    await render(<FridgeHeader totalCount={12} onPressAdd={jest.fn()} />);
    expect(screen.getByText('12 items')).toBeTruthy();
  });

  it('calls onPressAdd when "+" button is pressed', async () => {
    const onPressAdd = jest.fn();
    await render(<FridgeHeader totalCount={5} onPressAdd={onPressAdd} />);

    const addButton = screen.getByTestId('fridge-add-button');
    fireEvent.press(addButton);
    expect(onPressAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onLongPressWordmark when wordmark is long-pressed', async () => {
    const onLongPress = jest.fn();
    await render(
      <FridgeHeader
        totalCount={3}
        onPressAdd={jest.fn()}
        onLongPressWordmark={onLongPress}
      />
    );

    const wordmark = screen.getByTestId('header-wordmark');
    fireEvent(wordmark, 'longPress');
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
