import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { config } from '@/lib/config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    'Auth', 'Franchisees', 'Locations', 'Sales', 'Royalties',
    'Tasks', 'Tickets', 'Announcements', 'Users', 'Activity', 'Stats',
  ],
  endpoints: () => ({}),
});
