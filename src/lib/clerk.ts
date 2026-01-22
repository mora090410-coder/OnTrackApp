// Clerk is configured via ClerkProvider in main.tsx
// This file exports the publishable key for reference

export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}
