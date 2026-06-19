import type { Account, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { initializeUserAccount } from "./db/initializeUserAccount";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export function getAuthOptions(): NextAuthOptions {
	if (!googleClientId || !googleClientSecret) {
		throw new Error(
			"Missing Google auth env vars. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
		);
	}

	if (!nextAuthSecret) {
		throw new Error(
			"Missing NextAuth secret. Set NEXTAUTH_SECRET or AUTH_SECRET.",
		);
	}

	return {
		secret: nextAuthSecret,
		session: {
			strategy: "jwt",
		},
		pages: {
			signIn: "/login",
		},
		providers: [
			GoogleProvider({
				clientId: googleClientId,
				clientSecret: googleClientSecret,
			}),
		],
		callbacks: {
			async jwt({ token, account }) {
				if (account?.provider && account.providerAccountId) {
					token.sub = getPrefixedUserId(account);
				}

				return token;
			},
			async session({ session, token }) {
				if (session.user && token.sub) {
					session.user.id = token.sub;
				}

				return session;
			},
			async signIn({ user, account }) {
				if (user.id && account?.provider && account.providerAccountId) {
					await initializeUserAccount(getPrefixedUserId(account));
				} else if (user.id) {
					await initializeUserAccount(user.id);
				}
				return true;
			},
		},
	};
}

function getPrefixedUserId(account: Account) {
	return `${account.provider}:${account.providerAccountId}`;
}
