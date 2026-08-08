# Motherboard (BoardScan)

Camera-based diagnostics for PC motherboards. Scan boards to identify components, review confidence scores, and run guided dead-board triage — from a React Native mobile app backed by a NestJS API.

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
| `apps/mobile` | Expo 57, React Native, React Navigation, React Native Paper | Scan, triage, history, and settings UI |
| `apps/backend` | NestJS 11, TypeScript | API server (starter) |

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ (workspaces)
- For native device runs: [Expo Go](https://expo.dev/go), or iOS Simulator / Android emulator

## Getting started

```bash
# Install all workspace dependencies
npm install

# Mobile (Expo)
npm run mobile

# Backend (Nest watch mode, default http://localhost:3000)
npm run backend
```

### Mobile app scripts

```bash
npm run start --workspace apps/mobile      # Expo DevTools
npm run android --workspace apps/mobile   # Android
npm run ios --workspace apps/mobile       # iOS
npm run web --workspace apps/mobile       # Web
```

### Backend scripts

```bash
npm run start:dev --workspace apps/backend   # watch mode
npm run build --workspace apps/backend
npm run test --workspace apps/backend
npm run test:e2e --workspace apps/backend
```

## Mobile features

The BoardScan client ships with a dark diagnostic UI and mock data for:

- **Home** — quick entry to scan and dead-board triage, recent results
- **Scan** — live viewfinder, component capture, and result detail (designator, package, failure signs)
- **Triage** — guided multi-check flow (connectors, capacitors, VRM MOSFETs, CMOS, shorts)
- **History** — past scans with confidence
- **Settings** — app preferences

Navigation uses bottom tabs with nested stacks; immersive camera screens hide the tab bar.

## Backend

NestJS API on port `3000` (or `PORT`) with `/api/v1` prefix. Swagger docs at `/api/docs` in non-production.

### Local infra

```bash
# Postgres (5435) + Redis (6381)
docker compose up -d postgres redis

# Copy env and migrate
cp apps/backend/.env.example apps/backend/.env
npm run prisma:migrate --workspace apps/backend

# Run API
npm run backend
```

Key routes: auth, `POST /scan`, triage sessions, billing (Stripe), `GET /health` + `GET /ready`.

## Development notes

- Root scripts target workspaces: `npm run mobile` / `npm run backend`
- Mobile Expo docs for this project: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- Backend Nest docs: [docs.nestjs.com](https://docs.nestjs.com)
