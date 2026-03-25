import { cn } from "@merklepic/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { BalanceDisplay } from "./balance-display";
import { WalletConnectButton } from "./wallet-connect-button";

const NAV_LINKS = [
	{ to: "/", label: "Upload" },
	{ to: "/gallery", label: "My Snaps" },
] as const;

export default function Header() {
	return (
		<header className="border-border border-b-[3px] bg-background">
			<div className="flex items-center justify-between px-4 py-2">
				{/* Logo */}
				<span className="font-pixel text-accent-brand text-base tracking-widest">
					MERKLEPIC
				</span>

				{/* Nav */}
				<nav className="flex gap-6">
					{NAV_LINKS.map(({ to, label }) => (
						<Link
							key={to}
							to={to}
							className={cn(
								"text-muted-foreground text-sm transition-colors hover:text-foreground",
								"[&.active]:text-accent-brand [&.active]:underline [&.active]:underline-offset-4",
							)}
						>
							{label}
						</Link>
					))}
				</nav>

				{/* Right side: balances + wallet */}
				<div className="flex items-center gap-3">
					<BalanceDisplay />
					<WalletConnectButton />
				</div>
			</div>
		</header>
	);
}
