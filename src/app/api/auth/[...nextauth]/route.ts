import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { getAuthOptions } from "@/auth";

type NextAuthRouteContext = {
	params:
		| {
				nextauth: string[];
		  }
		| Promise<{
				nextauth: string[];
		  }>;
};

export function GET(request: NextRequest, context: NextAuthRouteContext) {
	return NextAuth(request, context, getAuthOptions());
}

export function POST(request: NextRequest, context: NextAuthRouteContext) {
	return NextAuth(request, context, getAuthOptions());
}
