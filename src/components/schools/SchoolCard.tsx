import { Link } from 'react-router-dom';
import { School } from '../../hooks/useSchools';

interface SchoolCardProps {
    school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-700';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'Low':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Researching':
                return 'bg-gray-100 text-gray-700';
            case 'Contacted':
                return 'bg-blue-100 text-blue-700';
            case 'Engaged':
                return 'bg-green-100 text-green-700';
            case 'Active':
                return 'bg-emerald-100 text-emerald-700';
            case 'Closed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <Link
            to={`/dashboard/schools/${school.id}`}
            className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
        >
            {/* Top section */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{school.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {school.division && (
                            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {school.division}
                            </span>
                        )}
                        {school.state && (
                            <span className="text-xs text-gray-500">{school.state}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityStyles(school.priority)}`}>
                    {school.priority}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyles(school.status)}`}>
                    {school.status}
                </span>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-500">
                No interactions yet
            </div>
        </Link>
    );
}
