import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAthleteContext } from '../../contexts/AthleteContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireOnboarding?: boolean;
}

/**
 * Protected route wrapper that handles:
 * 1. Unauthenticated users → redirect to sign-in
 * 2. New users (no athlete) → redirect to onboarding
 * 3. Users who haven't completed onboarding → redirect to onboarding
 * 4. Completed users → render children
 */
export default function ProtectedRoute({
    children,
    requireOnboarding = true
}: ProtectedRouteProps) {
    const { isLoaded, isSignedIn } = useAuth();
    const { athlete, loading } = useAthleteContext();
    const location = useLocation();

    // Still loading auth state
    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Not signed in → redirect to sign-in
    if (!isSignedIn) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    // Signed in but no athlete or onboarding not completed → redirect to onboarding
    if (requireOnboarding && (!athlete || !athlete.onboarding_completed)) {
        // Don't redirect if already on onboarding page
        if (location.pathname !== '/onboarding') {
            return <Navigate to="/onboarding" replace />;
        }
    }

    return <>{children}</>;
}
