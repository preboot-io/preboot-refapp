import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './assets/fonts/fonts.css';
import '@preboot.io/preboot-ui-community/index.css'
import '@mantine/notifications/styles.css';
import {MantineProviders} from './providers/mantine-providers';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import {QueryProvider} from './providers/query-provider';
import {LoginPage} from './pages/public/login-page';
import {RequireAuth} from './features/auth/components/require-auth';
import {AppLayout} from './components/layouts/app-layout';
import {DashboardPage} from './pages/super-admin/dashboard/dashboard-page';
import {ResetPasswordPage} from "./pages/public/reset-password-page.tsx";
import {getDefaultRouteForUser, UserRole} from './config/role-routes';
import {ActivateAccountPage} from "@/pages/public/activate-account-page.tsx";
import {UsersPage} from "@/pages/admin/users/users-page.tsx";
import {TenantListPage as SuperAdminTenantListPage} from "@/pages/super-admin/tenants/tenant-list-page.tsx";
import {TenantUsersPage as SuperAdminTenantUsersPage} from '@/pages/super-admin/tenants/tenant-users-page.tsx';
import {PublicLayout} from '@/components/layouts/public-layout.tsx';

export default function App() {
    return (
        <MantineProviders>
            <BrowserRouter>
                <QueryProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route
                            element={
                                <PublicLayout/>
                            }
                        >
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
                            <Route path="/activate-account" element={<ActivateAccountPage/>}/>
                        </Route>

                        {/* Protected routes */}
                        <Route
                            element={
                                <RequireAuth>
                                    <AppLayout/>
                                </RequireAuth>
                            }
                        >
                            {/*<Route path="/profile" element={<UserProfilePage />} />*/}

                            {/* User admin only routes */}
                            <Route
                                path="/admin/*"
                                element={
                                    <RequireAuth roles={[UserRole.ADMIN]}>
                                        <Outlet/>
                                    </RequireAuth>
                                }
                            >
                                <Route path="dashboard" element={<DashboardPage/>}/> // this one is from super-admin as
                                a filler
                                <Route path="users" element={<UsersPage/>}/>
                            </Route>

                            {/* Super admin only routes */}
                            <Route
                                path="/super-admin/*"
                                element={
                                    <RequireAuth roles={[UserRole.SUPER_ADMIN]}>
                                        <Outlet/>
                                    </RequireAuth>
                                }
                            >
                                <Route path="dashboard" element={<DashboardPage/>}/>
                                <Route path="tenants" element={<SuperAdminTenantListPage/>}/>
                                <Route
                                    path="tenants/:tenantId/users"
                                    element={<SuperAdminTenantUsersPage/>}
                                />
                            </Route>
                        </Route>

                        {/* Redirect root based on user role */}
                        <Route
                            path="/"
                            element={
                                <RequireAuth>
                                    {({currentUser}) => (
                                        <Navigate
                                            to={getDefaultRouteForUser(currentUser?.roles || [])}
                                            replace
                                        />
                                    )}
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </QueryProvider>
            </BrowserRouter>
        </MantineProviders>
    );
}
