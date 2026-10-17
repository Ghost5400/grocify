// src/domain/status.ts
// Expiry calculations and status determinations per TRD section 7.1.

import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';
import { Item, ItemStatus } from './types';

/**
 * Calculates calendar days remaining until expiry from today (local start of day).
 * Positive number = days until expiry.
 * 0 = expires today.
 * Negative number = days overdue (expired).
 */
export function daysLeft(expiryDate: string, today: Date = new Date()): number {
  const parsedExpiry = parseISO(expiryDate);
  const localToday = startOfDay(today);
  return differenceInCalendarDays(parsedExpiry, localToday);
}

/**
 * Derives the ItemStatus based on expiryDate, reminderDays, and reference date.
 */
export function getStatus(
  item: Pick<Item, 'expiryDate' | 'reminderDays'>,
  today: Date = new Date()
): ItemStatus {
  const d = daysLeft(item.expiryDate, today);
  if (d < 0) {
    return 'expired';
  }
  if (d <= item.reminderDays) {
    return 'expiringSoon'; // includes d === 0 (expires today)
  }
  return 'fresh';
}

/**
 * Returns the human-readable expiry label according to UIUX section 10 and TRD section 7.1.
 */
export function getStatusLabel(expiryDate: string, today: Date = new Date()): string {
  const d = daysLeft(expiryDate, today);
  if (d < 0) {
    const daysAgo = Math.abs(d);
    return daysAgo === 1 ? 'Expired 1 day ago' : `Expired ${daysAgo} days ago`;
  }
  if (d === 0) {
    return 'Expires today';
  }
  if (d === 1) {
    return 'Expires tomorrow';
  }
  return `Expires in ${d} days`;
}
