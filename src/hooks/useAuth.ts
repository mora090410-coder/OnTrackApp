import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

/**
 * Custom hook wrapping Clerk auth with additional helpers
 */
export function useAuth() {
    const { isLoaded, isSignedIn, signOut } = useClerkAuth();
    const { user } = useUser();

    return {
        isLoaded,
        isSignedIn,
        user,
        userId: user?.id ?? null,
        userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
        userFirstName: user?.firstName ?? null,
        userName: user?.fullName ?? user?.firstName ?? 'User',
        signOut,
    };
}
