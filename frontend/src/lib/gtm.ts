import { config } from './config';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Initialize GTM — call once on app boot */
export function initGTM(): void {
  if (!config.gtmId || config.isDev) return;

  window.dataLayer = window.dataLayer ?? [];

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`;
  document.head.appendChild(script);

  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
}

/** Push a custom event to GTM dataLayer */
export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {}
): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...params });

  if (config.isDev) {
    console.debug('[GTM]', eventName, params);
  }
}

/** Track a page view (call on route change) */
export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', { page_path: path, page_title: title });
}
