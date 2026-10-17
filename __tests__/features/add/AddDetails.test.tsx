// __tests__/features/add/AddDetails.test.tsx
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { addDays, format, subDays } from 'date-fns';
import DetailsScreen from '../../../app/add/details';
import { useDraftStore } from '@/store/draftStore';
import { ISO_DATE_FORMAT } from '@/utils/date';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: jest.fn(),
  }),
}));

describe('DetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDraftStore.getState().resetDraft();
    useDraftStore.getState().setCatalogEntry({
      id: 'tomato',
      name: 'Tomato',
      compartment: 'veggies',
      imageKey: 'tomato',
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders item name, quantity stepper, and date field', async () => {
    await render(<DetailsScreen />);

    expect(screen.getByText('Tomato')).toBeTruthy();
    expect(screen.getByText('Add to Veggies')).toBeTruthy();
    expect(screen.getByText('Quantity')).toBeTruthy();
    expect(screen.getByText('Expiry date')).toBeTruthy();
    expect(screen.getByText("We'll remind you before it expires.")).toBeTruthy();
  });

  it('disables Continue button when no expiry date is selected', async () => {
    await render(<DetailsScreen />);

    const continueButton = screen.getByTestId('details-continue-btn');
    expect(continueButton.props.accessibilityState?.disabled).toBe(true);

    fireEvent.press(continueButton);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('disables Continue button and shows error when expiry date is in the past', async () => {
    const pastDate = format(subDays(new Date(), 2), ISO_DATE_FORMAT);
    useDraftStore.getState().setExpiryDate(pastDate);

    await render(<DetailsScreen />);

    expect(screen.getByText('Pick today or a later date')).toBeTruthy();
    const continueButton = screen.getByTestId('details-continue-btn');
    expect(continueButton.props.accessibilityState?.disabled).toBe(true);

    fireEvent.press(continueButton);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('enables Continue button when a valid future date is selected and navigates to review', async () => {
    const futureDate = format(addDays(new Date(), 5), ISO_DATE_FORMAT);
    useDraftStore.getState().setExpiryDate(futureDate);

    await render(<DetailsScreen />);

    const continueButton = screen.getByTestId('details-continue-btn');
    expect(continueButton.props.accessibilityState?.disabled).toBe(false);

    fireEvent.press(continueButton);
    expect(mockPush).toHaveBeenCalledWith('/add/review');
  });

  it('enables Continue button when expiry date is today', async () => {
    const today = format(new Date(), ISO_DATE_FORMAT);
    useDraftStore.getState().setExpiryDate(today);

    await render(<DetailsScreen />);

    const continueButton = screen.getByTestId('details-continue-btn');
    expect(continueButton.props.accessibilityState?.disabled).toBe(false);
  });

  it('updates quantity in draft store when stepper buttons are pressed', async () => {
    await render(<DetailsScreen />);

    expect(useDraftStore.getState().quantity).toBe(1);

    const plusBtn = screen.getByTestId('stepper-increment');
    fireEvent.press(plusBtn);
    await waitFor(() => {
      expect(useDraftStore.getState().quantity).toBe(2);
    });

    const minusBtn = screen.getByTestId('stepper-decrement');
    fireEvent.press(minusBtn);
    await waitFor(() => {
      expect(useDraftStore.getState().quantity).toBe(1);
    });
  });
});
