/**
 * Date validation logic for the login screen.
 */

const TARGET_DATE = '07/05/2025';

/**
 * Validate a date input against the target date.
 * @param {string} input - The date string entered by the user
 * @returns {{ valid: boolean, error?: string }}
 */
function validateDate(input) {
  if (!input || input.trim() === '') {
    return { valid: false, error: 'Date is required' };
  }
  if (input === TARGET_DATE) {
    return { valid: true };
  }
  return { valid: false, error: 'Incorrect date' };
}

/**
 * Parse a date string in DD/MM/YYYY format.
 * @param {string} dateStr
 * @returns {{ day: number, month: number, year: number } | null}
 */
function parseDateString(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;

  return { day, month, year };
}

/**
 * Format a date object to DD/MM/YYYY string.
 * @param {{ day: number, month: number, year: number }} date
 * @returns {string}
 */
function formatDate(date) {
  const dd = String(date.day).padStart(2, '0');
  const mm = String(date.month).padStart(2, '0');
  return `${dd}/${mm}/${date.year}`;
}

module.exports = {
  TARGET_DATE,
  validateDate,
  parseDateString,
  formatDate,
};
