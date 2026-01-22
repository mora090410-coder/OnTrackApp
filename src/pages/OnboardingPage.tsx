import { useNavigate } from 'react-router-dom';
import { useAthleteContext } from '../contexts/AthleteContext';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useEffect } from 'react';

/**
 * Onboarding page - renders the 3-step onboarding wizard
 * Redirects completed users to dashboard
 */
export default function OnboardingPage() {
    const { athlete, loading } = useAthleteContext();
    const navigate = useNavigate();

    // If athlete has completed onboarding, redirect to dashboard
    useEffect(() => {
        if (!loading && athlete?.onboarding_completed) {
            navigate('/dashboard', { replace: true });
        }
    }, [athlete, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // If already completed, don't render (redirect will happen)
    if (athlete?.onboarding_completed) {
        return null;
    }

    return <OnboardingFlow />;
}
