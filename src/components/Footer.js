"use client";

import Link from "next/link";
import { InstagramLogo, LinkedinLogo } from "phosphor-react";

export default function Footer() {
	return (
		<footer className="relative w-full mt-24 border-t border-[var(--content_brand)] bg-[var(--background)]">
			{/* Decorative SVG background */}
			<div className="absolute inset-0 -z-10 opacity-40" style={{ pointerEvents: "none" }}>
				<svg
					className="w-full h-full"
					viewBox="0 0 1148 320"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<ellipse
						cx="250"
						cy="160"
						rx="220"
						ry="120"
						transform="rotate(-12 250 160)"
						stroke="var(--content_brand)"
					/>
					<ellipse
						cx="950"
						cy="160"
						rx="220"
						ry="120"
						transform="rotate(8 950 160)"
						stroke="var(--content_brand)"
					/>
				</svg>
			</div>

			{/* Content */}
			<div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div className="text-[var(--content_dark)]">
					<p className="text-base md:text-lg">Designed with care. Built for impact.</p>
					<p className="text-sm mt-1">© {new Date().getFullYear()} JCP</p>
				</div>

				<div className="flex items-center gap-6">
					<Link
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--content_brand)] text-[var(--content_brand)] hover:bg-[var(--bg_box_neutral)] transition"
					>
						<InstagramLogo size={20} weight="bold" />
					</Link>
					<Link
						href="https://linkedin.com"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
						className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--content_brand)] text-[var(--content_brand)] hover:bg-[var(--bg_box_neutral)] transition"
					>
						<LinkedinLogo size={20} weight="bold" />
					</Link>
				</div>

				<nav className="flex items-center gap-4 text-sm">
					<Link href="/privacy" className="underline underline-offset-4 text-[var(--content_dark)] hover:text-[var(--content_brand)]">
						Privacy
					</Link>
					<span className="text-[var(--content_dark)]">•</span>
					<Link href="/cookies" className="underline underline-offset-4 text-[var(--content_dark)] hover:text-[var(--content_brand)]">
						Cookies
					</Link>
				</nav>
			</div>
		</footer>
	);
}
