import React, { Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Topbar } from '@/components/organisms/Topbar';
import { Spinner } from '@/components/atoms';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/gtm';

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={24} />
        <p className="text-sm text-muted-foreground">Loading page...</p>
      </div>
    </div>
  );
}

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6 page-animate"
          tabIndex={-1}
          aria-label="Main content"
        >
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}
