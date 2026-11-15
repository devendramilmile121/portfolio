import { formatDayMonth, formatMonthYear, formatPeriod, formatPuneTime, formatYears, readingMinutes } from './format';

describe('formatYears', () => {
  it.each([
    ['Sep 2026 - Present', '2026–'],
    ['Dec 2024 - Dec 2025', '2024–25'],
    ['Jan 2022 - Oct 2024', '2022–24'],
    ['Mar 2023 - Nov 2023', '2023'],
    ['Jun 1998 - Jun 2001', '1998–2001'],
    ['Ongoing', 'Ongoing'],
  ])('%s -> %s', (input, expected) => {
    expect(formatYears(input)).toBe(expected);
  });
});

describe('formatPeriod', () => {
  it('uses an en dash and "Now"', () => {
    expect(formatPeriod('Jan 2026 - Present')).toBe('Jan 2026 – Now');
    expect(formatPeriod('Nov 2024 - Dec 2025')).toBe('Nov 2024 – Dec 2025');
  });
});

describe('dates', () => {
  it('formats post dates', () => {
    expect(formatMonthYear('2026-03-15')).toBe('Mar 2026');
    expect(formatDayMonth('2026-03-15')).toBe('15 Mar');
  });

  it('returns unparseable dates unchanged', () => {
    expect(formatMonthYear('soon')).toBe('soon');
    expect(formatDayMonth('soon')).toBe('soon');
  });

  it('shows the time in Pune', () => {
    expect(formatPuneTime(new Date('2026-01-01T00:00:00Z'))).toBe('05:30');
  });
});

describe('readingMinutes', () => {
  it('rounds up at 220 words a minute, minimum one', () => {
    expect(readingMinutes('word '.repeat(221))).toBe(2);
    expect(readingMinutes('short')).toBe(1);
  });
});
