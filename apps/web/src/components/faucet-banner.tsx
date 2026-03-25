import { cn } from "@merklepic/ui/lib/utils";
import { AlertCircleIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface FaucetBannerProps {
	missingApt?: boolean;
	missingShelbyUSD?: boolean;
}

const FAUCETS = {
	apt: "https://aptos.dev/network/faucet",
	shelbyUSD: "https://docs.shelby.xyz/apis/faucet/shelbyusd",
};

export function FaucetBanner({
	missingApt = false,
	missingShelbyUSD = false,
}: FaucetBannerProps) {
	const [dismissed, setDismissed] = useState(false);

	const handleDismiss = useCallback(() => {
		setDismissed(true);
	}, []);

	if (dismissed || (!missingApt && !missingShelbyUSD)) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex items-start gap-3 border-[2px] bg-card p-4 shadow-[2px_2px_0_0_oklch(0_0_0_/_50%)]",
				missingApt || missingShelbyUSD
					? "border-accent-warning"
					: "border-border",
			)}
		>
			<AlertCircleIcon
				size={20}
				className="flex-shrink-0 text-accent-warning"
			/>

			<div className="flex-1">
				<h3 className="font-pixel text-xs text-accent-warning tracking-wider">
					NEED TOKENS?
				</h3>
				<p className="mt-1 text-sm text-muted-foreground">
					Claim from official faucets:
				</p>
				<div className="mt-2 flex flex-col gap-1.5">
					{missingApt && (
						<a
							href={FAUCETS.apt}
							target="_blank"
							rel="noopener noreferrer"
							className="font-mono text-xs text-accent-info underline underline-offset-2 transition-colors hover:text-accent-brand"
						>
							→ APT Faucet
						</a>
					)}
					{missingShelbyUSD && (
						<a
							href={FAUCETS.shelbyUSD}
							target="_blank"
							rel="noopener noreferrer"
							className="font-mono text-xs text-accent-info underline underline-offset-2 transition-colors hover:text-accent-brand"
						>
							→ ShelbyUSD Faucet
						</a>
					)}
				</div>
			</div>

			<button
				type="button"
				onClick={handleDismiss}
				className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
				aria-label="Dismiss banner"
			>
				<XIcon size={16} />
			</button>
		</div>
	);
}
