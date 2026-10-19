// __tests__/features/inventory/DeleteConfirmSheet.test.tsx
jest.setTimeout(20000);

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react-native';
import { DeleteConfirmSheet } from '@/features/inventory/DeleteConfirmSheet';
import { Item } from '@/domain/types';

describe('DeleteConfirmSheet', () => {
  const mockItem: Item = {
    id: 'test-1',
    name: 'Tomato',
    catalogId: 'tomato',
    compartment: 'veggies',
    imageKey: 'tomato',
    quantity: 3,
    expiryDate: '2026-11-20',
    reminderDays: 2,
    notificationId: null,
    addedAt: '2026-10-19T00:00:00.000Z',
  };

  const mockConfirm = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders nothing when visible is false or item is null', async () => {
    await render(
      <DeleteConfirmSheet
        visible={false}
        item={null}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );

    expect(screen.queryByTestId('delete-sheet-title')).toBeNull();
  });

  it('renders confirmation title with item name and description when visible', async () => {
    await render(
      <DeleteConfirmSheet
        visible={true}
        item={mockItem}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );

    expect(screen.getByTestId('delete-sheet-title')).toHaveTextContent('Remove Tomato?');
    expect(screen.getByText('This item will be removed from your fridge.')).toBeTruthy();
    expect(screen.getByTestId('delete-sheet-confirm-btn')).toBeTruthy();
    expect(screen.getByTestId('delete-sheet-cancel-btn')).toBeTruthy();
  });

  it('calls onConfirm when Remove button is pressed', async () => {
    await render(
      <DeleteConfirmSheet
        visible={true}
        item={mockItem}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );

    fireEvent.press(screen.getByTestId('delete-sheet-confirm-btn'));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is pressed', async () => {
    await render(
      <DeleteConfirmSheet
        visible={true}
        item={mockItem}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );

    fireEvent.press(screen.getByTestId('delete-sheet-cancel-btn'));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when backdrop is pressed', async () => {
    await render(
      <DeleteConfirmSheet
        visible={true}
        item={mockItem}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );

    fireEvent.press(screen.getByTestId('delete-sheet-backdrop'));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
