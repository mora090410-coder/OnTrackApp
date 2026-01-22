import { useInteractions, Interaction } from '../../hooks/useInteractions';
import { formatDate, formatRelativeDate } from '../../lib/utils';
import LoadingSpinner from '../common/LoadingSpinner';

export default function InteractionTimeline() {
    const { interactions, loading, error } = useInteractions();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Activity Timeline</h1>
                <p className="text-gray-500">All your recruiting interactions in one place</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            )}

            {interactions.length > 0 ? (
                <div className="space-y-4">
                    {interactions.map(interaction => (
                        <InteractionCard key={interaction.id} interaction={interaction} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No interactions yet</h3>
                    <p className="text-gray-600">
                        Log your first interaction to start building your recruiting timeline.
                    </p>
                </div>
            )}
        </div>
    );
}

function InteractionCard({ interaction }: { interaction: Interaction }) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'Email Sent':
                return 'bg-blue-100 text-blue-700';
            case 'Camp Attended':
                return 'bg-green-100 text-green-700';
            case 'Phone Call':
                return 'bg-purple-100 text-purple-700';
            case 'Campus Visit':
                return 'bg-amber-100 text-amber-700';
            case 'Coach Conversation':
                return 'bg-teal-100 text-teal-700';
            case 'Note/Update':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const truncatedNotes = interaction.notes.length > 150
        ? interaction.notes.slice(0, 150) + '...'
        : interaction.notes;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                    <p className="font-medium text-gray-900">{formatDate(interaction.date)}</p>
                    <p className="text-sm text-gray-500">{formatRelativeDate(interaction.date)}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeStyles(interaction.type)}`}>
                    {interaction.type}
                </span>
            </div>

            <p className="font-semibold text-gray-900 mb-1">
                {interaction.school?.name || 'Unknown School'}
            </p>

            {interaction.coach && (
                <p className="text-sm text-gray-500 mb-2">
                    With: {interaction.coach.name}
                </p>
            )}

            <p className="text-gray-600 text-sm whitespace-pre-wrap">{truncatedNotes}</p>
        </div>
    );
}
