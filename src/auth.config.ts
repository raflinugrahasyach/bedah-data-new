import type { NextAuthConfig } from "next-auth";

// Guard against legacy localhost env variables on cloud/production runtime
if (typeof process !== "undefined" && process.env) {
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    !!process.env.VERCEL_URL;

  if (isProd) {
    const prodOrigin =
      (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
        : null) ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      "https://bedah-data-new.vercel.app";

    if (process.env.AUTH_URL && process.env.AUTH_URL.includes("localhost")) {
      process.env.AUTH_URL = prodOrigin;
    }
    if (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.includes("localhost")) {
      process.env.NEXTAUTH_URL = prodOrigin;
    }
  }
}

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.userType = (user as any).userType;
        token.isDemo = (user as any).isDemo;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        (session.user as any).role = token.role;
        (session.user as any).userType = token.userType;
        (session.user as any).isDemo = token.isDemo;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const isProd =
        process.env.NODE_ENV === "production" ||
        process.env.VERCEL === "1" ||
        !!process.env.VERCEL_URL;

      // Determine robust base origin - NEVER allow localhost in production or Vercel
      let safeOrigin = baseUrl;
      if (isProd || safeOrigin.includes("localhost")) {
        safeOrigin =
          (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
            ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
            : null) ||
          (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : null) ||
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
          (isProd ? "https://bedah-data-new.vercel.app" : safeOrigin);
      }

      // If url is a relative path (e.g. "/login", "/dashboard", "/admin")
      if (url.startsWith("/")) {
        return `${safeOrigin}${url}`;
      }

      // If url is absolute, check its host and remove localhost in production
      try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("localhost")) {
          if (isProd) {
            return `${safeOrigin}${parsed.pathname}${parsed.search}`;
          }
        }
        if (parsed.origin === safeOrigin || (safeOrigin && url.startsWith(safeOrigin))) {
          return url;
        }
        if (parsed.hostname.includes("bedah-data-new.vercel.app")) {
          return url;
        }
      } catch {}

      return safeOrigin;
    },
  },
  providers: [], // Configured with credentials and db in auth.ts
} satisfies NextAuthConfig;

