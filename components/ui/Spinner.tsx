import { Loader2Icon } from "lucide-react";
import type { FC } from "react";

import { cn } from "@/lib/utils";
import styles from "./Spinner.module.css";

interface SpinnerProps extends React.ComponentProps<"svg"> {}

const Spinner: FC<SpinnerProps> = ({ className, ...props }) => {
	return (
		<Loader2Icon
			role="status"
			aria-label="Loading"
			className={cn(styles.spinner, className)}
			{...props}
		/>
	);
};

export { Spinner };
