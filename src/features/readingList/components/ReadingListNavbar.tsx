"use client";

import { LogOut, Menu, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { type FC, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import styles from "./ReadingListNavbar.module.css";

interface ReadingListNavbarProps {
	accountLabel: string;
}

export const ReadingListNavbar: FC<ReadingListNavbarProps> = ({
	accountLabel,
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuId = useId();
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isMenuOpen) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMenuOpen]);

	return (
		<nav className={styles.navbar}>
			<div className={styles.brand}>
				<p className={styles.brandEyebrow}>Reading room</p>
				<p className={styles.brandTitle}>Queue</p>
			</div>

			<div className={styles.menuRoot} ref={menuRef}>
				<Button
					aria-controls={menuId}
					aria-expanded={isMenuOpen}
					aria-haspopup="menu"
					aria-label="Open account menu"
					className={styles.menuButton}
					variant="ghost"
					onClick={() => {
						setIsMenuOpen((current) => !current);
					}}
				>
					<Menu className={styles.menuIcon} aria-hidden="true" />
				</Button>

				{isMenuOpen ? (
					<div className={styles.menuPanel} id={menuId} role="menu">
						<div className={styles.accountSummary}>
							<UserCircle className={styles.accountIcon} aria-hidden="true" />
							<div>
								<p className={styles.accountLabel}>Signed in as</p>
								<p className={styles.accountValue}>{accountLabel}</p>
							</div>
						</div>

						<button
							className={styles.menuItem}
							role="menuitem"
							type="button"
							onClick={() => {
								setIsMenuOpen(false);
								void signOut({ callbackUrl: "/login" });
							}}
						>
							<LogOut className={styles.menuItemIcon} aria-hidden="true" />
							Sign out
						</button>
					</div>
				) : null}
			</div>
		</nav>
	);
};
