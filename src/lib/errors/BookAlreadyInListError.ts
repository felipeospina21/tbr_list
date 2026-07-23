import { AppError } from "./AppError";

export class BookAlreadyInListError extends AppError {
	constructor() {
		super("Book already exists in the reading list", 409);
	}
}
