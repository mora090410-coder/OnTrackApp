import { format, formatDistanceToNow, addDays, isToday, isPast, isFuture } from 'date-fns';

/**
 * Format a date as "Jan 15, 2026"
 */
export function formatDate(date: Date | string): string {
    return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Format a date as "3 days ago" or "in 2 days"
 */
export function formatRelativeDate(date: Date | string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

/**
 * Check if a date is today
 */
export function checkIsToday(date: Date | string): boolean {
    return isToday(new Date(date));
}

/**
 * Check if a date is in the past
 */
export function checkIsPast(date: Date | string): boolean {
    return isPast(new Date(date));
}

/**
 * Check if a date is in the future
 */
export function checkIsFuture(date: Date | string): boolean {
    return isFuture(new Date(date));
}

/**
 * Add days to a date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
    return addDays(new Date(date), days);
}

/**
 * Get default target school count based on graduation year
 */
export function getDefaultTargetCount(gradYear: number): number {
    const currentYear = new Date().getFullYear();
    const yearsUntilGrad = gradYear - currentYear;

    if (yearsUntilGrad <= 0) return 10; // Senior or past
    if (yearsUntilGrad === 1) return 20; // Junior
    if (yearsUntilGrad === 2) return 30; // Sophomore
    return 40; // Freshman or younger
}

/**
 * US States list for dropdowns
 */
export const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming', 'Other'
];

/**
 * Sports list for autocomplete
 */
export const SPORTS = [
    'Baseball', 'Softball', 'Soccer', 'Lacrosse', 'Basketball',
    'Volleyball', 'Football', 'Track & Field', 'Swimming', 'Tennis',
    'Golf', 'Wrestling', 'Hockey', 'Cross Country', 'Gymnastics',
    'Field Hockey', 'Water Polo', 'Rowing', 'Fencing', 'Diving'
];

/**
 * Division options
 */
export const DIVISIONS = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];

/**
 * Priority options
 */
export const PRIORITIES = ['High', 'Medium', 'Low'];

/**
 * School status options
 */
export const SCHOOL_STATUSES = ['Researching', 'Contacted', 'Engaged', 'Active', 'Closed'];

/**
 * Interaction type options
 */
export const INTERACTION_TYPES = [
    'Email Sent',
    'Camp Attended',
    'Phone Call',
    'Campus Visit',
    'Coach Conversation',
    'Note/Update'
];

/**
 * Coach role options
 */
export const COACH_ROLES = ['Head Coach', 'Assistant Coach', 'Recruiting Coordinator', 'Other'];

/**
 * Region options
 */
export const REGIONS = ['Midwest', 'Northeast', 'Southeast', 'Southwest', 'West Coast', 'National'];

/**
 * Graduation year options (next 7 years)
 */
export function getGradYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear + i);
}
