# Better Auth + Convex Setup Guide

## Overview

This setup uses Better Auth with Convex as the database adapter in a monorepo with TanStack Start (web) and Expo (mobile).

## Architecture

- **Shared Package** (`packages/backend`): Contains Convex schema, auth configuration, and shared client
- **Web App** (`apps/dashboard`): Hosts the auth API endpoints and web interface
- **Mobile App** (`apps/mobile`): Calls the web app's auth endpoints

## Installation Steps

### 1. Install Dependencies

```bash
# Root
pnpm install

# Backend package
cd packages/backend
pnpm install

# Web app
cd ../../apps/dahboard
pnpm install better-auth

# Mobile app
cd ../mobile
pnpm install expo-web-browser expo-auth-session expo-secure-store
```

### 2. Setup Convex

```bash
cd packages/backend

# Login to Convex
npx convex login

# Initialize and deploy
npx convex dev
```

This will:

- Create a new Convex project
- Generate the schema
- Give you a `CONVEX_URL`

### 3. Generate Auth Secret

```bash
openssl rand -base64 32
```

### 4. Configure Environment Variables

#### `packages/backend/.env`

```bash
CONVEX_DEPLOYMENT=your-deployment-name
CONVEX_URL=https://your-convex-url.convex.cloud
```

#### `apps/web/.env`

```bash
CONVEX_URL=https://your-convex-url.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud

BETTER_AUTH_SECRET=your-generated-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

WEB_URL=http://localhost:3000

# Add OAuth credentials if using
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

#### `apps/mobile/.env`

```bash
EXPO_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
EXPO_PUBLIC_BETTER_AUTH_URL=http://localhost:3000  # Or your deployed web URL
```

### 5. Update Mobile App Scheme

In `apps/mobile/app.json`, update:

```json
{
  "expo": {
    "scheme": "yourapp", // Change this
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp" // Change this
    },
    "android": {
      "package": "com.yourcompany.yourapp" // Change this
    }
  }
}
```

Also update the scheme in `apps/mobile/lib/oauth.ts`:

```typescript
const redirectUri = makeRedirectUri({
  scheme: "yourapp", // Must match app.json
  path: "auth/callback",
});
```

### 6. OAuth Provider Setup (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - Web: `http://localhost:3000/api/auth/callback/google`
   - Mobile: `yourapp://auth/callback` (your custom scheme)

#### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth app
3. Add callback URL: `http://localhost:3000/api/auth/callback/github`

#### Apple OAuth (for iOS)

1. Go to Apple Developer Portal
2. Create Sign in with Apple capability
3. Configure service ID and return URLs

### 7. Start Development

```bash
# Terminal 1: Backend (Convex)
cd packages/backend
pnpm dev

# Terminal 2: Web app
cd apps/web
pnpm dev

# Terminal 3: Mobile app
cd apps/mobile
pnpm start
```

## Usage Examples

### Web App - Sign Up Page

```typescript
// apps/web/app/routes/signup.tsx
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (result.data) {
      router.navigate({ to: "/dashboard" });
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>

      <button onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}
```

### Web App - Protected Route

```typescript
// apps/web/app/routes/dashboard.tsx
import { useSession } from "../lib/auth-client";
import { redirect } from "@tanstack/react-router";

export default function Dashboard() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) {
    redirect({ to: "/login" });
    return null;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### Mobile App - Sign In Screen

```typescript
// apps/mobile/app/login.tsx
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "../lib/auth-client";
import { signInWithOAuth } from "../lib/oauth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.data) {
      router.replace("/home");
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithOAuth("google");
    if (result) {
      router.replace("/home");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
    </View>
  );
}
```

### Mobile App - Protected Screen

```typescript
// apps/mobile/app/home.tsx
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useSession, signOut } from "../lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {session.user.name}!</Text>
      <Text>Email: {session.user.email}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
```

### Using Convex with Auth

```typescript
// apps/web/convex/messages.ts (or mobile)
import { query, mutation } from "@repo/backend/convex/_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    // Get current user from session
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Query user's messages
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();
  },
});

export const send = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("messages", {
      text: args.text,
      userId: identity.subject,
      createdAt: Date.now(),
    });
  },
});
```

## Production Deployment

### 1. Deploy Convex

```bash
cd packages/backend
npx convex deploy
```

### 2. Update Environment Variables

- Update `CONVEX_URL` in all apps to production URL
- Update `BETTER_AUTH_URL` to your deployed web app URL
- Update `EXPO_PUBLIC_BETTER_AUTH_URL` to your deployed web app URL

### 3. Configure OAuth Redirect URIs

Update OAuth providers with production URLs:

- Web: `https://yourdomain.com/api/auth/callback/{provider}`
- Mobile: `yourapp://auth/callback`

### 4. Setup Deep Linking for Mobile

- iOS: Configure Associated Domains in Xcode
- Android: Configure App Links in AndroidManifest.xml

## Troubleshooting

### Mobile OAuth not working

- Ensure `scheme` in `app.json` matches the scheme in `oauth.ts`
- Check that redirect URIs are configured correctly in OAuth providers
- Verify `expo-web-browser` is properly installed

### Session not persisting on mobile

- Check that `expo-secure-store` is installed
- Verify the storage adapter in `apps/mobile/lib/auth-client.ts`

### CORS errors

- Add your mobile app scheme to `trustedOrigins` in auth config
- For development, you may need to add `exp://` to trusted origins

### Convex queries failing

- Ensure you're passing the session token to Convex client
- Check that user is authenticated before making queries

## Additional Resources

- [Better Auth Documentation](https://better-auth.com)
- [Convex Documentation](https://docs.convex.dev)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Expo Documentation](https://docs.expo.dev)
