# Franchise Management System (FMS)

> Enterprise-grade, multi-tenant Franchise Management Platform — a centralized SaaS solution for franchisors to manage franchisees, royalties, sales reporting, tasks, support tickets, compliance, and onboarding.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         BROWSER CLIENT                           │
│  React 18 + Vite + TypeScript                                    │
│  Redux Toolkit (auth slice, theme) + RTK Query (all API calls)   │
│  React Router v6 (config-driven, permission-guarded routes)      │
│  Atomic Design: atoms → molecules → organisms → templates        │
│  Permission-based RBAC (not role-check guards)                   │
└───────────────────┬──────────────────────────────────────────────┘
                    │ REST + JSON  (Bearer mock token)
┌───────────────────▼──────────────────────────────────────────────┐
│                     NODE/EXPRESS API  :4000                       │
│  TypeScript + ts-node-dev                                        │
│  In-memory DB (Map/Array, seed on boot)                          │
│  Role + ownership middleware (RBAC)                              │
│  Routes: /api/auth /franchisees /royalties /tasks /tickets …     │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✅ Implemented Features

| Area | Status |
|------|--------|
| Role-based dashboards (4 roles) | ✅ |
| Permission-based RBAC (not hardcoded role checks) | ✅ |
| Config-driven routes (`routes.config.ts`) | ✅ |
| Dynamic sidebar (permission-filtered) | ✅ |
| Atomic Design component structure | ✅ |
| RTK Query (all data fetching, caching, optimistic updates) | ✅ |
| Multi-step Onboarding Wizard (RHF + Zod) | ✅ |
| TanStack Table v8 (sorting, filtering, pagination, export) | ✅ |
| Dark/light theme toggle + localStorage | ✅ |
| i18n English + Spanish (react-i18next) | ✅ |
| Currency + localized dates (Intl / dayjs) | ✅ |
| GTM integration + useTrackEvent hook | ✅ |
| SSO placeholder (Auth0/Okta integration notes) | ✅ |
| Storybook (3 component stories) | ✅ |
| Cypress E2E suite (8 specs, custom commands) | ✅ |
| Jest unit + integration tests (~25% coverage target) | ✅ |
| Docker multi-stage (frontend + backend) | ✅ |
| docker-compose.yml | ✅ |
| Kubernetes manifests (deployment, service, ingress) | ✅ |
| GitHub Actions CI/CD pipeline | ✅ |
| Encryption demo endpoint (AES mock) | ✅ |
| Assets/styleguide page | ✅ |
| Mobile-first responsive + a11y | ✅ |
| Code splitting (lazy + Suspense) | ✅ |
| React.memo + useMemo + useCallback optimizations | ✅ |

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite 5** + **TypeScript 5**
- **Redux Toolkit** + **RTK Query** — data fetching, caching, optimistic updates
- **React Router v6** — config-driven, permission-guarded routes
- **Tailwind CSS 3** + **clsx** + **cva** — variant-based styling
- **shadcn/ui** (Radix UI primitives)
- **React Hook Form** + **Zod** — type-safe forms
- **TanStack Table v8** — enterprise data grids
- **Recharts** — charts and visualizations
- **react-i18next** — i18n (EN/ES) + Intl currency/date
- **Sonner** — toast notifications
- **Lucide React** — icons
- **Storybook 8** — component documentation

### Backend
- **Node.js 18+** + **Express 4** + **TypeScript**
- Pure in-memory storage (Map-based, resets on restart)
- Mock JWT auth + role ownership middleware
- AES encryption demo (crypto-js)

### Testing
- **Jest** + **React Testing Library** — unit + integration
- **Cypress 13** — E2E with Page Object / App Actions pattern
- **MSW** — API mocking in tests

### DevOps
- **Docker** (multi-stage Dockerfile per service)
- **docker-compose** (local full-stack)
- **Kubernetes** (deployment, service, ingress-nginx, secrets)
- **GitHub Actions** — lint → test → build → E2E → push

---

## 🚀 Setup & Running

### Prerequisites
- Node.js 18+  
- npm or pnpm
- Docker (optional, for containerized run)

### Development (two terminals)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev        # http://localhost:4000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Docker Compose (full stack)

```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:4000
```

### Environment Variables

**backend/.env**
```
PORT=4000
JWT_SECRET=fms_dev_secret_2025
NODE_ENV=development
```

**frontend/.env.development**
```
VITE_API_URL=http://localhost:4000
VITE_GTM_ID=GTM-XXXXXXX
VITE_APP_ENV=development
```

**frontend/.env.production**
```
VITE_API_URL=https://api.yourfranchise.com
VITE_GTM_ID=GTM-YYYYYYY
VITE_APP_ENV=production
```

---

## 🔑 Mock Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@fms.com` | `admin123` |
| **Franchisor Staff** | `ops@fms.com` | `ops123` |
| **Franchisee Owner** | `owner1@pizzapalace.com` | `owner123` |
| **Location Manager** | `mgr1@pizzapalace.com` | `mgr123` |

---

## 🧪 Testing

```bash
# Unit + Integration tests
cd frontend
npm test                    # run all Jest tests
npm run test:coverage       # with coverage report
npm run test:watch          # watch mode

# E2E with Cypress
npm run cypress:open        # interactive (headed)
npm run cypress:run         # headless (CI mode)
npm run cypress:run:chrome  # headless Chrome
```

### Test Coverage Targets (~25% total realistic)

| Layer | Target |
|-------|--------|
| Unit (utils, slices, hooks) | ~35% |
| Integration (connected components, forms) | ~20% |
| E2E (critical user flows) | ~8 flows |

---

## 📁 Project Structure

```
franchise-management-system/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express entry
│   │   ├── db.ts                 # In-memory DB + seed
│   │   ├── types.ts
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT mock + RBAC
│   │   └── routes/
│   │       ├── auth.ts
│   │       ├── franchisees.ts
│   │       ├── royalties.ts
│   │       ├── tasks.ts
│   │       ├── tickets.ts
│   │       ├── misc.ts           # sales, locations, announcements, users, activity
│   │       └── secure.ts         # AES encryption demo
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── store.ts          # Redux store + RTK Query
│   │   │   ├── baseApi.ts
│   │   │   └── hooks.ts
│   │   ├── components/           # Atomic Design
│   │   │   ├── atoms/            # Button, Input, Badge, Spinner...
│   │   │   ├── molecules/        # FormField, StatCard, SearchBar...
│   │   │   ├── organisms/        # DataTable, Sidebar, Navbar, WizardStep...
│   │   │   └── templates/        # DashboardTemplate, AuthTemplate...
│   │   ├── features/             # Domain logic
│   │   │   ├── auth/             # authSlice, authApi, LoginPage, useAuth
│   │   │   ├── dashboard/        # role-split dashboards
│   │   │   │   ├── super-admin/
│   │   │   │   ├── staff/
│   │   │   │   ├── owner/
│   │   │   │   └── manager/
│   │   │   ├── franchisees/
│   │   │   ├── royalties/
│   │   │   ├── sales/
│   │   │   ├── tasks/
│   │   │   ├── tickets/
│   │   │   ├── announcements/
│   │   │   ├── onboarding/       # Multi-step wizard
│   │   │   └── styleguide/       # Assets gallery
│   │   ├── hooks/                # Global hooks (useTrackEvent, useDebounce...)
│   │   ├── lib/                  # Infrastructure (apiClient, config, cn, crypto)
│   │   ├── permissions/          # RBAC permission system
│   │   │   ├── permissions.ts    # Permission enum + role mapping
│   │   │   └── usePermissions.ts # Hooks
│   │   ├── routes/
│   │   │   ├── routes.config.ts  # Config-driven route definitions
│   │   │   └── ProtectedRoute.tsx
│   │   ├── types/                # Shared TypeScript interfaces
│   │   └── i18n/                 # i18n setup + locales
│   ├── cypress/
│   │   ├── e2e/                  # Test specs
│   │   ├── fixtures/             # Mock data
│   │   └── support/              # Commands + helpers
│   ├── .storybook/
│   └── package.json
│
├── k8s/                          # Kubernetes manifests
├── .github/workflows/ci.yml      # GitHub Actions CI/CD
├── docker-compose.yml
└── README.md
```

---

## 🔐 Permission System

Permissions are defined as constants in `permissions/permissions.ts`. Each role maps to a set of permissions. Routes and UI elements check permissions — never role names directly.

```ts
// Adding a new role requires ONLY:
// 1. Add to ROLE_PERMISSIONS map
// 2. No route file changes needed
ROLE_PERMISSIONS[NEW_ROLE] = [Permission.DASHBOARD_VIEW, Permission.TICKETS_READ, ...]
```

---

## 🌍 SSO Integration Notes

The login page includes a disabled "Sign in with SSO" button. To integrate:

1. Install `@auth0/auth0-react` or `oidc-client-ts`
2. Wrap app in `<Auth0Provider domain="..." clientId="...">`
3. Replace `loginMutation` with `auth.loginWithRedirect()`
4. On callback, extract `user.roles` or `user['https://fms/permissions']` from token claims
5. Pass to Redux via `setCredentials({ user, token: auth.getAccessTokenSilently() })`

---

## 🐳 Docker

```bash
# Build individual images
docker build -f backend/Dockerfile -t fms-backend .
docker build -f frontend/Dockerfile -t fms-frontend .

# Full stack via compose
docker-compose up --build -d
docker-compose logs -f
docker-compose down
```

---

## ☸️ Kubernetes

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## 🔮 Future Roadmap

1. **PostgreSQL + Prisma** — replace in-memory DB with full ORM + migrations
2. **Real JWT + refresh tokens** — jsonwebtoken + httpOnly cookies + rotation
3. **Full SSO** — Auth0 / Okta / Azure AD OIDC integration
4. **Stripe royalties** — automated royalty invoicing + payment processing
5. **Socket.IO** — real-time notifications for tickets, tasks, announcements
6. **PDF generation** — pdfmake / puppeteer for royalty invoices, compliance reports
7. **Advanced analytics** — time-series charts, cohort analysis, forecasting
8. **Audit log** — immutable, queryable audit trail (PostgreSQL + triggers)
9. **Multi-region** — horizontal scaling with Redis session store
10. **Mobile app** — React Native or Expo sharing business logic

---

## ♿ Accessibility

- Semantic HTML5 (`<nav>`, `<main>`, `<header>`, `<aside>`)
- ARIA labels on interactive elements
- Focus-visible ring styles
- Keyboard navigation throughout
- Color contrast WCAG AA compliant
- Screen reader tested with NVDA/VoiceOver
- `eslint-plugin-jsx-a11y` enforced in lint

---

## 📄 License

MIT — for demonstration and educational purposes.
