// __tests__/utils/date.test.ts

import {
  formatDateDisplay,
  formatDateLong,
  formatDateShort,
  getTodayIso,
  isDateInPast,
  parseDateDisplay,
} from '@/utils/date';

describe('date utilities', () => {
  const baseToday = new Date(2026, 9, 17, 10, 0, 0); // 17 Oct 2026

  describe('formatDateDisplay & parseDateDisplay round trips', () => {
    it('formats ISO YYYY-MM-DD to DD / MM / YYYY', () => {
      expect(formatDateDisplay('2026-10-17')).toBe('17 / 10 / 2026');
      expect(formatDateDisplay('2027-01-05')).toBe('05 / 01 / 2027');
    });

    it('parses DD / MM / YYYY back to ISO YYYY-MM-DD', () => {
      expect(parseDateDisplay('17 / 10 / 2026')).toBe('2026-10-17');
      expect(parseDateDisplay('05 / 01 / 2027')).toBe('2027-01-05');
    });

    it('returns null or empty for invalid date strings', () => {
      expect(formatDateDisplay('')).toBe('');
      expect(formatDateDisplay('invalid-date')).toBe('');
      expect(parseDateDisplay('')).toBeNull();
      expect(parseDateDisplay('not a date')).toBeNull();
      expect(parseDateDisplay('32 / 13 / 2026')).toBeNull();
    });
  });

  describe('formatDateLong', () => {
    it('formats ISO date to "12 Dec 2026" style', () => {
      expect(formatDateLong('2026-12-12')).toBe('12 Dec 2026');
      expect(formatDateLong('2026-10-17')).toBe('17 Oct 2026');
    });
  });

  describe('formatDateShort', () => {
    it('formats ISO date to "12 Dec" style', () => {
      expect(formatDateShort('2026-12-12')).toBe('12 Dec');
      expect(formatDateShort('2026-10-17')).toBe('17 Oct');
    });
  });

  describe('isDateInPast', () => {
    it('returns false for today', () => {
      expect(isDateInPast('2026-10-17', baseToday)).toBe(false);
    });

    it('returns false for future dates', () => {
      expect(isDateInPast('2026-10-18', baseToday)).toBe(false);
    });

    it('returns true for past dates', () => {
      expect(isDateInPast('2026-10-16', baseToday)).toBe(true);
      expect(isDateInPast('2025-12-31', baseToday)).toBe(true);
    });

    it('returns true for invalid or empty dates', () => {
      expect(isDateInPast('', baseToday)).toBe(true);
      expect(isDateInPast('garbage', baseToday)).toBe(true);
    });
  });

  describe('getTodayIso', () => {
    it('returns formatted YYYY-MM-DD string', () => {
      expect(getTodayIso(baseToday)).toBe('2026-10-17');
    });
  });
});
