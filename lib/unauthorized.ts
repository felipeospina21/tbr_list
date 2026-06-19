export const unauthorized = () => {
	return Response.json({ error: "Unauthorized" }, { status: 401 });
};
