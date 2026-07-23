import { UseQueryOptions } from "@tanstack/react-query";

export type SafeQueryOptions<TQueryFnData = unknown, TError = Error> = Pick<
	UseQueryOptions<TQueryFnData, TError>,
	"enabled" | "staleTime" | "gcTime" | "refetchOnWindowFocus"
>;
