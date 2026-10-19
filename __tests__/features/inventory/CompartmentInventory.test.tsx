// __tests__/features/inventory/CompartmentInventory.test.tsx
jest.setTimeout(25000);

import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { addDays, format } from 'date-fns';
import CompartmentInventoryScreen from '../../../app/compartment/[id]';
import { selectItemsByCompartment, selectTotalCount, useFridgeStore } from '@/store/fridgeStore';
import { ISO_DATE_FORMAT } from '@/utils/date';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
let mockParams: { id?: string } = { id: 'veggies' };

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => mockParams,
}));

describe('CompartmentInventoryScreen', () => {
  const dateSoon = format(addDays(new Date(), 2), ISO_DATE_FORMAT);
  const dateLater = format(addDays(new Date(), 6), ISO_DATE_FORMAT);

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'veggies' };
    useFridgeStore.getState().resetAllForDev();
  });

  afterEach(() => {
    cleanup();
  });

  it('redirects to /fridge when invalid compartment id is provided', async () => {
    mockParams = { id: 'invalid-id' };
    await render(<CompartmentInventoryScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/fridge');
    });
  });

  it('renders EmptyState when compartment has no items', async () => {
    await render(<CompartmentInventoryScreen />);

    expect(screen.getByTestId('inventory-empty-state')).toBeTruthy();
    expect(screen.getByText('Nothing here yet')).toBeTruthy();
    expect(screen.getByText('Add your first item to this compartment.')).toBeTruthy();

    const addBtn = screen.getByText('Add item');
    fireEvent.press(addBtn);

    expect(mockPush).toHaveBeenCalledWith('/add/pick?compartment=veggies');
  });

  it('renders item list sorted by soonest expiry first', async () => {
    useFridgeStore.getState().seedSampleItemsForDev([
      {
        id: 'item-1',
        name: 'Tomato',
        catalogId: 'tomato',
        compartment: 'veggies',
        imageKey: 'tomato',
        quantity: 3,
        expiryDate: dateLater,
        reminderDays: 2,
        notificationId: null,
        addedAt: '2026-10-19T00:00:00.000Z',
      },
      {
        id: 'item-2',
        name: 'Cucumber',
        catalogId: 'cucumber',
        compartment: 'veggies',
        imageKey: 'cucumber',
        quantity: 2,
        expiryDate: dateSoon,
        reminderDays: 2,
        notificationId: null,
        addedAt: '2026-10-19T00:00:00.000Z',
      },
    ]);

    await render(<CompartmentInventoryScreen />);

    // Header count chip shows "2 items"
    expect(screen.getByTestId('inventory-count-chip')).toHaveTextContent('2 items');

    // Both items rendered
    expect(screen.getByText('Tomato')).toBeTruthy();
    expect(screen.getByText('Cucumber')).toBeTruthy();

    // Verify store selector returns sorted order: Cucumber (soon) first, then Tomato (later)
    const sorted = selectItemsByCompartment(useFridgeStore.getState().items, 'veggies');
    expect(sorted[0]?.name).toBe('Cucumber');
    expect(sorted[1]?.name).toBe('Tomato');
  });

  it('opens EditItemSheet when a row is tapped, and saves updated item', async () => {
    useFridgeStore.getState().seedSampleItemsForDev([
      {
        id: 'item-1',
        name: 'Tomato',
        catalogId: 'tomato',
        compartment: 'veggies',
        imageKey: 'tomato',
        quantity: 2,
        expiryDate: dateLater,
        reminderDays: 2,
        notificationId: null,
        addedAt: '2026-10-19T00:00:00.000Z',
      },
    ]);

    await render(<CompartmentInventoryScreen />);

    // Tap row
    const row = screen.getByTestId('item-row-item-1');
    fireEvent.press(row);

    // Edit sheet appears
    expect(await screen.findByTestId('edit-sheet-item-name')).toHaveTextContent('Tomato');

    // Increment quantity from 2 to 3
    const incrementBtn = screen.getByTestId('stepper-increment');
    fireEvent.press(incrementBtn);
    await waitFor(() => {
      expect(screen.getByTestId('stepper-value')).toHaveTextContent('3');
    });

    // Save
    const saveBtn = screen.getByTestId('edit-sheet-save-btn');
    fireEvent.press(saveBtn);

    await waitFor(() => {
      const updated = useFridgeStore.getState().items.find((i) => i.id === 'item-1');
      expect(updated?.quantity).toBe(3);
    });
  });

  it('deletes item via swipe delete action and confirmation sheet', async () => {
    useFridgeStore.getState().seedSampleItemsForDev([
      {
        id: 'item-del-1',
        name: 'Carrot',
        catalogId: 'carrot',
        compartment: 'veggies',
        imageKey: 'carrot',
        quantity: 5,
        expiryDate: dateLater,
        reminderDays: 2,
        notificationId: null,
        addedAt: '2026-10-19T00:00:00.000Z',
      },
    ]);

    expect(selectTotalCount(useFridgeStore.getState().items)).toBe(1);

    await render(<CompartmentInventoryScreen />);

    // Click swipe delete button
    const deleteBtn = screen.getByTestId('swipe-delete-btn-item-del-1');
    fireEvent.press(deleteBtn);

    // Confirmation sheet opens
    expect(await screen.findByTestId('delete-sheet-title')).toHaveTextContent('Remove Carrot?');

    // Confirm deletion
    const confirmBtn = screen.getByTestId('delete-sheet-confirm-btn');
    await act(async () => {
      fireEvent.press(confirmBtn);
    });

    await waitFor(() => {
      const items = useFridgeStore.getState().items;
      expect(items).toHaveLength(0);
      expect(selectTotalCount(items)).toBe(0);
    });
  });

  it('deletes item from inside EditItemSheet via confirmation sheet', async () => {
    useFridgeStore.getState().seedSampleItemsForDev([
      {
        id: 'item-edit-del-1',
        name: 'Lettuce',
        catalogId: 'lettuce',
        compartment: 'veggies',
        imageKey: 'lettuce',
        quantity: 1,
        expiryDate: dateLater,
        reminderDays: 2,
        notificationId: null,
        addedAt: '2026-10-19T00:00:00.000Z',
      },
    ]);

    await render(<CompartmentInventoryScreen />);

    // Tap row to open edit sheet
    const row = screen.getByTestId('item-row-item-edit-del-1');
    fireEvent.press(row);

    // Tap "Remove item" inside edit sheet
    const removeBtn = await screen.findByTestId('edit-sheet-delete-btn');
    fireEvent.press(removeBtn);

    // Confirmation sheet opens
    expect(await screen.findByTestId('delete-sheet-title')).toHaveTextContent('Remove Lettuce?');

    // Confirm deletion
    const confirmBtn = screen.getByTestId('delete-sheet-confirm-btn');
    await act(async () => {
      fireEvent.press(confirmBtn);
    });

    await waitFor(() => {
      const items = useFridgeStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });
});
