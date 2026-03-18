import authReducer, {
  setCredentials,
  clearCredentials,
  setAuthError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectToken,
} from '@/features/auth/authSlice';
import type { User } from '@/types';

const mockUser: User = {
  id: 'u1',
  email: 'admin@fms.com',
  name: 'Alexandra Chen',
  role: 'super_admin',
  avatarColor: 'blue',
  franchiseIds: null,
  locationIds: null,
  createdAt: '2020-01-01',
  isActive: true,
};

const mockToken = 'mock_token_u1';

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

describe('authSlice reducer', () => {
  it('returns initial state', () => {
    // Clear localStorage before this test
    localStorage.clear();
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBeNull();
  });

  it('sets credentials on setCredentials', () => {
    const state = authReducer(initialState, setCredentials({ user: mockUser, token: mockToken }));
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.error).toBeNull();
  });

  it('clears credentials on clearCredentials', () => {
    const loggedInState = { user: mockUser, token: mockToken, isLoading: false, error: null };
    const state = authReducer(loggedInState, clearCredentials());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('sets error on setAuthError', () => {
    const state = authReducer(initialState, setAuthError('Invalid credentials'));
    expect(state.error).toBe('Invalid credentials');
    expect(state.isLoading).toBe(false);
  });

  it('clears error when setting new credentials', () => {
    const errorState = { user: null, token: null, isLoading: false, error: 'Some error' };
    const state = authReducer(errorState, setCredentials({ user: mockUser, token: mockToken }));
    expect(state.error).toBeNull();
  });
});

describe('authSlice selectors', () => {
  it('selectCurrentUser returns user', () => {
    const state = { auth: { user: mockUser, token: mockToken, isLoading: false, error: null } };
    expect(selectCurrentUser(state)).toEqual(mockUser);
  });

  it('selectIsAuthenticated returns true when both user and token present', () => {
    const state = { auth: { user: mockUser, token: mockToken, isLoading: false, error: null } };
    expect(selectIsAuthenticated(state)).toBe(true);
  });

  it('selectIsAuthenticated returns false when token missing', () => {
    const state = { auth: { user: mockUser, token: null, isLoading: false, error: null } };
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('selectToken returns current token', () => {
    const state = { auth: { user: null, token: mockToken, isLoading: false, error: null } };
    expect(selectToken(state)).toBe(mockToken);
  });
});
