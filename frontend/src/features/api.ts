import { baseApi } from '@/app/baseApi';
import type {
  Franchisee, Location, SalesReport, SalesSummary,
  Royalty, RoyaltySummary, Task, Ticket, TicketSummary,
  Announcement, ActivityLog, DashboardStats, PaginatedResponse, User,
} from '@/types';

// ---- Franchisees ----
export const franchiseesApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getFranchisees: b.query<PaginatedResponse<Franchisee>, { status?: string; search?: string; page?: number }>({
      query: p => ({ url: '/franchisees', params: p }),
      providesTags: ['Franchisees'],
    }),
    createFranchisee: b.mutation<Franchisee, Partial<Franchisee>>({
      query: body => ({ url: '/franchisees', method: 'POST', body }),
      invalidatesTags: ['Franchisees', 'Stats'],
    }),
    updateFranchisee: b.mutation<Franchisee, { id: string } & Partial<Franchisee>>({
      query: ({ id, ...body }) => ({ url: `/franchisees/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Franchisees'],
    }),
    deleteFranchisee: b.mutation<void, string>({
      query: id => ({ url: `/franchisees/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Franchisees', 'Stats'],
    }),
  }),
});

// ---- Locations ----
export const locationsApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getLocations: b.query<{ data: Location[]; total: number }, { franchiseId?: string; search?: string }>({
      query: p => ({ url: '/locations', params: p }),
      providesTags: ['Locations'],
    }),
    createLocation: b.mutation<Location, Partial<Location>>({
      query: body => ({ url: '/locations', method: 'POST', body }),
      invalidatesTags: ['Locations', 'Franchisees'],
    }),
  }),
});

// ---- Sales ----
export const salesApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getSalesReports: b.query<PaginatedResponse<SalesReport> & { summary: SalesSummary }, { franchiseId?: string; locationId?: string; status?: string; page?: number }>({
      query: p => ({ url: '/sales', params: p }),
      providesTags: ['Sales'],
    }),
    submitSalesReport: b.mutation<SalesReport, Partial<SalesReport>>({
      query: body => ({ url: '/sales', method: 'POST', body }),
      invalidatesTags: ['Sales', 'Royalties', 'Stats'],
    }),
    approveSalesReport: b.mutation<SalesReport, string>({
      query: id => ({ url: `/sales/${id}/approve`, method: 'PUT' }),
      invalidatesTags: ['Sales'],
    }),
  }),
});

// ---- Royalties ----
export const royaltiesApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getRoyalties: b.query<PaginatedResponse<Royalty> & { summary: RoyaltySummary }, { franchiseId?: string; status?: string; page?: number }>({
      query: p => ({ url: '/royalties', params: p }),
      providesTags: ['Royalties'],
    }),
    markRoyaltyPaid: b.mutation<Royalty, string>({
      query: id => ({ url: `/royalties/${id}/pay`, method: 'PUT' }),
      invalidatesTags: ['Royalties', 'Stats'],
    }),
    sendRoyaltyReminder: b.mutation<{ message: string }, string>({
      query: id => ({ url: `/royalties/${id}/remind`, method: 'POST' }),
    }),
  }),
});

// ---- Tasks ----
export const tasksApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getTasks: b.query<PaginatedResponse<Task>, { status?: string; priority?: string; page?: number }>({
      query: p => ({ url: '/tasks', params: p }),
      providesTags: ['Tasks'],
    }),
    createTask: b.mutation<Task, Partial<Task>>({
      query: body => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: ['Tasks', 'Stats'],
    }),
    completeTask: b.mutation<Task, { id: string; photoProofUrl?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/complete`, method: 'PUT', body }),
      invalidatesTags: ['Tasks', 'Stats'],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          tasksApi.util.updateQueryData('getTasks', {}, draft => {
            const t = draft.data.find(t => t.id === id);
            if (t) t.status = 'completed';
          })
        );
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
    deleteTask: b.mutation<void, string>({
      query: id => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

// ---- Tickets ----
export const ticketsApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getTickets: b.query<PaginatedResponse<Ticket> & { summary: TicketSummary }, { status?: string; priority?: string; franchiseId?: string; page?: number }>({
      query: p => ({ url: '/tickets', params: p }),
      providesTags: ['Tickets'],
    }),
    createTicket: b.mutation<Ticket, Partial<Ticket>>({
      query: body => ({ url: '/tickets', method: 'POST', body }),
      invalidatesTags: ['Tickets', 'Stats'],
    }),
    resolveTicket: b.mutation<Ticket, string>({
      query: id => ({ url: `/tickets/${id}/resolve`, method: 'PUT' }),
      invalidatesTags: ['Tickets', 'Stats'],
    }),
    replyToTicket: b.mutation<Ticket, { id: string; body: string }>({
      query: ({ id, body }) => ({ url: `/tickets/${id}/reply`, method: 'POST', body: { body } }),
      invalidatesTags: ['Tickets'],
    }),
  }),
});

// ---- Announcements ----
export const announcementsApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getAnnouncements: b.query<{ data: Announcement[]; total: number }, void>({
      query: () => '/announcements',
      providesTags: ['Announcements'],
    }),
    createAnnouncement: b.mutation<Announcement, Partial<Announcement>>({
      query: body => ({ url: '/announcements', method: 'POST', body }),
      invalidatesTags: ['Announcements'],
    }),
    deleteAnnouncement: b.mutation<void, string>({
      query: id => ({ url: `/announcements/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Announcements'],
    }),
  }),
});

// ---- Users ----
export const usersApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getUsers: b.query<{ data: User[]; total: number }, void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    createUser: b.mutation<User, Partial<User> & { password: string }>({
      query: body => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    deactivateUser: b.mutation<void, string>({
      query: id => ({ url: `/users/${id}/deactivate`, method: 'PUT' }),
      invalidatesTags: ['Users'],
    }),
  }),
});

// ---- Activity + Stats ----
export const activityApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getActivity: b.query<PaginatedResponse<ActivityLog>, { page?: number }>({
      query: p => ({ url: '/activity', params: p }),
      providesTags: ['Activity'],
    }),
  }),
});

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: b => ({
    getDashboardStats: b.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),
  }),
});

// Re-export all hooks
export const { useGetFranchiseesQuery, useCreateFranchiseeMutation, useUpdateFranchiseeMutation, useDeleteFranchiseeMutation } = franchiseesApi;
export const { useGetLocationsQuery, useCreateLocationMutation } = locationsApi;
export const { useGetSalesReportsQuery, useSubmitSalesReportMutation, useApproveSalesReportMutation } = salesApi;
export const { useGetRoyaltiesQuery, useMarkRoyaltyPaidMutation, useSendRoyaltyReminderMutation } = royaltiesApi;
export const { useGetTasksQuery, useCreateTaskMutation, useCompleteTaskMutation, useDeleteTaskMutation } = tasksApi;
export const { useGetTicketsQuery, useCreateTicketMutation, useResolveTicketMutation, useReplyToTicketMutation } = ticketsApi;
export const { useGetAnnouncementsQuery, useCreateAnnouncementMutation, useDeleteAnnouncementMutation } = announcementsApi;
export const { useGetUsersQuery, useCreateUserMutation, useDeactivateUserMutation } = usersApi;
export const { useGetActivityQuery } = activityApi;
export const { useGetDashboardStatsQuery } = dashboardApi;
