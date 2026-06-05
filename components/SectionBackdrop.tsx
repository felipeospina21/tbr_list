import { cn } from "@/lib/utils";

export function SectionBackdrop() {
	return (
		<>
			<BackdropAtmosphere />
			<BackdropTexture />
		</>
	);
}

type BackdropLayerProps = {
	className?: string;
};

export function BackdropAtmosphere({ className }: BackdropLayerProps) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(246,211,173,0.18)_0%,_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(151,171,134,0.16)_0%,_transparent_32%),linear-gradient(180deg,_#111715_0%,_#0d1110_100%)]",
				className,
			)}
		/>
	);
}

export function BackdropTexture({ className }: BackdropLayerProps) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:52px_52px]",
				className,
			)}
		/>
	);
}
