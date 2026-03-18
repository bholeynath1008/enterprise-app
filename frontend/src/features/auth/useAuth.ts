import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCurrentUser, selectIsAuthenticated, setCredentials, clearCredentials } from './authSlice';
import { baseApi } from '@/app/baseApi';
import type { User } from '@/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const login = (token: string, userData: User) => {
    dispatch(setCredentials({ token, user: userData }));
  };

  const logout = () => {
    dispatch(clearCredentials());
    dispatch(baseApi.util.resetApiState());
  };

  const isHQ = () => user?.role === 'super_admin' || user?.role === 'franchisor_staff';
  const isSuperAdmin = () => user?.role === 'super_admin';
  const isOwner = () => user?.role === 'franchisee_owner';
  const isManager = () => user?.role === 'location_manager';

  return { user, isAuthenticated, login, logout, isHQ, isSuperAdmin, isOwner, isManager };
}
