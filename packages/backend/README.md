# Backend Shared Package ("backed")

This package contains the backend logic for the monorepo. It is structured as a shared workspace package and includes the self‑hosted Convex instance configured with **Better‑Auth**, following the official integration guide for **TanStack Start**.

## 📁 Project Structure

```
backed/
  convex/
    _generated/
    betterAuth/
    emails/
      email.tsx
    auth.config.ts
    auth.ts
    convex.config.ts
    http.ts
    polyfills.ts
    projectMembers.ts
    projects.ts
    schema.ts
    tasks.ts
  package.json
  README.md (this file)
  tsconfig.json
  .env.local
```

backed/
convex/
convex.json
schema.ts
functions/
http/
auth/
package.json
README.md (this file)

````

### **`convex/`**
This directory contains all Convex‑related backend logic:
- **Self‑hosted Convex instance configuration**
- **Better‑Auth integration** using the official guide
- Database schema and mutations
- HTTP routes
- Server functions

> Integration reference: https://convex-better-auth.netlify.app/framework-guides/tanstack-start

---

## 🚀 Features
- **Self‑hosted Convex** — full control over your backend runtime.
- **Better‑Auth Integration** — authentication handled entirely within the `convex/` folder.
- **Shared package** in a monorepo — accessible by both web and mobile applications.
- **Typed APIs** — all functions and routes fully typed and shared across the repo.

---

## 🔧 Setup

### 1. Install dependencies
From the monorepo root:

```bash
turbo install
````

Or using your workspace package manager:

```bash
pnpm install
```

### 2. Configure Convex

Ensure your `.env` contains:

```
CONVEX_DEPLOYMENT=your-self-hosted-url
CONVEX_AUTH_PRIVATE_KEY=...
BETTER_AUTH_SECRET=...
```

> These environment variables are required by Better‑Auth and Convex server functions.

### 3. Run Convex locally

Inside the package:

```bash
pnpm convex dev
```

Or from the monorepo root:

```bash
pnpm --filter backed convex dev
```

---

## 🔐 Better‑Auth Integration

The auth setup lives entirely inside the `convex/betterAuth/` directory, following the Better-Auth + Convex integration pattern. and follows the official TanStack Start guide.

Includes:

- Better-Auth server configuration (`convex/betterAuth/*`)
- Auth routes auto-registered via Convex
- Session and token validation helpers

Your frontend apps can consume authentication via the Convex client as usual. can consume authentication via Convex‑generated client APIs.

---

## 🛠 Development Notes

- The package is designed to be **framework‑agnostic** — it works with Next.js, TanStack Start, Expo, etc.
- Make sure changes to Convex are followed by running `npx convex codegen` (handled automatically during dev).
- Keep schemas updated to ensure type‑safe calls throughout the monorepo.

---

## 📡 Deployment

For self‑hosting Convex, ensure you:

1. Push your Convex config and functions via your CI or manually
2. Keep environment variables consistent between local and production
3. Validate your auth configuration before going live
