import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@merklepic/ui/components/dropdown-menu";
import { useState } from "react";
import { WalletSelectorModal } from "./wallet-selector-modal";

function truncateAddress(address: string): string {
	if (address.length <= 12) return address;
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletConnectButton() {
	const { connected, account, disconnect } = useWallet();
	const [modalOpen, setModalOpen] = useState(false);

	if (!connected || !account) {
		return (
			<>
				<button
					type="button"
					onClick={() => setModalOpen(true)}
					className="inline-flex h-8 items-center border-2 border-accent-brand bg-background px-2.5 font-pixel text-[10px] text-accent-brand tracking-wider transition-colors hover:bg-accent-brand hover:text-primary-foreground"
				>
					CONNECT WALLET
				</button>
				<WalletSelectorModal open={modalOpen} onOpenChange={setModalOpen} />
			</>
		);
	}

	const displayAddress = account.address
		? truncateAddress(account.address.toString())
		: "Unknown";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 border-2 border-accent-brand bg-background px-2.5 font-mono text-foreground text-xs transition-colors hover:border-accent-brand/70 hover:bg-muted">
				{/* green connected dot */}
				<span className="inline-block size-2 rounded-none bg-accent-brand shadow-[0_0_4px_var(--accent-brand)]" />
				{displayAddress}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="min-w-36 border border-border"
			>
				<DropdownMenuItem
					onClick={disconnect}
					className="font-mono text-destructive text-xs focus:text-destructive"
				>
					DISCONNECT
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
