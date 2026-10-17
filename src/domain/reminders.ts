// src/domain/reminders.ts
// Reminder schedule calculations per TRD section 7.2.

import { parseISO, set, subDays } from 'date-fns';

export const REMINDER_HOUR = 9;

/**
 * Computes the trigger date/time for an item's expiry notification.
 * Trigger is set to 09:00 local time on (expiryDate - reminderDays).
 * If that time has already passed but 09:00 on the expiry day is still in the future,
 * returns expiry day 09:00.
 * Otherwise returns null (nothing sensible to schedule).
 */
export function computeTriggerDate(
  expiryDate: string,
  reminderDays: number,
  now: Date = new Date()
): Date | null {
  const expiry = parseISO(expiryDate);

  // Trigger on reminder day (expiryDate - reminderDays) at 09:00 local time
  const reminderDay = subDays(expiry, reminderDays);
  const trigger = set(reminderDay, {
    hours: REMINDER_HOUR,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  if (trigger.getTime() > now.getTime()) {
    return trigger;
  }

  // Fallback: 09:00 on the actual expiry day if still in the future
  const expiryDay9am = set(expiry, {
    hours: REMINDER_HOUR,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  if (expiryDay9am.getTime() > now.getTime()) {
    return expiryDay9am;
  }

  return null;
}
