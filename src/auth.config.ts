import type { NextAuthConfig } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/');
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            // Admin route protection
            if (nextUrl.pathname.startsWith('/admin')) {
                if (auth?.user?.role !== 'Admin') return false;
            }

            // Basic protection for all non-public routes (simplification)
            // Actually we want to allow login page
            if (isOnLogin) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true; // allow access to login
            }

            // Protect everything else
            if (!isLoggedIn) {
                return false; // Redirect to login
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.department = user.department;
                token.id = user.id!;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.department = token.department;
                session.user.id = token.id;
            }
            return session;
        },
    },
    providers: [], // Configured in auth.ts to avoid edge issues if needed, but for now we put Creds in auth.ts
} satisfies NextAuthConfig;
