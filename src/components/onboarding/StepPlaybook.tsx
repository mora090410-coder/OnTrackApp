import { OnboardingData } from './OnboardingFlow';
import LoadingSpinner from '../common/LoadingSpinner';

interface StepPlaybookProps {
    data: OnboardingData;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function StepPlaybook({ data, onBack, onSubmit, isSubmitting }: StepPlaybookProps) {
    const currentYear = new Date().getFullYear();
    const yearsUntilGrad = data.gradYear - currentYear;

    const getPlaybookContent = () => {
        if (yearsUntilGrad <= 0) {
            // Senior
            return {
                title: 'Your Focus: Finish strong and commit',
                content: (
                    <>
                        <p className="mb-4">You're in the final stretch. Here's what matters now:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li>Finish your season strong and stay healthy</li>
                            <li>Compare financial aid packages and campus fit</li>
                            <li>Keep grades solid through graduation (no eligibility issues)</li>
                            <li>If uncommitted: Many D2/D3/NAIA/JUCO opportunities are still available through spring</li>
                        </ul>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-900">OnTrack will help you:</p>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• Track your remaining conversations and visits</li>
                                <li>• Compare offers side-by-side</li>
                                <li>• Manage commitment deadlines</li>
                            </ul>
                        </div>
                    </>
                ),
            };
        } else if (yearsUntilGrad === 1) {
            // Junior
            return {
                title: 'Your Focus: Critical window - coaches are deciding NOW',
                content: (
                    <>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                            <p className="font-medium text-amber-800">
                                ⚠️ IMPORTANT: Verbal offers start happening September 1st of junior year.
                            </p>
                        </div>
                        <p className="mb-4">If you're just getting organized now, you need to move fast:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li>Tighten your list to 10-20 serious targets</li>
                            <li>Active conversations with coaches (not just emails)</li>
                            <li>Push for campus visits</li>
                            <li>Respond to coaches within 24-48 hours</li>
                            <li>Play like a college athlete right now</li>
                        </ul>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-900">OnTrack will help you:</p>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• Track every conversation and keep momentum</li>
                                <li>• Never miss critical follow-up windows</li>
                                <li>• Stay on top of all your recruiting relationships</li>
                            </ul>
                        </div>
                    </>
                ),
            };
        } else if (yearsUntilGrad === 2) {
            // Sophomore
            return {
                title: 'Your Focus: Get serious and organized',
                content: (
                    <>
                        <p className="mb-4">This is the year coaches start really watching:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li>Raise your competition level (better teams, better tournaments)</li>
                            <li>Get organized: highlight video, profile, target school list</li>
                            <li>Narrow your list from 40 schools down to 20-30</li>
                            <li>Increase contact frequency with target schools</li>
                            <li>Stay on track academically (core classes + strong grades)</li>
                        </ul>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-900">OnTrack will help you:</p>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• Build and manage your target list</li>
                                <li>• Track all your outreach and responses</li>
                                <li>• Know exactly when to follow up</li>
                            </ul>
                        </div>
                    </>
                ),
            };
        } else {
            // Freshman or younger
            return {
                title: 'Your Focus: Build the foundation',
                content: (
                    <>
                        <p className="mb-4">You're starting at the perfect time. Here's what to focus on:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li>Make real development gains (skill, speed, strength, mental toughness)</li>
                            <li>Lock in strong academics NOW (GPA starts in 9th grade)</li>
                            <li>Build a target list of 30-50 schools</li>
                            <li>Attend camps and start conversations with coaches</li>
                            <li>Learn the recruiting process early</li>
                        </ul>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-900">OnTrack will help you:</p>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• Stay organized as you build relationships</li>
                                <li>• Track every camp, email, and interaction</li>
                                <li>• Build momentum year over year</li>
                            </ul>
                        </div>
                    </>
                ),
            };
        }
    };

    const playbook = getPlaybookContent();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your recruiting playbook
            </h1>
            <p className="text-gray-600 mb-6">
                Based on {data.name}'s class of {data.gradYear}
            </p>

            <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {playbook.title}
                </h2>
                <div className="text-gray-600">
                    {playbook.content}
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span>Setting up...</span>
                        </>
                    ) : (
                        'Get Started with OnTrack'
                    )}
                </button>
            </div>
        </div>
    );
}
