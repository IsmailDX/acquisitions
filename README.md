# Dockerized setup with Neon (Local for dev, Cloud for prod)

This repo is configured to use Neon Local in development (ephemeral branches) and Neon Cloud in production.

## Files added

- `Dockerfile` — Node.js container for the app
- `docker-compose.dev.yml` — app + Neon Local proxy
- `docker-compose.prod.yml` — app only (connects to Neon Cloud)
- `.env.development` — dev env vars and Neon Local settings
- `.env.production` — prod env vars (Neon Cloud connection)

## Development: run with Neon Local (ephemeral branches)

1. Create a Neon API Key and note your Project ID in the Neon console.
2. Find the parent branch ID to fork from (typically your main branch). You can copy it from the branch details in the Neon console.
3. Edit `.env.development`:
   - Set `NEON_API_KEY`, `NEON_PROJECT_ID`, and `PARENT_BRANCH_ID`.
   - Set `DATABASE_URL=postgres://neon:npg@neon-local:5432/<database_name>` (replace `<database_name>`; default is often `neondb`).
4. Start dev stack:
   - `docker compose -f docker-compose.dev.yml up --build`
5. The app runs on `http://localhost:3000`. A fresh ephemeral Neon branch is created at startup and deleted at shutdown.

Notes:

- The app uses the Neon serverless driver. In dev, we enable Neon Local via `NEON_LOCAL=true` which configures the driver to talk to the local proxy.
- If you want to persist branches across restarts, see commented `DELETE_BRANCH` and volume mounts in `docker-compose.dev.yml` and add `.neon_local/` to `.gitignore`.

## Production: run with Neon Cloud

1. In the Neon console, copy your production `DATABASE_URL` (ensure `sslmode=require`).
2. Edit `.env.production` and set `DATABASE_URL`.
3. Start prod stack (no Neon Local proxy):
   - `docker compose -f docker-compose.prod.yml up --build -d`

## Switching environments

- Dev uses `.env.development` with `DATABASE_URL=postgres://neon:npg@neon-local:5432/<database_name>` and `NEON_LOCAL=true`.
- Prod uses `.env.production` with your Neon Cloud `DATABASE_URL=postgres://...neon.tech...`.

## Migrations (optional)

Use your existing Drizzle scripts (e.g., `npm run db:migrate`) from your host or in a one-off container if needed.
