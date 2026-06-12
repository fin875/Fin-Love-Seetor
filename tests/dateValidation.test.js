const {
  TARGET_DATE,
  validateDate,
  parseDateString,
  formatDate,
} = require('../src/dateValidation');

describe('Date Validation Module', () => {
  describe('TARGET_DATE', () => {
    it('is defined as a DD/MM/YYYY string', () => {
      expect(TARGET_DATE).toBe('07/05/2025');
    });
  });

  describe('validateDate', () => {
    it('returns valid for the correct date', () => {
      expect(validateDate('07/05/2025')).toEqual({ valid: true });
    });

    it('returns invalid with error for wrong date', () => {
      const result = validateDate('01/01/2020');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Incorrect date');
    });

    it('returns invalid with error for empty string', () => {
      const result = validateDate('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date is required');
    });

    it('returns invalid with error for whitespace-only input', () => {
      const result = validateDate('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date is required');
    });

    it('returns invalid with error for null/undefined', () => {
      expect(validateDate(null).valid).toBe(false);
      expect(validateDate(undefined).valid).toBe(false);
    });

    it('returns invalid for date with wrong format', () => {
      expect(validateDate('7/5/2025').valid).toBe(false);
      expect(validateDate('2025-05-07').valid).toBe(false);
      expect(validateDate('05/07/2025').valid).toBe(false);
    });

    it('is case-sensitive exact match', () => {
      expect(validateDate('07/05/2025 ').valid).toBe(false);
      expect(validateDate(' 07/05/2025').valid).toBe(false);
    });
  });

  describe('parseDateString', () => {
    it('parses valid DD/MM/YYYY string', () => {
      expect(parseDateString('07/05/2025')).toEqual({
        day: 7,
        month: 5,
        year: 2025,
      });
    });

    it('parses date with double-digit day/month', () => {
      expect(parseDateString('25/12/2023')).toEqual({
        day: 25,
        month: 12,
        year: 2023,
      });
    });

    it('returns null for wrong number of parts', () => {
      expect(parseDateString('07-05-2025')).toBeNull();
      expect(parseDateString('07/05')).toBeNull();
      expect(parseDateString('2025')).toBeNull();
    });

    it('returns null for non-numeric parts', () => {
      expect(parseDateString('ab/05/2025')).toBeNull();
      expect(parseDateString('07/cd/2025')).toBeNull();
      expect(parseDateString('07/05/abcd')).toBeNull();
    });

    it('returns null for out-of-range day', () => {
      expect(parseDateString('00/05/2025')).toBeNull();
      expect(parseDateString('32/05/2025')).toBeNull();
    });

    it('returns null for out-of-range month', () => {
      expect(parseDateString('07/00/2025')).toBeNull();
      expect(parseDateString('07/13/2025')).toBeNull();
    });

    it('returns null for out-of-range year', () => {
      expect(parseDateString('07/05/1899')).toBeNull();
      expect(parseDateString('07/05/2101')).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('formats date with zero-padded day and month', () => {
      expect(formatDate({ day: 7, month: 5, year: 2025 })).toBe('07/05/2025');
    });

    it('handles double-digit day/month', () => {
      expect(formatDate({ day: 25, month: 12, year: 2023 })).toBe(
        '25/12/2023'
      );
    });

    it('handles day 1 and month 1', () => {
      expect(formatDate({ day: 1, month: 1, year: 2000 })).toBe('01/01/2000');
    });

    it('roundtrips with parseDateString', () => {
      const original = '07/05/2025';
      const parsed = parseDateString(original);
      expect(formatDate(parsed)).toBe(original);
    });
  });
});
