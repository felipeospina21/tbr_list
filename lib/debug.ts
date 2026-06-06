const IS_DEV = process.env.NODE_ENV === "development";

export function debugComponentAttrs(name: string) {
	return IS_DEV ? { "data-component": name } : {};
}

export function debugRootClassName() {
	return IS_DEV ? "debug-component-labels" : "";
}
