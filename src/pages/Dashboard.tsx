import { Routes, Route, Navigate } from 'react-router-dom';
import { useAthleteContext } from '../contexts/AthleteContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Feature components
import TodayView from '../components/today/TodayView';
import SchoolList from '../components/schools/SchoolList';
import SchoolDetailView from '../components/schools/SchoolDetailView';
import InteractionTimeline from '../components/interactions/InteractionTimeline';

/**
 * Dashboard page with nested routing for Today, Schools, Activity, Settings
 */
export default function Dashboard() {
    const { loading } = useAthleteContext();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <Routes>
                {/* Today View (default) */}
                <Route index element={<TodayView />} />

                {/* Schools */}
                <Route path="schools" element={<SchoolList />} />
                <Route path="schools/:schoolId" element={<SchoolDetailView />} />

                {/* Activity */}
                <Route path="activity" element={<InteractionTimeline />} />

                {/* Settings - placeholder */}
                <Route path="settings" element={<SettingsPlaceholder />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </DashboardLayout>
    );
}

function SettingsPlaceholder() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Account settings and preferences coming soon.</p>
        </div>
    );
}
