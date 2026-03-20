import { useWallet, WalletReadyState } from "@aptos-labs/wallet-adapter-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@merklepic/ui/components/dialog";
import { cn } from "@merklepic/ui/lib/utils";
import { SUPPORTED_WALLETS } from "../lib/supported-wallets";

interface WalletSelectorModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function WalletSelectorModal({
	open,
	onOpenChange,
}: WalletSelectorModalProps) {
	const { connect, wallets } = useWallet();

	function handleConnect(walletName: string) {
		connect(walletName);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-3 border-border bg-card p-0 sm:max-w-xs">
				<DialogHeader className="border-border border-b px-4 py-3">
					<DialogTitle className="font-pixel text-foreground text-xs tracking-widest">
						SELECT WALLET
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col">
					{SUPPORTED_WALLETS.map((supportedWallet) => {
						const adapterWallet = wallets.find(
							(w) => w.name === supportedWallet.name,
						);
						const isInstalled =
							adapterWallet?.readyState === WalletReadyState.Installed;

						return (
							<button
								key={supportedWallet.name}
								type="button"
								onClick={() => {
									if (isInstalled) {
										handleConnect(supportedWallet.name);
									} else {
										window.open(supportedWallet.installUrl, "_blank");
									}
								}}
								className={cn(
									"group flex items-center gap-3 border-border border-b px-4 py-3 text-left transition-colors",
									"last:border-b-0",
									"hover:bg-accent hover:shadow-[inset_0_0_8px_var(--accent-brand)]",
									"focus:bg-accent focus:outline-none",
								)}
							>
								<img
									src={supportedWallet.icon}
									alt={supportedWallet.name}
									className="size-8 shrink-0"
									onError={(e) => {
										(e.currentTarget as HTMLImageElement).style.display =
											"none";
									}}
								/>
								<span className="flex-1 font-medium font-mono text-foreground text-xs">
									{supportedWallet.name}
								</span>
								<span
									className={cn(
										"font-pixel text-[10px] tracking-wide",
										isInstalled
											? "text-accent-brand"
											: "text-muted-foreground underline",
									)}
								>
									{isInstalled ? "CONNECT" : "INSTALL"}
								</span>
							</button>
						);
					})}
				</div>
			</DialogContent>
		</Dialog>
	);
}
