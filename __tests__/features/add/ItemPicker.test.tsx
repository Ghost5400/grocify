// __tests__/features/add/ItemPicker.test.tsx
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import ItemPickerScreen from '../../../app/add/pick';
import { useDraftStore } from '@/store/draftStore';

// Allow extra time for FlatList re-renders on state changes
jest.setTimeout(15000);

// Mock expo-router
const mockPush = jest.fn();
const mockBack = jest.fn();
let mockSearchParams: Record<string, string> = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => mockSearchParams,
}));

describe('ItemPickerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = {};
    useDraftStore.getState().resetDraft();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders neutral "Add item" header and 3 compartment chips when no param provided', async () => {
    await render(<ItemPickerScreen />);

    expect(screen.getByText('Add item')).toBeTruthy();
    expect(screen.getByTestId('chip-freezer')).toBeTruthy();
    expect(screen.getByTestId('chip-packed')).toBeTruthy();
    expect(screen.getByTestId('chip-veggies')).toBeTruthy();
  });

  it('filters items when switching compartment chips', async () => {
    await render(<ItemPickerScreen />);

    // Default: veggies — Tomato tile is present
    await waitFor(() => {
      expect(screen.getByTestId('picker-tile-tomato')).toBeTruthy();
    });

    // Switch to Freezer
    fireEvent.press(screen.getByTestId('chip-freezer'));
    await waitFor(() => {
      expect(screen.getByTestId('picker-tile-ice-cream')).toBeTruthy();
    });

    // Switch to Packed & Misc
    fireEvent.press(screen.getByTestId('chip-packed'));
    await waitFor(() => {
      expect(screen.getByTestId('picker-tile-milk')).toBeTruthy();
    });
  });

  it('filters items by search query', async () => {
    await render(<ItemPickerScreen />);

    // Cucumber is in veggies
    await waitFor(() => {
      expect(screen.getByTestId('picker-tile-cucumber')).toBeTruthy();
    });

    const searchInput = screen.getByTestId('picker-search-input');
    fireEvent.changeText(searchInput, 'cucum');

    await waitFor(() => {
      expect(screen.getByTestId('picker-tile-cucumber')).toBeTruthy();
    });
  });

  it('shows empty message when search query does not match any item', async () => {
    await render(<ItemPickerScreen />);

    const searchInput = screen.getByTestId('picker-search-input');
    fireEvent.changeText(searchInput, 'nonexistentitemxyz');

    await waitFor(() => {
      expect(screen.getByText('No items match. Try another name.')).toBeTruthy();
    });
  });

  it('updates draft store and navigates to details when an item is selected', async () => {
    await render(<ItemPickerScreen />);

    const tomatoTile = screen.getByTestId('picker-tile-tomato');
    fireEvent.press(tomatoTile);

    await waitFor(() => {
      const draft = useDraftStore.getState();
      expect(draft.catalogEntry?.name).toBe('Tomato');
      expect(draft.compartment).toBe('veggies');
      expect(draft.quantity).toBe(1);
      expect(mockPush).toHaveBeenCalledWith('/add/details');
    });
  });

  it('locks compartment when passed via route param', async () => {
    mockSearchParams = { compartment: 'freezer' };
    await render(<ItemPickerScreen />);

    // Title should be "Add to Freezer" and chips row is not shown
    expect(screen.getByText('Add to Freezer')).toBeTruthy();
    expect(screen.queryByTestId('chip-freezer')).toBeNull();
    expect(screen.getByTestId('picker-tile-ice-cream')).toBeTruthy();
  });
});

