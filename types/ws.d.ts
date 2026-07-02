declare module "ws" {
	class WebSocket {
		readonly readyState: number;
		binaryType: string;

		constructor(address: string | URL, protocols?: string | string[]);
		close(code?: number, reason?: string): void;
		send(data: unknown): void;
		addEventListener(
			type: "open" | "message" | "close" | "error",
			listener: (this: WebSocket, ev: unknown) => unknown,
			options?: unknown,
		): void;
	}

	export default WebSocket;
}
