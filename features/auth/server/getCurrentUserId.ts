import { getServerSession } from "next-auth/next";
import { getAuthOptions } from "@/auth";

export async function getCurrentUserId() {
	const session = await getServerSession(getAuthOptions());
	return session?.user?.id ?? null;
}
