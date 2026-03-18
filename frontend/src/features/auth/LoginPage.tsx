import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useLoginMutation } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { Button, Input } from '@/components/atoms';
import { useTrackEvent } from '@/hooks/useTrackEvent';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(3, 'Password required'),
});
type FormData = z.infer<typeof schema>;

const DEMO = [
  { role: 'Super Admin', email: 'admin@fms.com', password: 'admin123', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { role: 'Franchisor Staff', email: 'ops@fms.com', password: 'ops123', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { role: 'Franchisee Owner', email: 'owner1@pizzapalace.com', password: 'owner123', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { role: 'Location Manager', email: 'mgr1@pizzapalace.com', password: 'mgr123', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const track = useTrackEvent();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const doLogin = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password }).unwrap();
      login(result.token, result.user);
      track('login_success', { method: 'form', role: result.user.role });
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`);
    } catch {
      track('login_failed', { email });
      toast.error(t('auth.invalidCredentials'));
    }
  };

  const onSubmit = (data: FormData) => doLogin(data.email, data.password);

  const quickLogin = async (email: string, password: string) => {
    setQuickLoading(email);
    await doLogin(email, password);
    setQuickLoading(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20" aria-hidden>
            FMS
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Franchise Management System</h1>
            <p className="text-xs text-muted-foreground">Enterprise Platform v2.0</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-7 shadow-2xl">
          <h2 className="text-lg font-bold text-foreground mb-1">{t('auth.login')}</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6" noValidate>
            <Input
              {...register('email')}
              type="email"
              label={t('auth.email')}
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
            />
            <Input
              {...register('password')}
              type="password"
              label={t('auth.password')}
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
            />
            <Button type="submit" variant="primary" size="md" className="w-full" loading={isLoading}>
              {t('auth.loginBtn')}
            </Button>
          </form>

          {/* SSO placeholder */}
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="w-full mb-5 opacity-60 cursor-not-allowed"
            disabled
            title="SSO integration: Install @auth0/auth0-react or oidc-client-ts, wrap app in Auth0Provider, replace loginMutation with auth.loginWithRedirect(). See README for full instructions."
          >
            🔐 {t('auth.ssoBtn')} <span className="text-xs ml-1">(coming soon)</span>
          </Button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">{t('auth.selectRole')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setValue('email', acc.email);
                  setValue('password', acc.password);
                  quickLogin(acc.email, acc.password);
                }}
                disabled={!!quickLoading}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/50 hover:bg-muted hover:border-border/80 transition-all text-left"
                aria-label={`Login as ${acc.role}`}
              >
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${acc.color}`}>
                  {quickLoading === acc.email ? <Loader2 size={11} className="animate-spin" /> : acc.role.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">{acc.role}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{acc.email.split('@')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          In-memory demo — data resets on server restart
        </p>
      </div>
    </div>
  );
}
