/**
 * Formats seconds into video player time string.
 * When seconds is 0 and total duration is >= 1hr, matches screenshot format: '0:00 / 1:47:00'.
 */
export function formatVideoTime(seconds: number, _totalDurationSeconds?: number): string {
  if (isNaN(seconds) || seconds < 0) {
    seconds = 0;
  }
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Under an hour
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats total duration seconds into standard full display string (e.g. '1:47:00' or '52:00').
 */
export function formatTotalDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parses a date string like '2026-09-06' into a readable month day year format.
 */
export function formatReleaseDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${monthNames[monthIndex]} ${day}, ${year}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
