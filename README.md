# Project Scripts Documentation

This document explains the available npm scripts defined in the `package.json` file.

## Available Scripts

### 1. `build`

```bash
npm run build
```

Runs the build process for all packages using Turborepo.

- Executes: `turbo run build`
- Builds all apps and packages that define a `build` script.
- Used for production builds.

---

### 2. `dev`

```bash
npm run dev
```

Starts the development environment for all packages.

- Executes: `turbo run dev`
- Runs development servers concurrently.
- Watches for file changes.

---

### 3. `start`

```bash
npm run start
```

Alias for the development command.

- Executes: `turbo run dev`
- Typically used to start the application.

---

### 4. `start_db`

```bash
npm run start_db
```

Starts a PostgreSQL database inside a Docker container.

Command executed:

```bash
sudo docker rm -f parking_system && \
sudo docker run \
  --name parking_system \
  -e POSTGRES_PASSWORD=Kireeti@123 \
  -d \
  -p 5432:5432 \
  -v parking_system_data:/var/lib/postgresql/data \
  postgres
```

What it does:

- Removes any existing container named `parking_system`.
- Runs a new PostgreSQL container.
- Sets the database password.
- Exposes port `5432`.
- Persists data using a Docker volume (`parking_system_data`).

---

### 5. `prisma_studio`

```bash
npm run prisma_studio
```

Opens Prisma Studio for database management.

- Changes directory to `packages/db`
- Runs: `npx prisma studio`
- Provides a GUI to view and edit database records.

---

# Notes

- This project uses **Turborepo** for monorepo task orchestration.
- Docker must be installed to run the database script.
- Ensure PostgreSQL port `5432` is not already in use before starting the database.

---

# Typical Development Workflow

1. Start the database:

   ```bash
   npm run start_db
   ```

2. Start development servers:

   ```bash
   npm run dev
   ```

3. Open Prisma Studio (optional):

   ```bash
   npm run prisma_studio
   ```
