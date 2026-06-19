import { AppError } from "@/lib/errors/AppError";

export function errorResponse(error: unknown) {
	if (error instanceof AppError) {
		return Response.json(
			{
				message: error.message,
			},
			{
				status: error.statusCode,
			},
		);
	}

	console.error(error);

	return Response.json(
		{
			message: "Internal server error",
		},
		{
			status: 500,
		},
	);
}
