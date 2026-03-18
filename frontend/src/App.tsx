import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout, AuthLayout } from '@/components/templates/AppLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { ROUTES } from '@/routes/routes.config';
import { useAuth } from '@/features/auth/useAuth';
import { Spinner } from '@/components/atoms';

const LoginPage = lazy(() => import('@/features/auth/LoginPage'));

function NotFound() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <p className="text-7xl font-black text-muted-foreground/15 mb-4">404</p>
        <p className="text-xl font-bold text-foreground mb-2">Page Not Found</p>
        <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>}>
            <LoginPage />
          </Suspense>
        } />
      </Route>

      {/* Protected app routes — generated from config */}
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {ROUTES.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute permissions={route.requiredPermissions}>
                <route.element />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Root redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
