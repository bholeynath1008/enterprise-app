import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '@/types';

const TOKEN_KEY = 'fms_token';
const USER_KEY = 'fms_user';

function load(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as User | null;
    return { token, user };
  } catch { return { token: null, user: null }; }
}

const { token, user } = load();

const initialState: AuthState = { user, token, isLoading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, { payload }: PayloadAction<{ user: User; token: string }>) {
      state.user = payload.user;
      state.token = payload.token;
      state.error = null;
      localStorage.setItem(TOKEN_KEY, payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    setAuthError(state, { payload }: PayloadAction<string | null>) {
      state.error = payload;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthError } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (s: { auth: AuthState }) => s.auth.user;
export const selectToken = (s: { auth: AuthState }) => s.auth.token;
export const selectIsAuthenticated = (s: { auth: AuthState }) => !!s.auth.token && !!s.auth.user;
