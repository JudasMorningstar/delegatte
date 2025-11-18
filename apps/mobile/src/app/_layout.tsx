import { StrictMode, useEffect } from "react";
import { useColorScheme } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient, useConvexAuth } from "convex/react";

import "../styles.css";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL ||
    `https://convex-site.kalulaindustries.co.za`,
  {
    unsavedChangesWarning: false,
  },
);
// This is the main layout of the app
// It wraps your pages with the providers they need
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "sign-in";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to sign-in if not authenticated
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, router, segments]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#c03484",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#09090B" : "#FFFFFF",
        },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <StrictMode>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <RootLayoutNav />
        <StatusBar />
      </ConvexBetterAuthProvider>
    </StrictMode>
  );
}
