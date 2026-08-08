# Motherboard (BoardScan)

Camera-based diagnostics for PC motherboards. Scan boards to identify components, review confidence scores, and run guided dead-board triage — from a React Native mobile app backed by a NestJS API.

Images are uploaded **directly to Cloudinary**; the API accepts HTTPS image URLs only (no base64 bodies).

## Monorepo layout

```
motherboard/
├── apps/
│   ├── mobile/    # Expo (React Native) BoardScan client
│   └── backend/   # NestJS API
└── package.json   # npm workspaces root
```

| App | Stack | Role |
|-----|--------|------|
| `apps/mobile` | Expo 57, React Navigation, Paper, Zustand | Auth-gated scan, triage, history, settings |
| `apps/backend` | NestJS 11, Prisma, Postgres, Redis | Auth, scan/triage AI, Cloudinary sign, Stripe |

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ (workspaces)
- Docker (Postgres + Redis)
- Cloudinary account (cloud name, API key, API secret)
- Optional: Anthropic / OpenAI keys for live vision; Stripe keys for Pro billing
- Device/emulator: [Expo Go](https://expo.dev/go) or dev client

## Getting started

```bash
# Install all workspace dependencies
npm install

# Infra
docker compose up -d postgres redis

# Backend env
cp apps/backend/.env.example apps/backend/.env
# Set CLOUDINARY_*, JWT secrets, and optionally AI/Stripe keys

npm run prisma:migrate --workspace apps/backend
npm run backend

# Mobile env
cp apps/mobile/.env.example apps/mobile/.env
# EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3000/api/v1
# EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud name>

npm run mobile
```

On a physical device, `localhost` will not reach your machine — use your LAN IP in `EXPO_PUBLIC_API_URL`, and ensure the backend is listening on `0.0.0.0` (Nest default).

### Mobile scripts

```bash
npm run start --workspace apps/mobile
npm run android --workspace apps/mobile
npm run ios --workspace apps/mobile
npm run web --workspace apps/mobile
```

### Backend scripts

```bash
npm run start:dev --workspace apps/backend
npm run build --workspace apps/backend
npm run test --workspace apps/backend
npm run test:e2e --workspace apps/backend
```

## App flow

1. **Login / Register** (required) — JWT access + refresh in SecureStore  
2. **Scan** — camera or gallery → tap component → crop → Cloudinary upload → `POST /scan`  
3. **Result / History** — load by UUID; thumbs feedback  
4. **Triage** — session checklist → per-check capture/upload → complete + primary suspect  
5. **Settings** — quota/tier, Stripe checkout/portal, logout  

## API notes

- Base: `http://host:3000/api/v1` (Swagger at `/api/docs` in non-prod)
- `POST /media/sign` — Cloudinary signed upload params  
- `POST /scan` body: `{ imageUrl, fullImageUrl?, tapX, tapY }`  
- Triage analyze: `{ imageUrl }`  
- Health: `GET /health`, `GET /ready` (no `/api/v1` prefix)

## Development notes

- Root scripts: `npm run mobile` / `npm run backend`
- Expo SDK 57 docs: https://docs.expo.dev/versions/v57.0.0/
- Nest docs: https://docs.nestjs.com
- Never commit `.env` files; use `.env.example` templates
