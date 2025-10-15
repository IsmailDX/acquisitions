# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API for an "acquisitions" system with JWT-based authentication. The project uses:

- **Express.js** for the web framework
- **Drizzle ORM** with PostgreSQL (Neon serverless) for database operations
- **Zod** for validation
- **Winston** for structured logging
- **JWT** for authentication with HTTP-only cookies
- **bcrypt** for password hashing

## Essential Development Commands

### Development Server

```bash
npm run dev
```

Starts the development server with Node.js `--watch` flag for auto-reloading on file changes.

### Code Quality

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes
```

### Database Operations

```bash
npm run db:generate   # Generate migration files from schema changes
npm run db:migrate    # Apply migrations to database
npm run db:studio     # Open Drizzle Studio (database GUI)
```

## Code Architecture

### Import Path Mapping

The project uses Node.js subpath imports for clean module resolution:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middlewares/*` → `./src/middlewares/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Application Structure

- **Entry Point**: `src/index.js` loads environment variables and starts the server
- **Server Setup**: `src/server.js` handles port binding and server startup
- **App Configuration**: `src/app.js` configures Express middleware, CORS, security headers, and routes

### Database Layer

- **Models**: Drizzle schemas in `src/models/` (currently only `user.model.js`)
- **Database Config**: `src/config/database.js` initializes Neon PostgreSQL connection
- **Migrations**: Generated in `./drizzle/` directory

### Authentication Flow

The authentication system follows a layered approach:

1. **Route** (`src/routes/auth.routes.js`) defines endpoints
2. **Controller** (`src/controllers/auth.controller.js`) handles request/response logic
3. **Validation** (`src/validations/auth.validation.js`) uses Zod schemas
4. **Service** (`src/services/auth.service.js`) contains business logic
5. **Utils** (`src/utils/`) provides JWT tokens, cookies, and formatting helpers

### Current API Endpoints

- `GET /` - Basic health check
- `GET /health` - Detailed health status with uptime
- `GET /api` - API welcome message
- `POST /api/auth/sign-up` - User registration (fully implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

### Logging

Winston logger configured in `src/config/logger.js`:

- **Production**: File-based logging (`logs/error.log`, `logs/combined.log`)
- **Development**: Additional console logging with colors
- **Format**: JSON structured logs with timestamps and stack traces

## Development Guidelines

### Code Style

- ES modules (`"type": "module"` in package.json)
- ESLint enforces 2-space indentation, single quotes, semicolons
- Prettier for consistent formatting
- Arrow functions preferred over traditional functions

### Error Handling

- Services throw specific error messages (e.g., "User with this email already exists")
- Controllers catch and transform errors into appropriate HTTP responses
- Winston logger used for error tracking throughout the application

### Database Schema Updates

1. Modify schema files in `src/models/`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply changes
4. Use `npm run db:studio` to verify changes

### Environment Variables

Required in `.env` file:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `LOG_LEVEL` - Winston log level
- `NODE_ENV` - Environment mode
- `PORT` - Server port (defaults to 3000)

## Known Issues/TODOs

- Sign-in and sign-out endpoints are not implemented (return placeholder responses)
- User service has a bug: `existingUser` query is not awaited, so the email uniqueness check will fail
- JWT utility has undefined `error` variable in catch blocks (should be `e`)
- Logger configuration has syntax error in line 6 (extra parenthesis)
