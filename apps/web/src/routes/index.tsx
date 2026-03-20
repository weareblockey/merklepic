import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { createFileRoute } from "@tanstack/react-router";
import { DatabaseIcon, Share2Icon, ShieldCheckIcon } from "lucide-react";
import { FaucetBanner } from "../components/faucet-banner";
import { UploadZone } from "../components/upload-zone";
import { useAptosBalance } from "../hooks/use-aptos-balance";
import { useShelbyUsdBalance } from "../hooks/use-shelby-usd-balance";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const FEATURES = [
	{
		icon: ShieldCheckIcon,
		label: "Tamper-Proof",
		desc: "Merkle-verified integrity",
	},
	{
		icon: DatabaseIcon,
		label: "Decentralized",
		desc: "Shelby blob storage",
	},
	{
		icon: Share2Icon,
		label: "Shareable",
		desc: "Permanent on-chain link",
	},
] as const;

function HomeComponent() {
	const { connected } = useWallet();
	const { data: aptBalance, isSuccess: aptLoaded } = useAptosBalance();
	const { data: shelbyUsdBalance, isSuccess: susdLoaded } =
		useShelbyUsdBalance();

	// Only show faucet banner after balance query resolves to avoid flicker
	const hasZeroApt = connected && aptLoaded && aptBalance === 0;
	const hasZeroSusd = connected && susdLoaded && shelbyUsdBalance === 0;

	return (
		<main className="flex flex-col items-center gap-10 overflow-y-auto px-4 py-10">
			{/* Faucet banner for low/zero balances */}
			{(hasZeroApt || hasZeroSusd) && (
				<div className="w-full max-w-[560px]">
					<FaucetBanner
						missingApt={hasZeroApt}
						missingShelbyUSD={hasZeroSusd}
					/>
				</div>
			)}

			{/* Heading */}
			<h1 className="text-center font-pixel text-accent-brand text-base leading-loose tracking-widest">
				UPLOAD YOUR SNAP
			</h1>

			{/* Upload zone */}
			<UploadZone />

			{/* Feature props */}
			<div className="flex w-full max-w-[560px] flex-wrap justify-center gap-4">
				{FEATURES.map(({ icon: Icon, label, desc }) => (
					<div
						key={label}
						className="flex min-w-[140px] flex-1 flex-col items-center gap-2 border-[2px] border-border bg-card p-4 shadow-[4px_4px_0_0_oklch(0_0_0_/_50%)]"
					>
						<Icon size={24} className="text-accent-brand" />
						<span className="text-center font-pixel text-[8px] text-foreground tracking-wider">
							{label}
						</span>
						<span className="text-center font-mono text-[10px] text-muted-foreground">
							{desc}
						</span>
					</div>
				))}
			</div>
		</main>
	);
}
