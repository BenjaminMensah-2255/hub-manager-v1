import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'Asante Hub Login',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@asantehub.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;
                const email = (credentials.email as string).toLowerCase();

                if (!email.endsWith('@asantehub.com')) {
                    throw new Error('Only @asantehub.com emails are allowed');
                }

                try {
                    await dbConnect();

                    // Check if user exists in the Staff directory
                    const user = await Staff.findOne({ email });

                    if (!user) {
                        throw new Error('User not found in Staff Directory');
                    }

                    // For this prototype, we are skipping a real password check since the Staff model
                    // does not have a password field. In a real app, we would verify a hash.
                    // We assume successful generic verification if the user exists.

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        department: user.department,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    // Return null if validation fails
                    return null;
                }
            },
        }),
    ],
});
