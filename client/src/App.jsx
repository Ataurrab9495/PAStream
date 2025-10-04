import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';



import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import PageLoader from './components/PageLoader';
import useAuthUser from './hooks/useAuthUser';
import { useThemeStore } from './store/useThemeStore';

const Home = React.lazy(() => import('./pages/HomePage'));
const SingUp = React.lazy(() => import('./pages/SignUpPage'));
const Login = React.lazy(() => import('./pages/LoginPage'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Notifications = React.lazy(() => import('./pages/NotificationsPage'));
const Chat = React.lazy(() => import('./pages/ChatPage'));
const Call = React.lazy(() => import('./pages/CallPage'));
const Friends = React.lazy(() => import('./pages/Friends'));

const App = () => {
    const { isLoading, authUser } = useAuthUser();
    const { theme } = useThemeStore();

    const isAuthenticated = Boolean(authUser);
    const isOnboarded = authUser?.isOnboarded;

    if (isLoading) return <PageLoader />;

   /*  const isAuthenticated = true;
    const isOnboarded = true; */

    return (
        <div className="h-screen" data-theme={theme}>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated && isOnboarded ? (
                                <Layout showSidebar={true}>
                                    <Home />
                                </Layout>
                            ) : (
                                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                            )
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            !isAuthenticated ? <SingUp /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            !isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            isAuthenticated && isOnboarded ? (
                                <Layout showSidebar={true}>
                                    <Notifications />
                                </Layout>
                            ) : (
                                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                            )
                        }
                    />
                    <Route
                        path="/call/:id"
                        element={
                            isAuthenticated && isOnboarded ? (
                                <Layout showSidebar={false}>
                                    <Call />
                                </Layout>
                            ) : (
                                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                            )
                        }
                    />
                    <Route
                        path="/chat/:id"
                        element={
                            isAuthenticated && isOnboarded ? (
                                <Layout showSidebar={false}>
                                    <Chat />
                                </Layout>
                            ) : (
                                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                            )
                        }
                    />
                    <Route
                        path="/friends"
                        element={
                            isAuthenticated && isOnboarded ? (
                                <Layout showSidebar={true}>
                                    <Friends />
                                </Layout>
                            ) : (
                                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                            )
                        }   
                    />

                    <Route
                        path="/onboarding"
                        element={
                            isAuthenticated ? (
                                !isOnboarded ? (
                                    <Onboarding />
                                ) : (
                                    <Navigate to="/" />
                                )
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </Suspense>
            <Toaster position="top-right" />
        </div>
    )
}

export default App;