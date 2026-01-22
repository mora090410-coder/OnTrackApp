import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAthleteContext } from '../../contexts/AthleteContext';
import StepAthleteInfo from './StepAthleteInfo';
import StepTargetStrategy from './StepTargetStrategy';
import StepPlaybook from './StepPlaybook';
import LoadingSpinner from '../common/LoadingSpinner';

export interface OnboardingData {
    // Step 1: Athlete Info
    name: string;
    gradYear: number;
    sport: string;

    // Step 2: Target Strategy
    levels: string[];
    regions: string[];
    inStateOnly: boolean;
    targetCount: number;
}

const initialData: OnboardingData = {
    name: '',
    gradYear: new Date().getFullYear() + 2,
    sport: '',
    levels: [],
    regions: [],
    inStateOnly: false,
    targetCount: 30,
};

export default function OnboardingFlow() {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { createAthlete } = useAthleteContext();
    const navigate = useNavigate();

    const updateData = (updates: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const athlete = await createAthlete({
                name: data.name,
                grad_year: data.gradYear,
                sport: data.sport,
                onboarding_completed: true,
                targetStrategy: {
                    levels: data.levels,
                    regions: data.inStateOnly ? [] : data.regions,
                    in_state_only: data.inStateOnly,
                    target_count: data.targetCount,
                },
            });

            if (athlete) {
                navigate('/dashboard', { replace: true });
            } else {
                setError('Failed to create athlete profile. Please try again.');
            }
        } catch (err) {
            console.error('Onboarding error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">OnTrack</span>
                    <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
                </div>
            </header>

            {/* Progress bar */}
            <div className="max-w-2xl mx-auto px-4 pt-6">
                <div className="flex gap-2">
                    {[1, 2, 3].map(step => (
                        <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {currentStep === 1 && (
                    <StepAthleteInfo
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                    />
                )}

                {currentStep === 2 && (
                    <StepTargetStrategy
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {currentStep === 3 && (
                    <StepPlaybook
                        data={data}
                        onBack={prevStep}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </main>
        </div>
    );
}
