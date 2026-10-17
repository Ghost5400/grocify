// __tests__/domain/status.test.ts

import { daysLeft, getStatus, getStatusLabel } from '@/domain/status';
import { Item } from '@/domain/types';

describe('status domain logic', () => {
  const baseToday = new Date(2026, 9, 17, 10, 0, 0); // 17 Oct 2026 10:00 AM

  describe('daysLeft', () => {
    it('returns 0 when expiry date is today', () => {
      expect(daysLeft('2026-10-17', baseToday)).toBe(0);
    });

    it('returns positive days for future expiry dates', () => {
      expect(daysLeft('2026-10-18', baseToday)).toBe(1);
      expect(daysLeft('2026-10-22', baseToday)).toBe(5);
    });

    it('returns negative days for past expiry dates', () => {
      expect(daysLeft('2026-10-16', baseToday)).toBe(-1);
      expect(daysLeft('2026-10-12', baseToday)).toBe(-5);
    });

    it('accurately calculates calendar days across daylight saving transitions', () => {
      // E.g. late March UK/EU transition where a 23-hour day occurs
      const marchDay = new Date(2026, 2, 28, 12, 0, 0); // 28 Mar 2026
      expect(daysLeft('2026-03-30', marchDay)).toBe(2);
    });
  });

  describe('getStatus', () => {
    const makeItem = (expiryDate: string, reminderDays: number = 2): Item => ({
      id: 'test-item-1',
      catalogId: 'tomato',
      name: 'Tomato',
      compartment: 'veggies',
      imageKey: 'tomato',
      quantity: 1,
      expiryDate,
      reminderDays,
      notificationId: null,
      addedAt: '2026-10-17T00:00:00Z',
    });

    it('returns "expired" when daysLeft < 0', () => {
      const item = makeItem('2026-10-16', 2);
      expect(getStatus(item, baseToday)).toBe('expired');
    });

    it('returns "expiringSoon" when daysLeft === 0 (expires today)', () => {
      const item = makeItem('2026-10-17', 2);
      expect(getStatus(item, baseToday)).toBe('expiringSoon');
    });

    it('returns "expiringSoon" when daysLeft is within reminder window', () => {
      const item1 = makeItem('2026-10-18', 2); // 1 day left
      const item2 = makeItem('2026-10-19', 2); // 2 days left
      expect(getStatus(item1, baseToday)).toBe('expiringSoon');
      expect(getStatus(item2, baseToday)).toBe('expiringSoon');
    });

    it('returns "fresh" when daysLeft > reminderDays', () => {
      const item = makeItem('2026-10-20', 2); // 3 days left > 2
      expect(getStatus(item, baseToday)).toBe('fresh');
    });
  });

  describe('getStatusLabel', () => {
    it('returns "Expired 1 day ago" for yesterday', () => {
      expect(getStatusLabel('2026-10-16', baseToday)).toBe('Expired 1 day ago');
    });

    it('returns "Expired N days ago" for older dates', () => {
      expect(getStatusLabel('2026-10-14', baseToday)).toBe('Expired 3 days ago');
    });

    it('returns "Expires today" for today', () => {
      expect(getStatusLabel('2026-10-17', baseToday)).toBe('Expires today');
    });

    it('returns "Expires tomorrow" for tomorrow', () => {
      expect(getStatusLabel('2026-10-18', baseToday)).toBe('Expires tomorrow');
    });

    it('returns "Expires in N days" for subsequent days', () => {
      expect(getStatusLabel('2026-10-21', baseToday)).toBe('Expires in 4 days');
    });
  });
});
