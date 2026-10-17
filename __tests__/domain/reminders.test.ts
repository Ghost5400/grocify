// __tests__/domain/reminders.test.ts

import { computeTriggerDate, REMINDER_HOUR } from '@/domain/reminders';

describe('reminders domain logic - computeTriggerDate', () => {
  it('Branch 1: schedules at 09:00 local on (expiryDate - reminderDays) when in future', () => {
    // Current time: 17 Oct 2026, 08:00 AM
    const now = new Date(2026, 9, 17, 8, 0, 0);
    const expiryDate = '2026-10-20'; // 3 days away
    const reminderDays = 2; // Reminder on 18 Oct at 09:00

    const trigger = computeTriggerDate(expiryDate, reminderDays, now);
    expect(trigger).not.toBeNull();
    expect(trigger?.getFullYear()).toBe(2026);
    expect(trigger?.getMonth()).toBe(9); // October
    expect(trigger?.getDate()).toBe(18);
    expect(trigger?.getHours()).toBe(REMINDER_HOUR);
    expect(trigger?.getMinutes()).toBe(0);
  });

  it('Branch 2: already inside reminder window, but expiry day 09:00 is in future', () => {
    // Current time: 18 Oct 2026, 14:00 (2:00 PM) - 18 Oct 09:00 has already passed!
    const now = new Date(2026, 9, 18, 14, 0, 0);
    const expiryDate = '2026-10-20';
    const reminderDays = 2; // (20 - 2 = 18 Oct at 09:00, which has passed)

    const trigger = computeTriggerDate(expiryDate, reminderDays, now);
    expect(trigger).not.toBeNull();
    // Should fall back to expiry date at 09:00 (20 Oct 09:00)
    expect(trigger?.getDate()).toBe(20);
    expect(trigger?.getHours()).toBe(REMINDER_HOUR);
  });

  it('Branch 3: both reminder trigger and expiry day 09:00 have passed -> returns null', () => {
    // Current time: 20 Oct 2026, 11:00 AM (past 09:00 on expiry day)
    const now = new Date(2026, 9, 20, 11, 0, 0);
    const expiryDate = '2026-10-20';
    const reminderDays = 1;

    const trigger = computeTriggerDate(expiryDate, reminderDays, now);
    expect(trigger).toBeNull();
  });

  it('returns null for an item that is already past expiry', () => {
    const now = new Date(2026, 9, 21, 10, 0, 0);
    const expiryDate = '2026-10-18';
    const trigger = computeTriggerDate(expiryDate, 2, now);
    expect(trigger).toBeNull();
  });
});
