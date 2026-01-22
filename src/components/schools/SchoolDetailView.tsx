import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSchools, School, Coach } from '../../hooks/useSchools';
import AddCoachModal from './AddCoachModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { DIVISIONS, PRIORITIES, SCHOOL_STATUSES, US_STATES } from '../../lib/utils';

export default function SchoolDetailView() {
    const { schoolId } = useParams<{ schoolId: string }>();
    const navigate = useNavigate();
    const { schools, loading, updateSchool, deleteSchool, getCoaches } = useSchools();

    const [school, setSchool] = useState<School | null>(null);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loadingCoaches, setLoadingCoaches] = useState(true);
    const [showAddCoachModal, setShowAddCoachModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<School>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Find school from existing data
    useEffect(() => {
        if (!loading && schoolId) {
            const foundSchool = schools.find(s => s.id === schoolId);
            if (foundSchool) {
                setSchool(foundSchool);
                setEditData(foundSchool);
            } else if (schools.length > 0) {
                // School not found, redirect
                navigate('/dashboard/schools', { replace: true });
            }
        }
    }, [schools, schoolId, loading, navigate]);

    // Fetch coaches
    useEffect(() => {
        async function fetchCoaches() {
            if (schoolId) {
                setLoadingCoaches(true);
                const coachList = await getCoaches(schoolId);
                setCoaches(coachList);
                setLoadingCoaches(false);
            }
        }
        fetchCoaches();
    }, [schoolId, getCoaches]);

    const handleSaveEdit = async () => {
        if (school && editData) {
            const success = await updateSchool(school.id, editData);
            if (success) {
                setSchool({ ...school, ...editData });
                setIsEditing(false);
            }
        }
    };

    const handleDelete = async () => {
        if (school) {
            const success = await deleteSchool(school.id);
            if (success) {
                navigate('/dashboard/schools', { replace: true });
            }
        }
    };

    const refreshCoaches = async () => {
        if (schoolId) {
            const coachList = await getCoaches(schoolId);
            setCoaches(coachList);
        }
    };

    if (loading || !school) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back button */}
            <Link
                to="/dashboard/schools"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Schools
            </Link>

            {/* Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            {school.division && (
                                <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    {school.division}
                                </span>
                            )}
                            {school.state && (
                                <span className="text-sm text-gray-500">{school.state}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Edit form or display */}
                {isEditing ? (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                                <select
                                    value={editData.division || ''}
                                    onChange={(e) => setEditData({ ...editData, division: e.target.value || null })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                >
                                    <option value="">No division</option>
                                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select
                                    value={editData.state || ''}
                                    onChange={(e) => setEditData({ ...editData, state: e.target.value || null })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                >
                                    <option value="">No state</option>
                                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={editData.priority || 'Medium'}
                                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                >
                                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={editData.status || 'Researching'}
                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                >
                                    {SCHOOL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={editData.notes || ''}
                                onChange={(e) => setEditData({ ...editData, notes: e.target.value || null })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2 pt-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${school.priority === 'High' ? 'bg-red-100 text-red-700' :
                                school.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                            }`}>
                            {school.priority} Priority
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${school.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                school.status === 'Engaged' ? 'bg-green-100 text-green-700' :
                                    school.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                                        school.status === 'Closed' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                            }`}>
                            {school.status}
                        </span>
                    </div>
                )}

                {school.notes && !isEditing && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{school.notes}</p>
                    </div>
                )}
            </div>

            {/* Coaches Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Coaches</h2>
                    <button
                        onClick={() => setShowAddCoachModal(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Coach
                    </button>
                </div>

                {loadingCoaches ? (
                    <LoadingSpinner size="md" />
                ) : coaches.length > 0 ? (
                    <div className="space-y-3">
                        {coaches.map(coach => (
                            <div key={coach.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{coach.name}</p>
                                    {coach.role && <p className="text-sm text-gray-500">{coach.role}</p>}
                                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                                        {coach.email && <span>{coach.email}</span>}
                                        {coach.phone && <span>{coach.phone}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No coaches added yet.</p>
                )}
            </div>

            {/* Interactions Section - placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Interactions</h2>
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                    Interaction timeline coming in Part 6
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete School?</h3>
                        <p className="text-gray-600 mb-4">
                            This will permanently delete "{school.name}" and all associated data. This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Coach Modal */}
            {showAddCoachModal && (
                <AddCoachModal
                    schoolId={school.id}
                    onClose={() => setShowAddCoachModal(false)}
                    onSuccess={refreshCoaches}
                />
            )}
        </div>
    );
}
