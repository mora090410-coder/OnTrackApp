import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserButton } from '@clerk/clerk-react';
import LogInteractionModal from '../interactions/LogInteractionModal';

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { userName } = useAuth();
    const [showLogModal, setShowLogModal] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between h-16 px-4 md:px-6">
                    {/* Left side */}
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <a href="/dashboard" className="text-xl font-bold text-gray-900">
                            OnTrack
                        </a>
                    </div>

                    {/* Center - Quick action */}
                    <button
                        onClick={() => setShowLogModal(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Log Interaction
                    </button>

                    {/* Right side - User profile */}
                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-sm text-gray-600">
                            {userName}
                        </span>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9"
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Mobile quick action bar */}
                <div className="sm:hidden px-4 pb-3">
                    <button
                        onClick={() => setShowLogModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Log Interaction
                    </button>
                </div>
            </header>

            {/* Log Interaction Modal - placeholder for Part 6 */}
            {/* Log Interaction Modal */}
            {showLogModal && (
                <LogInteractionModal
                    onClose={() => setShowLogModal(false)}
                    onSuccess={() => {
                        // In a real app with global state (like React Query), we'd invalidate queries here.
                        // For now, the user will see the success message and likely navigate to a page where data refreshes.
                        // Or we can rely on pages auto-refreshing on mount.
                    }}
                />
            )}
        </>
    );
}
