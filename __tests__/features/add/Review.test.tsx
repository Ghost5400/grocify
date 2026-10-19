import React from 'react';
import { Linking } from 'react-native';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { addDays, format } from 'date-fns';
import ReviewScreen from '../../../app/add/review';
import { notificationsService } from '@/services/notifications';
import { useDraftStore } from '@/store/draftStore';
import { useFridgeStore } from '@/store/fridgeStore';
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
}));

describe('ReviewScreen', () => {
  const targetDate = format(addDays(new Date(), 6), ISO_DATE_FORMAT);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined as any);
    useFridgeStore.getState().resetAllForDev();
    useFridgeStore.getState().setHasPromptedNotificationPermission(true);
    useDraftStore.getState().resetDraft();
    useDraftStore.getState().setCatalogEntry({
      id: 'tomato',
      name: 'Tomato',
      compartment: 'veggies',
      imageKey: 'tomato',
    });
    useDraftStore.getState().setQuantity(3);
    useDraftStore.getState().setExpiryDate(targetDate);
    useDraftStore.getState().setReminderDays(2);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders summary card with item name, quantity chip, and formatted expiry date', async () => {
    await render(<ReviewScreen />);

    expect(screen.getByTestId('review-item-name')).toHaveTextContent('Tomato');
    expect(screen.getByTestId('review-quantity-chip')).toHaveTextContent('× 3');
    expect(screen.getByText('Veggies')).toBeTruthy();
    expect(screen.getByText(formatDateLong(targetDate))).toBeTruthy();
    expect(screen.getByText('Expires in 6 days')).toBeTruthy();
  });

  it('allows changing reminder lead time via reminder chips', async () => {
    await render(<ReviewScreen />);

    expect(useDraftStore.getState().reminderDays).toBe(2);

    // Click 1 week (7 days)
    const oneWeekChip = screen.getByTestId('reminder-chip-7');
    fireEvent.press(oneWeekChip);
    await waitFor(() => {
      expect(useDraftStore.getState().reminderDays).toBe(7);
    });

    // Click 1 day
    const oneDayChip = screen.getByTestId('reminder-chip-1');
    fireEvent.press(oneDayChip);
    await waitFor(() => {
      expect(useDraftStore.getState().reminderDays).toBe(1);
    });
  });

  it('navigates back to details when Edit button is pressed', async () => {
    await render(<ReviewScreen />);

    const editButton = screen.getByTestId('review-edit-btn');
    fireEvent.press(editButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('adds item to fridge store, resets draft, and replaces route to /fridge on Add to fridge press when already prompted', async () => {
    await render(<ReviewScreen />);

    const saveButton = screen.getByTestId('review-save-btn');
    fireEvent.press(saveButton);

    await waitFor(() => {
      const items = useFridgeStore.getState().items;
      expect(items.length).toBeGreaterThan(0);
      const added = items.find((i) => i.name === 'Tomato');
      expect(added).toBeDefined();
      expect(added?.quantity).toBe(3);
      expect(added?.compartment).toBe('veggies');

      // Check draft is reset
      expect(useDraftStore.getState().catalogEntry).toBeNull();

      // Check route replaced with justAdded param
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/fridge',
        params: { justAdded: 'veggies' },
      });
    });
  });

  it('presents NotificationPermissionSheet on first item save if not yet prompted, and allows enabling', async () => {
    useFridgeStore.getState().setHasPromptedNotificationPermission(false);
    const ensurePermissionSpy = jest.spyOn(notificationsService, 'ensurePermission');

    await render(<ReviewScreen />);

    const saveButton = screen.getByTestId('review-save-btn');
    fireEvent.press(saveButton);

    // Permission sheet should appear
    await waitFor(() => {
      expect(screen.getByTestId('permission-sheet-title')).toBeTruthy();
      expect(screen.getByText('Stay ahead of expiry')).toBeTruthy();
    });

    // Tap allow
    const allowBtn = screen.getByTestId('permission-sheet-allow-btn');
    fireEvent.press(allowBtn);

    await waitFor(() => {
      expect(ensurePermissionSpy).toHaveBeenCalled();
      expect(useFridgeStore.getState().settings.hasPromptedNotificationPermission).toBe(true);
      expect(useFridgeStore.getState().items.length).toBe(1);
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/fridge',
        params: { justAdded: 'veggies' },
      });
    });
  });

  it('allows user to dismiss pre-prompt with Not now and still completes the save', async () => {
    useFridgeStore.getState().setHasPromptedNotificationPermission(false);

    await render(<ReviewScreen />);

    const saveButton = screen.getByTestId('review-save-btn');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('permission-sheet-title')).toBeTruthy();
    });

    const notNowBtn = screen.getByTestId('permission-sheet-not-now-btn');
    fireEvent.press(notNowBtn);

    await waitFor(() => {
      expect(useFridgeStore.getState().settings.hasPromptedNotificationPermission).toBe(true);
      expect(useFridgeStore.getState().items.length).toBe(1);
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/fridge',
        params: { justAdded: 'veggies' },
      });
    });
  });

  it('renders non-blocking notice when notifications are denied, and Settings button calls openSettings', async () => {
    useFridgeStore.getState().setHasPromptedNotificationPermission(true);
    jest.spyOn(notificationsService, 'checkPermission').mockResolvedValue(false);

    await render(<ReviewScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('review-permission-hint')).toBeTruthy();
      expect(
        screen.getByText('Turn on notifications to get expiry reminders')
      ).toBeTruthy();
    });

    const settingsBtn = screen.getByTestId('review-open-settings-btn');
    fireEvent.press(settingsBtn);

    expect(Linking.openSettings).toHaveBeenCalledTimes(1);
  });
});
