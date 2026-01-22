import { useState } from 'react';
import { useSchools, School } from '../../hooks/useSchools';
import SchoolCard from './SchoolCard';
import AddSchoolModal from './AddSchoolModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { DIVISIONS, PRIORITIES, SCHOOL_STATUSES } from '../../lib/utils';

export default function SchoolList() {
    const { schools, loading, error } = useSchools();
    const [showAddModal, setShowAddModal] = useState(false);

    // Filters
    const [priorityFilter, setPriorityFilter] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [divisionFilter, setDivisionFilter] = useState<string>('All');

    const filteredSchools = schools.filter(school => {
        if (priorityFilter !== 'All' && school.priority !== priorityFilter) return false;
        if (statusFilter !== 'All' && school.status !== statusFilter) return false;
        if (divisionFilter !== 'All' && school.division !== divisionFilter) return false;
        return true;
    });

    const activeCount = schools.filter(s => s.status === 'Active' || s.status === 'Engaged').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Target Schools</h1>
                    <p className="text-gray-500">
                        {schools.length} schools • {activeCount} active conversations
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add School
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">All Priorities</option>
                    {PRIORITIES.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">All Statuses</option>
                    {SCHOOL_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    value={divisionFilter}
                    onChange={(e) => setDivisionFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">All Divisions</option>
                    {DIVISIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* School grid */}
            {filteredSchools.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSchools.map(school => (
                        <SchoolCard key={school.id} school={school} />
                    ))}
                </div>
            ) : schools.length === 0 ? (
                <EmptyState onAddClick={() => setShowAddModal(true)} />
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">No schools match your filters.</p>
                    <button
                        onClick={() => {
                            setPriorityFilter('All');
                            setStatusFilter('All');
                            setDivisionFilter('All');
                        }}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Add School Modal */}
            {showAddModal && (
                <AddSchoolModal onClose={() => setShowAddModal(false)} />
            )}
        </div>
    );
}

function EmptyState({ onAddClick }: { onAddClick: () => void }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No schools yet</h3>
            <p className="text-gray-600 mb-4">
                Add your first target school to get started tracking your recruiting journey.
            </p>
            <button
                onClick={onAddClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add School
            </button>
        </div>
    );
}
