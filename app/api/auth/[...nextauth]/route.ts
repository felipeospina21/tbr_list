import type { NextRequest } from "next/server";
import NextAuth from "next-auth";

import { getAuthOptions } from "@/auth";

export function GET(request: NextRequest, context: any) {
	return NextAuth(request, context, getAuthOptions());
}

export function POST(request: NextRequest, context: any) {
	return NextAuth(request, context, getAuthOptions());
}
