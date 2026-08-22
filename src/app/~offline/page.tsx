"use client";

import Link from "next/link";

export default function OfflinePage() {
	const handleRetry = () => {
		window.location.reload();
	};

	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-[#0b0c0e] text-[#d1d5db] px-6 py-12">
			<div className="max-w-md w-full text-center space-y-8">
				<div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
					<span className="text-amber-500 text-lg">✦</span>
				</div>

				<div className="space-y-3">
					<h1 className="font-serif text-3xl tracking-tight text-[#f3f4f6]">
						A Quiet Moment
					</h1>
					<p className="text-sm font-sans text-stone-400 leading-relaxed max-w-xs mx-auto">
						You are offline. The connection to the library is resting, but your books are waiting.
					</p>
				</div>

				<div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
					<button
						type="button"
						onClick={handleRetry}
						className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold tracking-wider uppercase bg-amber-500 hover:bg-amber-600 text-[#0d0e11] rounded transition-colors duration-200 cursor-pointer"
					>
						Retry Connection
					</button>
					<Link
						href="/"
						className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold tracking-wider uppercase border border-stone-800 hover:border-stone-700 text-stone-300 rounded transition-colors duration-200"
					>
						Go Home
					</Link>
				</div>
			</div>
		</main>
	);
}
