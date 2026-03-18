import { baseApi } from '@/app/baseApi';
import type { User } from '@/types';

interface LoginReq { email: string; password: string }
interface LoginRes { token: string; user: User }

export const authApi = baseApi.injectEndpoints({
  endpoints: b => ({
    login: b.mutation<LoginRes, LoginReq>({
      query: body => ({ url: '/auth/login', method: 'POST', body }),
    }),
    logout: b.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: b.query<User, void>({ query: () => '/auth/me', providesTags: ['Auth'] }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
