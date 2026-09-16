import i18n from '@/lib/i18n';

/**
 * Formats a Unix timestamp to a human-readable date string
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 * 
 * @example
 * formatUnixTimestamp(1735555200) // "Dec 30, 2024"
 */
export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  
  // If it's today, show time
  if (isToday(date)) {
    return formatTime(date);
  }
  
  // If it's yesterday
  if (isYesterday(date)) {
    return i18n.t('time.yesterdayAt', { time: formatTime(date) });
  }
  
  // If it's within the last week, show day of week
  if (isWithinWeek(date)) {
    return `${getDayName(date)}, ${formatTime(date)}`;
  }
  
  // If it's this year, don't show year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(i18n.language, { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Otherwise show full date
  return date.toLocaleDateString(i18n.language, { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats an ISO timestamp string to a human-readable date
 * @param isoString - ISO timestamp string
 * @returns Formatted date string
 * 
 * @example
 * formatISOTimestamp("2025-01-04T10:13:29.000Z") // "Jan 4, 2025"
 */
export function formatISOTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return formatUnixTimestamp(Math.floor(date.getTime() / 1000));
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Gets the first line of text
 * @param text - Text to process
 * @returns First line of text
 */
export function getFirstLine(text: string): string {
  const lines = text.split('\n');
  return lines[0] || '';
}

// Helper functions
function formatTime(date: Date): string {
  return date.toLocaleTimeString(i18n.language, { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function isWithinWeek(date: Date): boolean {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date > weekAgo;
}

function getDayName(date: Date): string {
  return date.toLocaleDateString(i18n.language, { weekday: 'long' });
}

/**
 * Formats a timestamp to a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string
 * 
 * @example
 * formatTimeAgo(Date.now() - 3600000) // "1 hour ago"
 * formatTimeAgo(Date.now() - 86400000) // "1 day ago"
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) {
    return i18n.t('time.yearsAgo', { count: years });
  }
  if (months > 0) {
    return i18n.t('time.monthsAgo', { count: months });
  }
  if (weeks > 0) {
    return i18n.t('time.weeksAgo', { count: weeks });
  }
  if (days > 0) {
    return i18n.t('time.daysAgo', { count: days });
  }
  if (hours > 0) {
    return i18n.t('time.hoursAgo', { count: hours });
  }
  if (minutes > 0) {
    return i18n.t('time.minutesAgo', { count: minutes });
  }
  if (seconds > 0) {
    return i18n.t('time.secondsAgo', { count: seconds });
  }
  
  return i18n.t('time.justNow');
} 
