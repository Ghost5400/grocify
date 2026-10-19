// __tests__/features/inventory/SwipeableItemRow.test.tsx
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react-native';
import { SwipeableItemRow } from '@/features/inventory/SwipeableItemRow';
import { Item } from '@/domain/types';

describe('SwipeableItemRow', () => {
  const mockItem: Item = {
    id: 'test-item-1',
    name: 'Carrot',
    catalogId: 'carrot',
    compartment: 'veggies',
    imageKey: 'carrot',
    quantity: 4,
    expiryDate: '2026-11-15',
    reminderDays: 2,
    notificationId: null,
    addedAt: '2026-10-19T00:00:00.000Z',
  };

  const mockPress = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders item row details including name, quantity, expiry, and status badge', async () => {
    await render(
      <SwipeableItemRow
        item={mockItem}
        onPress={mockPress}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('Carrot')).toBeTruthy();
    expect(screen.getByText(/Qty 4/)).toBeTruthy();
  });

  it('calls onPress when item row is tapped', async () => {
    await render(
      <SwipeableItemRow
        item={mockItem}
        onPress={mockPress}
        onDelete={mockDelete}
      />
    );

    const row = screen.getByTestId('item-row-test-item-1');
    fireEvent.press(row);

    expect(mockPress).toHaveBeenCalledWith(mockItem);
  });

  it('renders swipe delete action button and calls onDelete when tapped', async () => {
    await render(
      <SwipeableItemRow
        item={mockItem}
        onPress={mockPress}
        onDelete={mockDelete}
      />
    );

    const deleteBtn = screen.getByTestId('swipe-delete-btn-test-item-1');
    expect(deleteBtn).toBeTruthy();

    fireEvent.press(deleteBtn);
    expect(mockDelete).toHaveBeenCalledWith(mockItem);
  });
});
