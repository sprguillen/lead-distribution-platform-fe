const FALLBACK = [
  'Asia/Manila',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'UTC',
];

/**
 * Resolved on the server and passed to the form as a prop, so the option list
 * cannot differ between the server render and the browser.
 */
export function supportedTimezones() {
  const supported = Intl.supportedValuesOf?.('timeZone');

  return supported && supported.length > 0 ? [...supported] : FALLBACK;
}
