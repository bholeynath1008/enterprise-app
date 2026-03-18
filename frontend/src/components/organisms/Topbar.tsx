import React from 'react';
import { Bell, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleTheme, selectTheme } from '@/features/theme/themeSlice';
import { useGetTicketsQuery, useGetTasksQuery } from '@/features/api';
import i18n from '@/i18n';
import { ROUTES } from '@/routes/routes.config';

export const Topbar = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const location = useLocation();

  const { data: tickets } = useGetTicketsQuery({ status: 'open' });
  const { data: tasks } = useGetTasksQuery({ status: 'pending' });
  const notifCount = Math.min((tickets?.summary?.open ?? 0) + Math.min(tasks?.total ?? 0, 3), 99);

  const route = ROUTES.find(r => r.path === location.pathname);
  const pageTitle = route ? t(route.label) : 'Franchise Management System';

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('fms_lang', next);
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-5 gap-3 flex-shrink-0" role="banner">
      <h1 className="text-sm font-semibold text-foreground flex-1">{pageTitle}</h1>

      {/* Language switcher */}
      <button
        onClick={switchLang}
        aria-label={`Switch to ${i18n.language === 'en' ? 'Spanish' : 'English'}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border"
      >
        <Globe size={13} aria-hidden />
        <span>{i18n.language === 'en' ? 'ES' : 'EN'}</span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border"
      >
        {theme === 'dark' ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
      </button>

      {/* Notifications */}
      <button
        aria-label={`${notifCount} unread notifications`}
        className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border"
      >
        <Bell size={15} aria-hidden />
        {notifCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none px-0.5"
            aria-hidden
          >
            {notifCount > 99 ? '99+' : notifCount}
          </span>
        )}
      </button>
    </header>
  );
});
Topbar.displayName = 'Topbar';
