import type { NextAuthConfig } from "next-auth";

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
  },
  providers: [], // Configured with credentials and db in auth.ts
} satisfies NextAuthConfig;

