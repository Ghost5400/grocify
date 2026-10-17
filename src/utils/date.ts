// src/utils/date.ts
// Date formatting, parsing, and validation utilities.

import { format, isValid, parse, parseISO, startOfDay } from 'date-fns';

export const DISPLAY_DATE_FORMAT = 'dd / MM / yyyy';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Formats a YYYY-MM-DD ISO string to DD / MM / YYYY display format.
 */
export function formatDateDisplay(isoDateString: string): string {
  if (!isoDateString) return '';
  const parsed = parseISO(isoDateString);
  if (!isValid(parsed)) return '';
  return format(parsed, DISPLAY_DATE_FORMAT);
}

/**
 * Parses a DD / MM / YYYY string to YYYY-MM-DD ISO date string.
 * Returns null if the input is invalid.
 */
export function parseDateDisplay(displayString: string): string | null {
  if (!displayString) return null;
  const cleaned = displayString.trim();
  const parsed = parse(cleaned, DISPLAY_DATE_FORMAT, new Date());
  if (!isValid(parsed)) return null;
  return format(parsed, ISO_DATE_FORMAT);
}

/**
 * Formats a YYYY-MM-DD ISO string to a human-readable "12 Dec 2026" format.
 */
export function formatDateLong(isoDateString: string): string {
  if (!isoDateString) return '';
  const parsed = parseISO(isoDateString);
  if (!isValid(parsed)) return '';
  return format(parsed, 'd MMM yyyy');
}

/**
 * Formats a YYYY-MM-DD ISO string to a short "12 Dec" format for item subtitles.
 */
export function formatDateShort(isoDateString: string): string {
  if (!isoDateString) return '';
  const parsed = parseISO(isoDateString);
  if (!isValid(parsed)) return '';
  return format(parsed, 'd MMM');
}

/**
 * Checks if a YYYY-MM-DD date is strictly in the past (before start of today).
 */
export function isDateInPast(isoDateString: string, today: Date = new Date()): boolean {
  if (!isoDateString) return true;
  const parsed = parseISO(isoDateString);
  if (!isValid(parsed)) return true;
  const localToday = startOfDay(today);
  return startOfDay(parsed).getTime() < localToday.getTime();
}

/**
 * Returns today's calendar date in YYYY-MM-DD format.
 */
export function getTodayIso(today: Date = new Date()): string {
  return format(today, ISO_DATE_FORMAT);
}
