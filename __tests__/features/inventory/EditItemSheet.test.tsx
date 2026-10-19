// __tests__/features/inventory/EditItemSheet.test.tsx
jest.setTimeout(20000);

import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { addDays, format, subDays } from 'date-fns';
import { EditItemSheet } from '@/features/inventory/EditItemSheet';
import { Item } from '@/domain/types';
import { ISO_DATE_FORMAT } from '@/utils/date';

describe('EditItemSheet', () => {
  const futureDate = format(addDays(new Date(), 8), ISO_DATE_FORMAT);
  const pastDate = format(subDays(new Date(), 2), ISO_DATE_FORMAT);

  const mockItem: Item = {
    id: 'item-edit-1',
    name: 'Broccoli',
    catalogId: 'broccoli',
    compartment: 'veggies',
    imageKey: 'broccoli',
    quantity: 2,
    expiryDate: futureDate,
    reminderDays: 2,
    notificationId: null,
    addedAt: '2026-10-19T00:00:00.000Z',
  };

  const mockSave = jest.fn();
  const mockDelete = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders nothing when visible is false or item is null', async () => {
    await render(
      <EditItemSheet
        visible={false}
        item={null}
        onSave={mockSave}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );

    expect(screen.queryByTestId('edit-sheet-item-name')).toBeNull();
  });

  it('renders item name, quantity stepper, date field, and reminder chips', async () => {
    await render(
      <EditItemSheet
        visible={true}
        item={mockItem}
        onSave={mockSave}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );

    expect(await screen.findByTestId('edit-sheet-item-name')).toHaveTextContent('Broccoli');
    expect(screen.getByTestId('stepper-value')).toHaveTextContent('2');
    expect(screen.getByTestId('edit-sheet-save-btn')).toBeTruthy();
    expect(screen.getByTestId('edit-sheet-delete-btn')).toBeTruthy();
  });

  it('allows incrementing quantity and saving updated quantity', async () => {
    await render(
      <EditItemSheet
        visible={true}
        item={mockItem}
        onSave={mockSave}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );

    const plusBtn = await screen.findByTestId('stepper-increment');
    await act(async () => {
      fireEvent.press(plusBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('stepper-value')).toHaveTextContent('3');
    });

    const saveBtn = screen.getByTestId('edit-sheet-save-btn');
    await act(async () => {
      fireEvent.press(saveBtn);
    });

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith({
        quantity: 3,
        expiryDate: futureDate,
        reminderDays: 2,
      });
    });
  });

  it('allows changing reminder days and saving', async () => {
    await render(
      <EditItemSheet
        visible={true}
        item={mockItem}
        onSave={mockSave}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );

    const oneWeekChip = await screen.findByTestId('reminder-chip-7');
    await act(async () => {
      fireEvent.press(oneWeekChip);
    });

    const saveBtn = await screen.findByTestId('edit-sheet-save-btn');
    await act(async () => {
      fireEvent.press(saveBtn);
    });

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith({
        quantity: 2,
        expiryDate: futureDate,
        reminderDays: 7,
      });
    });
  });

  it('disables save button when expiry date is in the past', async () => {
    const pastItem: Item = {
      ...mockItem,
      expiryDate: pastDate,
    };

    await render(
      <EditItemSheet
        visible={true}
        item={pastItem}
        onSave={mockSave}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );

    const saveBtn = await screen.findByTestId('edit-sheet-save-btn');
    expect(saveBtn.props.accessibilityState?.disabled).toBe(true);

    fireEvent.press(saveBtn);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('calls onDelete when "Remove item" button is pressed', async () => {
    await render(
      <EditItemSheet
        visible={true}
        item={mockItem}
        onSave={mockSave}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );

    const deleteBtn = await screen.findByTestId('edit-sheet-delete-btn');
    await act(async () => {
      fireEvent.press(deleteBtn);
    });

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button or backdrop is pressed', async () => {
    await render(
      <EditItemSheet
        visible={true}
        item={mockItem}
        onSave={mockSave}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );

    const closeBtn = await screen.findByTestId('edit-sheet-close-btn');
    await act(async () => {
      fireEvent.press(closeBtn);
    });

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
