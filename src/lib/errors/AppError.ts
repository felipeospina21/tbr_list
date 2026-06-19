export class AppError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
		public readonly code: string = "BAD_REQUEST",
	) {
		super(message);
		// Maintains proper stack trace for built-in Vercel/Node debugging
		this.name = this.constructor.name;
	}
}
