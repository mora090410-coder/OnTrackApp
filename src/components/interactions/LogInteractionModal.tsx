import { useState, useEffect } from 'react';
import { useInteractions } from '../../hooks/useInteractions';
import { useSchools, School, Coach } from '../../hooks/useSchools';
import { INTERACTION_TYPES } from '../../lib/utils';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../common/LoadingSpinner';

interface LogInteractionModalProps {
    onClose: () => void;
    preSelectedSchoolId?: string;
    onSuccess?: () => void;
}

export default function LogInteractionModal({
    onClose,
    preSelectedSchoolId,
    onSuccess
}: LogInteractionModalProps) {
    const { createInteraction } = useInteractions();
    const { schools, getCoaches } = useSchools();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loadingCoaches, setLoadingCoaches] = useState(false);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: '',
        school_id: preSelectedSchoolId || '',
        coach_id: '',
        notes: '',
    });

    // Fetch coaches when school changes
    useEffect(() => {
        async function fetchCoaches() {
            if (formData.school_id) {
                setLoadingCoaches(true);
                const coachList = await getCoaches(formData.school_id);
                setCoaches(coachList);
                setLoadingCoaches(false);
                // Reset coach selection when school changes
                setFormData(prev => ({ ...prev, coach_id: '' }));
            } else {
                setCoaches([]);
            }
        }
        fetchCoaches();
    }, [formData.school_id, getCoaches]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.type) {
            setError('Please select an interaction type');
            return;
        }
        if (!formData.school_id) {
            setError('Please select a school');
            return;
        }
        if (!formData.notes.trim() || formData.notes.trim().length < 10) {
            setError('Please add notes (at least 10 characters)');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const { interaction, followUpDate } = await createInteraction({
            school_id: formData.school_id,
            coach_id: formData.coach_id || undefined,
            type: formData.type,
            date: formData.date,
            notes: formData.notes.trim(),
        });

        setIsSubmitting(false);

        if (interaction) {
            let message = '✓ Interaction logged successfully!';
            if (followUpDate) {
                message += ` Follow-up reminder set for ${formatDate(followUpDate)}.`;
            }
            setSuccessMessage(message);

            // Auto-close after showing success
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);
        } else {
            setError('Failed to log interaction. Please try again.');
        }
    };

    const selectedSchool = schools.find(s => s.id === formData.school_id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {successMessage ? (
                    <div className="p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-gray-900 font-medium">{successMessage}</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Interaction</h2>

                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Date */}
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="">Select type</option>
                                        {INTERACTION_TYPES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* School */}
                                <div>
                                    <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                                        School <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="school"
                                        value={formData.school_id}
                                        onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                                        disabled={!!preSelectedSchoolId}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100"
                                    >
                                        <option value="">Select school</option>
                                        {schools.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {schools.length === 0 && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            No schools added yet. Add a school first.
                                        </p>
                                    )}
                                </div>

                                {/* Coach */}
                                <div>
                                    <label htmlFor="coach" className="block text-sm font-medium text-gray-700 mb-1">
                                        Coach
                                    </label>
                                    {loadingCoaches ? (
                                        <div className="py-2">
                                            <LoadingSpinner size="sm" />
                                        </div>
                                    ) : (
                                        <select
                                            id="coach"
                                            value={formData.coach_id}
                                            onChange={(e) => setFormData({ ...formData, coach_id: e.target.value })}
                                            disabled={!formData.school_id || coaches.length === 0}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100"
                                        >
                                            <option value="">None / General</option>
                                            {coaches.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}{c.role ? ` (${c.role})` : ''}</option>
                                            ))}
                                        </select>
                                    )}
                                    {formData.school_id && coaches.length === 0 && !loadingCoaches && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            No coaches added for this school yet.
                                        </p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                        What happened? <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Describe what happened during this interaction..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Minimum 10 characters
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                {isSubmitting && <LoadingSpinner size="sm" />}
                                Log Interaction
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
