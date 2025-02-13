function dateToDayDate(val?: Date | number | string) {
  if (!val) {
    return '';
  }
  const date = new Date(val);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatDate(val?: Date | number | string | null): string {
  if (!val) {
    return '';
  }
  const date = new Date(val);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Checks if a given date is today
 * @param val Date value as Date object, timestamp number, date string, or null
 * @returns boolean indicating if the date is today
 */
function isToday(val?: Date | number | string | null): boolean {
  if (!val) {
    return false;
  }
  const inputDate = new Date(val);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate.getTime() === today.getTime();
}

/**
 * Checks if a given date is tomorrow
 * @param val Date value as Date object, timestamp number, date string, or null
 * @returns boolean indicating if the date is tomorrow
 */
function isTomorrow(val?: Date | number | string | null): boolean {
  if (!val) {
    return false;
  }
  const inputDate = new Date(val);
  const tomorrow = new Date();

  inputDate.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return inputDate.getTime() === tomorrow.getTime();
}

/**
 * Checks if a given date is yesterday
 * @param val Date value as Date object, timestamp number, date string, or null
 * @returns boolean indicating if the date is yesterday
 */
function isYesterday(val?: Date | number | string | null): boolean {
  if (!val) {
    return false;
  }
  const inputDate = new Date(val);
  const yesterday = new Date();

  inputDate.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  return inputDate.getTime() === yesterday.getTime();
}

// Example usage:
// console.log(isToday('2025-02-13'));        // true
// console.log(isTomorrow(1708041600000));    // false
// console.log(isYesterday(new Date()));      // false
// console.log(isToday(null));                // false

/**
 * Calculates the number of days between today and the target date
 * Positive number means the date is in the future
 * Negative number means the date is in the past
 *
 * @param val Date value as Date object, timestamp number, date string, or null
 * @returns number of days difference, or 0 if invalid input
 */
function getDaysToDate(val?: Date | number | string | null): number {
  if (!val) {
    return 0;
  }

  const inputDate = new Date(val);
  const today = new Date();

  // Reset hours to midnight for accurate day calculation
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Calculate difference in milliseconds
  const diffInMs = inputDate.getTime() - today.getTime();

  // Convert to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

// Example usage:
// console.log(getDaysToDate('2025-03-15'));     // returns days until March 15, 2025
// console.log(getDaysToDate('2024-02-12'));     // returns negative number for past date
// console.log(getDaysToDate(new Date()));       // returns 0 for today
// console.log(getDaysToDate(null));             // returns 0

export { dateToDayDate, formatDate, isTomorrow, isToday, isYesterday, getDaysToDate };
