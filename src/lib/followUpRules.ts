import { addDays } from 'date-fns';

/**
 * Follow-up rules: number of days to wait before following up based on interaction type
 * null means no automatic follow-up is created
 */
export const FOLLOW_UP_RULES: Record<string, number | null> = {
    'Email Sent': 7,
    'Camp Attended': 2,
    'Phone Call': 5,
    'Campus Visit': 3,
    'Coach Conversation': 5,
    'Note/Update': null, // No auto-follow-up
};

/**
 * Calculate the follow-up due date based on interaction type and date
 * @param interactionType The type of interaction
 * @param interactionDate The date of the interaction
 * @returns The due date for the follow-up, or null if no follow-up is needed
 */
export function calculateFollowUpDate(
    interactionType: string,
    interactionDate: Date | string
): Date | null {
    const daysToAdd = FOLLOW_UP_RULES[interactionType];

    if (daysToAdd === null || daysToAdd === undefined) {
        return null; // No follow-up needed
    }

    return addDays(new Date(interactionDate), daysToAdd);
}

/**
 * Get the follow-up message based on interaction type
 */
export function getFollowUpMessage(interactionType: string): string {
    switch (interactionType) {
        case 'Email Sent':
            return 'Follow up on email if no response';
        case 'Camp Attended':
            return 'Send thank-you email to coaches';
        case 'Phone Call':
            return 'Follow up on phone conversation';
        case 'Campus Visit':
            return 'Send thank-you and discuss next steps';
        case 'Coach Conversation':
            return 'Follow up on conversation';
        default:
            return 'Follow up';
    }
}
