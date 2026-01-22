import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { AthleteProvider } from './contexts/AthleteContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import ThankYouPage from './pages/ThankYouPage';

// Protected pages (lazy loaded for performance)
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';

const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
    return (
        <AthleteProvider>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                }
            >
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />

                    {/* Auth routes */}
                    <Route
                        path="/sign-in/*"
                        element={
                            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                                <SignIn
                                    routing="path"
                                    path="/sign-in"
                                    signUpUrl="/sign-up"
                                    forceRedirectUrl="/dashboard"
                                />
                            </div>
                        }
                    />
                    <Route
                        path="/sign-up/*"
                        element={
                            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                                <SignUp
                                    routing="path"
                                    path="/sign-up"
                                    signInUrl="/sign-in"
                                    forceRedirectUrl="/dashboard"
                                />
                            </div>
                        }
                    />

                    {/* Onboarding route - requires auth but not onboarding completion */}
                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute requireOnboarding={false}>
                                <OnboardingPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected dashboard routes - require auth AND onboarding */}
                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect /app to /dashboard for convenience */}
                    <Route path="/app" element={<Navigate to="/dashboard" replace />} />

                    {/* Catch-all redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </AthleteProvider>
    );
}

export default App;
