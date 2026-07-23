import { AppError } from "./AppError";

export class ReadingListNotFoundError extends AppError {
	constructor() {
		super("Reading list not found", 404);
	}
}
