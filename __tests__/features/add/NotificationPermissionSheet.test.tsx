// __tests__/features/add/NotificationPermissionSheet.test.tsx
// Component tests for NotificationPermissionSheet per UIUX section 9.4.

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { NotificationPermissionSheet } from '@/features/add-item/NotificationPermissionSheet';

describe('NotificationPermissionSheet', () => {
  const onAllowMock = jest.fn();
  const onNotNowMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible is true', async () => {
    const { getByTestId, getByText } = await render(
      <NotificationPermissionSheet
        visible={true}
        onAllow={onAllowMock}
        onNotNow={onNotNowMock}
      />
    );

    expect(getByTestId('permission-icon-circle')).toBeTruthy();
    expect(getByTestId('permission-sheet-title')).toBeTruthy();
    expect(getByText('Stay ahead of expiry')).toBeTruthy();
    expect(
      getByText('Allow notifications and GROCIFY will remind you before your food expires.')
    ).toBeTruthy();
    expect(getByTestId('permission-sheet-allow-btn')).toBeTruthy();
    expect(getByTestId('permission-sheet-not-now-btn')).toBeTruthy();
  });

  it('triggers onAllow callback when Allow notifications button is pressed', async () => {
    const { getByTestId } = await render(
      <NotificationPermissionSheet
        visible={true}
        onAllow={onAllowMock}
        onNotNow={onNotNowMock}
      />
    );

    const allowBtn = getByTestId('permission-sheet-allow-btn');
    fireEvent.press(allowBtn);

    expect(onAllowMock).toHaveBeenCalledTimes(1);
    expect(onNotNowMock).not.toHaveBeenCalled();
  });

  it('triggers onNotNow callback when Not now button is pressed', async () => {
    const { getByTestId } = await render(
      <NotificationPermissionSheet
        visible={true}
        onAllow={onAllowMock}
        onNotNow={onNotNowMock}
      />
    );

    const notNowBtn = getByTestId('permission-sheet-not-now-btn');
    fireEvent.press(notNowBtn);

    expect(onNotNowMock).toHaveBeenCalledTimes(1);
    expect(onAllowMock).not.toHaveBeenCalled();
  });

  it('triggers onNotNow when tapping the backdrop overlay', async () => {
    const { getByTestId } = await render(
      <NotificationPermissionSheet
        visible={true}
        onAllow={onAllowMock}
        onNotNow={onNotNowMock}
      />
    );

    const backdrop = getByTestId('permission-sheet-backdrop');
    fireEvent.press(backdrop);

    expect(onNotNowMock).toHaveBeenCalledTimes(1);
  });
});
