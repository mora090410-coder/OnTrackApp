import { useState } from 'react';
import { useFollowUps, FollowUp } from '../../hooks/useFollowUps';
import { useSchools } from '../../hooks/useSchools';
import { useAuth } from '../../hooks/useAuth';
import { getGreeting, formatDate, formatRelativeDate } from '../../lib/utils';
import LogInteractionModal from '../interactions/LogInteractionModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { format } from 'date-fns';

export default function TodayView() {
    const { userName } = useAuth();
    const { followUps, overdueCount, dueTodayCount, loading, markComplete, snooze, refetch } = useFollowUps();
    const { schools } = useSchools();
    const [showLogModal, setShowLogModal] = useState(false);
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>();

    const today = format(new Date(), 'yyyy-MM-dd');
    const greeting = getGreeting();

    const overdueFollowUps = followUps.filter(f => f.due_date < today);
    const todayFollowUps = followUps.filter(f => f.due_date === today);
    const upcomingFollowUps = followUps.filter(f => f.due_date > today).slice(0, 5);

    const handleLogInteraction = (schoolId: string) => {
        setSelectedSchoolId(schoolId);
        setShowLogModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {greeting}, {userName}!
                </h1>
                <p className="text-gray-500">{formatDate(new Date())}</p>
            </div>

            {/* On-Track Indicator */}
            <OnTrackIndicator overdueCount={overdueCount} />

            {/* Overdue Follow-Ups */}
            {overdueFollowUps.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Overdue Follow-Ups
                    </h2>
                    <div className="space-y-3">
                        {overdueFollowUps.map(followUp => (
                            <FollowUpCard
                                key={followUp.id}
                                followUp={followUp}
                                isOverdue
                                onMarkComplete={() => markComplete(followUp.id)}
                                onSnooze={(days) => snooze(followUp.id, days)}
                                onLogInteraction={() => handleLogInteraction(followUp.school_id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Today's Follow-Ups */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Follow-Ups Due Today
                </h2>
                {todayFollowUps.length > 0 ? (
                    <div className="space-y-3">
                        {todayFollowUps.map(followUp => (
                            <FollowUpCard
                                key={followUp.id}
                                followUp={followUp}
                                onMarkComplete={() => markComplete(followUp.id)}
                                onSnooze={(days) => snooze(followUp.id, days)}
                                onLogInteraction={() => handleLogInteraction(followUp.school_id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <p className="text-green-800 font-medium">🎉 No follow-ups due today</p>
                        <p className="text-green-600 text-sm">Nice work staying on top of things!</p>
                    </div>
                )}
            </section>

            {/* Upcoming Follow-Ups */}
            {upcomingFollowUps.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        Coming Up This Week
                    </h2>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                        {upcomingFollowUps.map(followUp => (
                            <div key={followUp.id} className="px-4 py-3 flex items-center justify-between">
                                <span className="font-medium text-gray-900">{followUp.school?.name}</span>
                                <span className="text-sm text-gray-500">Due {formatDate(followUp.due_date)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Stats */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard label="Total Schools" value={schools.length} />
                    <StatCard
                        label="Active Conversations"
                        value={schools.filter(s => s.status === 'Active' || s.status === 'Engaged').length}
                    />
                    <StatCard label="Pending Follow-Ups" value={followUps.length} />
                </div>
            </section>

            {/* Log Interaction Modal */}
            {showLogModal && (
                <LogInteractionModal
                    onClose={() => {
                        setShowLogModal(false);
                        setSelectedSchoolId(undefined);
                    }}
                    preSelectedSchoolId={selectedSchoolId}
                    onSuccess={refetch}
                />
            )}
        </div>
    );
}

function OnTrackIndicator({ overdueCount }: { overdueCount: number }) {
    if (overdueCount === 0) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-green-800">You're on track</p>
                    <p className="text-sm text-green-600">No overdue follow-ups</p>
                </div>
            </div>
        );
    }

    if (overdueCount <= 3) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-yellow-800">{overdueCount} overdue follow-up{overdueCount > 1 ? 's' : ''}</p>
                    <p className="text-sm text-yellow-600">Take action today</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div>
                <p className="font-semibold text-red-800">{overdueCount} overdue follow-ups</p>
                <p className="text-sm text-red-600">You're falling behind</p>
            </div>
        </div>
    );
}

interface FollowUpCardProps {
    followUp: FollowUp;
    isOverdue?: boolean;
    onMarkComplete: () => void;
    onSnooze: (days: number) => void;
    onLogInteraction: () => void;
}

function FollowUpCard({ followUp, isOverdue, onMarkComplete, onSnooze, onLogInteraction }: FollowUpCardProps) {
    const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

    return (
        <div className={`bg-white rounded-lg border p-4 ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">{followUp.school?.name || 'Unknown School'}</h3>
                    {followUp.interaction && (
                        <p className="text-sm text-gray-500">
                            Follow up after {followUp.interaction.type} on {formatDate(followUp.interaction.date)}
                        </p>
                    )}
                </div>
                {isOverdue && (
                    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        Overdue
                    </span>
                )}
            </div>

            {followUp.interaction?.notes && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {followUp.interaction.notes}
                </p>
            )}

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onMarkComplete}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Mark Complete
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                        Snooze
                    </button>
                    {showSnoozeOptions && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                                onClick={() => { onSnooze(2); setShowSnoozeOptions(false); }}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                            >
                                2 days
                            </button>
                            <button
                                onClick={() => { onSnooze(7); setShowSnoozeOptions(false); }}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                            >
                                1 week
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={onLogInteraction}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Log New Interaction
                </button>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}
