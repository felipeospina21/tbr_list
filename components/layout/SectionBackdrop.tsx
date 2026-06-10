import { cn } from "@/lib/utils";
import styles from "./SectionBackdrop.module.css";

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
		<div aria-hidden="true" className={cn(styles.atmosphere, className)} />
	);
}

export function BackdropTexture({ className }: BackdropLayerProps) {
	return <div aria-hidden="true" className={cn(styles.texture, className)} />;
}
