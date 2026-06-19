export async function apiFetch<T>(
	url: string,
	options?: RequestInit,
): Promise<T> {
	const res = await fetch(url, options);
	const json = await res.json();

	if (!res.ok) {
		throw json.error;
	}

	return json.data;
}
