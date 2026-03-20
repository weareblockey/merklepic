import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAptosBalance } from "../hooks/use-aptos-balance";
import { useShelbyUsdBalance } from "../hooks/use-shelby-usd-balance";

export function BalanceDisplay() {
	const { connected } = useWallet();
	const { data: aptBalance } = useAptosBalance();
	const { data: shelbyUsdBalance } = useShelbyUsdBalance();

	if (!connected) return null;

	return (
		<div className="flex items-center gap-3 font-mono text-xs">
			{aptBalance !== undefined && (
				<span className="text-muted-foreground">
					<span className="text-accent-brand">{aptBalance.toFixed(4)}</span>
					{" APT"}
					{aptBalance === 0 && (
						<a
							href="https://aptos.dev/en/network/faucet"
							target="_blank"
							rel="noopener noreferrer"
							className="ml-1 text-accent-info underline hover:text-foreground"
						>
							[faucet]
						</a>
					)}
				</span>
			)}
			{shelbyUsdBalance !== undefined && (
				<span className="text-muted-foreground">
					<span className="text-accent-warning">
						{shelbyUsdBalance.toFixed(2)}
					</span>
					{" SUSD"}
					{shelbyUsdBalance === 0 && (
						<a
							href="https://faucet.shelby.xyz"
							target="_blank"
							rel="noopener noreferrer"
							className="ml-1 text-accent-info underline hover:text-foreground"
						>
							[faucet]
						</a>
					)}
				</span>
			)}
		</div>
	);
}
