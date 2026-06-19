import { AppError } from "@/lib/errors/AppError";

type ApiResponse<T> = {
	success: true;
	data: T;
	meta?: Record<string, unknown>;
};

type ApiErrorResponse = {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
};

export class ApiResponseHelper {
	static success<T>(data: T, status = 200, meta?: Record<string, unknown>) {
		const body: ApiResponse<T> = {
			success: true,
			data,
			...(meta && { meta }),
		};
		return Response.json(body, { status });
	}

	static error(
		message: string,
		code = "BAD_REQUEST",
		status = 400,
		details?: unknown,
	) {
		const body: ApiErrorResponse = {
			success: false,
			error: { code, message, details },
		};
		return Response.json(body, { status });
	}

	static handle(error: unknown) {
		if (error instanceof AppError) {
			return ApiResponseHelper.error(
				error.message,
				error.code,
				error.statusCode,
			);
		}

		// Log the unhandled/unexpected system errors for server debugging
		console.error("Unhandled API Error:", error);

		// Return a safe, clean fallback envelope to the client
		return ApiResponseHelper.error(
			"Internal server error",
			"INTERNAL_SERVER_ERROR",
			500,
		);
	}
}
