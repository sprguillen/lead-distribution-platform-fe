const DATE_TIME = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const DATE = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const TIME = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' });

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  return DATE_TIME.format(new Date(value));
}

/** Split form, for dense table cells where one long line would not fit. */
export function formatDateParts(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return { date: DATE.format(date), time: TIME.format(date) };
}

const ORDER = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

/** "Every day", "Mon-Fri", or an explicit list for irregular schedules. */
export function formatWorkingDays(days: string[]) {
  const indexes = days
    .map((day) => ORDER.indexOf(day.toUpperCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);

  if (indexes.length === 0) {
    return 'None';
  }

  if (indexes.length === 7) {
    return 'Every day';
  }

  const short = (index: number) => ORDER[index].slice(0, 1) + ORDER[index].slice(1, 3).toLowerCase();

  const isRun = indexes.every(
    (value, position) => position === 0 || value === indexes[position - 1] + 1,
  );

  if (isRun && indexes.length > 2) {
    return `${short(indexes[0])}-${short(indexes[indexes.length - 1])}`;
  }

  return indexes.map(short).join(', ');
}
