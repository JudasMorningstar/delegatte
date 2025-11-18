import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Delegatte",
  slug: "delegatte",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",

  // App scheme for deep linking
  scheme: "delegatte",

  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  // iOS Configuration
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.delegatte.app",
    // Associated domains for universal links (optional, for production)
    associatedDomains: [
      // 'applinks:yourdomain.com'
    ],
  },

  // Android Configuration
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.delegatte.app",
    // Intent filters for deep linking
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "delegatte",
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },

  // Web Configuration
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },

  // Expo Router
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/splash.png",
        imageWidth: 200,
      },
    ],
  ],

  // Enable typed routes
  experiments: {
    typedRoutes: true,
  },

  // Environment variables accessible via Constants.expoConfig.extra
  extra: {
    // Site URL - your backend/web app URL
    EXPO_PUBLIC_SITE_URL:
      process.env.EXPO_PUBLIC_SITE_URL || "http://localhost:3000",

    // Convex URL
    EXPO_PUBLIC_CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,

    // OAuth (if needed later)
    EXPO_PUBLIC_GITHUB_CLIENT_ID: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,

    // EAS Project ID (if using EAS)
    eas: {
      projectId: process.env.EAS_PROJECT_ID || "your-project-id-here",
    },
  },

  // Update configuration
  updates: {
    fallbackToCacheTimeout: 0,
  },

  // Asset bundling
  assetBundlePatterns: ["**/*"],
});
