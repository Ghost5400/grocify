// __tests__/features/add/AddFlowIntegration.test.tsx
// End-to-end integration test for the Add Flow per PRD Section 6.2 and Kickoff Phase 4 specs.

import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { addDays, format } from 'date-fns';
import ItemPickerScreen from '../../../app/add/pick';
import DetailsScreen from '../../../app/add/details';
import ReviewScreen from '../../../app/add/review';
import { selectTotalCount, useFridgeStore } from '@/store/fridgeStore';
import { useDraftStore } from '@/store/draftStore';
import { formatDateLong, ISO_DATE_FORMAT } from '@/utils/date';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => ({}),
}));

describe('Add Flow Integration Test', () => {
  const targetDate = format(addDays(new Date(), 5), ISO_DATE_FORMAT);

  beforeEach(() => {
    jest.clearAllMocks();
    useDraftStore.getState().resetDraft();
    useFridgeStore.getState().resetAllForDev();
  });

  afterEach(() => {
    cleanup();
  });

  it('completes the full flow: pick Tomato -> quantity 3 -> valid date -> review -> save to fridge', async () => {
    // ----------------------------------------------------
    // Step 1: Item Picker Screen
    // ----------------------------------------------------
    const { unmount: unmountPicker } = await render(<ItemPickerScreen />);

    // Tomato tile is in veggies compartment (default)
    const tomatoTile = await screen.findByTestId('picker-tile-tomato');
    expect(tomatoTile).toBeTruthy();

    fireEvent.press(tomatoTile);

    await waitFor(() => {
      expect(useDraftStore.getState().catalogEntry?.name).toBe('Tomato');
      expect(useDraftStore.getState().compartment).toBe('veggies');
      expect(useDraftStore.getState().quantity).toBe(1);
      expect(mockPush).toHaveBeenCalledWith('/add/details');
    });

    unmountPicker();

    // ----------------------------------------------------
    // Step 2: Add Details Screen
    // ----------------------------------------------------
    const { unmount: unmountDetails } = await render(<DetailsScreen />);

    expect(screen.getByText('Add to Veggies')).toBeTruthy();
    expect(screen.getByText('Tomato')).toBeTruthy();

    // Increment quantity to 3 via the stepper button (two presses: 1 -> 2 -> 3)
    const plusBtn = screen.getByTestId('stepper-increment');
    fireEvent.press(plusBtn);
    await waitFor(() => {
      expect(useDraftStore.getState().quantity).toBe(2);
    });
    fireEvent.press(plusBtn);
    await waitFor(() => {
      expect(useDraftStore.getState().quantity).toBe(3);
    });

    // Continue should still be disabled because expiryDate is null
    const continueBtn = screen.getByTestId('details-continue-btn');
    expect(continueBtn.props.accessibilityState?.disabled).toBe(true);

    // Set a valid future expiry date via store (wrapped in act so React flushes updates)
    await act(async () => {
      useDraftStore.getState().setExpiryDate(targetDate);
    });

    // Continue button is now enabled
    await waitFor(() => {
      expect(screen.getByTestId('details-continue-btn').props.accessibilityState?.disabled).toBe(false);
    });

    fireEvent.press(screen.getByTestId('details-continue-btn'));
    expect(mockPush).toHaveBeenCalledWith('/add/review');

    unmountDetails();

    // ----------------------------------------------------
    // Step 3: Confirmation / Review Screen
    // ----------------------------------------------------
    const { unmount: unmountReview } = await render(<ReviewScreen />);

    // Use findByTestId (async) because store-driven renders may not be synchronous
    expect(await screen.findByTestId('review-item-name')).toHaveTextContent('Tomato');
    expect(screen.getByTestId('review-quantity-chip')).toHaveTextContent('× 3');
    expect(screen.getByText('Veggies')).toBeTruthy();
    expect(screen.getByText(formatDateLong(targetDate))).toBeTruthy();

    // Change reminder to 1 week (7 days)
    const oneWeekChip = screen.getByTestId('reminder-chip-7');
    fireEvent.press(oneWeekChip);
    await waitFor(() => {
      expect(useDraftStore.getState().reminderDays).toBe(7);
    });

    // Tap "Add to fridge"
    const saveButton = screen.getByTestId('review-save-btn');
    fireEvent.press(saveButton);

    // ----------------------------------------------------
    // Step 4: Verification of Store State & Navigation
    // ----------------------------------------------------
    await waitFor(() => {
      const storedItems = useFridgeStore.getState().items;
      expect(storedItems).toHaveLength(1);

      const savedItem = storedItems[0];
      expect(savedItem).toBeDefined();
      expect(savedItem?.name).toBe('Tomato');
      expect(savedItem?.catalogId).toBe('tomato');
      expect(savedItem?.compartment).toBe('veggies');
      expect(savedItem?.quantity).toBe(3);
      expect(savedItem?.expiryDate).toBe(targetDate);
      expect(savedItem?.reminderDays).toBe(7);

      // Total count selector returns 1
      expect(selectTotalCount(storedItems)).toBe(1);

      // Draft store is reset
      expect(useDraftStore.getState().catalogEntry).toBeNull();

      // Route replaces back to /fridge with justAdded param
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/fridge',
        params: { justAdded: 'veggies' },
      });
    });

    unmountReview();
  });
});

