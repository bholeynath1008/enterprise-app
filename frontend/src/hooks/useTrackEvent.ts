import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/lib/gtm';
import { useAuth } from '@/features/auth/useAuth';

/**
 * Global hook for tracking GTM events.
 * Automatically enriches events with user role and current page.
 *
 * @example
 *   const track = useTrackEvent();
 *   track('ticket_created', { priority: 'high' });
 */
export function useTrackEvent() {
  const { user } = useAuth();
  const location = useLocation();

  return useCallback(
    (eventName: string, params: Record<string, unknown> = {}) => {
      trackEvent(eventName, {
        user_role: user?.role,
        user_id: user?.id,
        page_path: location.pathname,
        ...params,
      });
    },
    [user, location.pathname]
  );
}
