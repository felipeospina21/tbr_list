export async function withRetry<T>(
	operation: () => Promise<T>,
	retries = 2,
): Promise<T> {
	try {
		return await operation();
	} catch (error) {
		if (retries > 0) {
			console.warn(
				`Database fetch failed, retrying... (${retries} attempts left)`,
			);
			// Wait 500ms before trying again
			await new Promise((resolve) => setTimeout(resolve, 500));
			return withRetry(operation, retries - 1);
		}
		throw error;
	}
}
