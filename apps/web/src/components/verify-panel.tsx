import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@merklepic/ui/components/dialog";
import { cn } from "@merklepic/ui/lib/utils";
import type { BlobMetadata } from "@shelby-protocol/sdk/browser";
import { toast } from "sonner";
import { formatBytes, formatDate } from "./image-card";

function blobMerkleRootToHex(root: Uint8Array): string {
	return Array.from(root)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

function truncateHash(hex: string, chars = 16): string {
	if (hex.length <= chars * 2 + 3) return hex;
	return `${hex.slice(0, chars)}...${hex.slice(-chars)}`;
}

interface VerifyPanelProps {
	blob: BlobMetadata;
	walletAddress: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function VerifyPanel({ blob, open, onOpenChange }: VerifyPanelProps) {
	const merkleHex = blobMerkleRootToHex(blob.blobMerkleRoot);
	const isVerified = blob.isWritten;

	function handleCopyHash() {
		navigator.clipboard
			.writeText(merkleHex)
			.then(() => toast.success("Merkle root copied!"))
			.catch(() => toast.error("Failed to copy hash"));
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[3px] border-border shadow-[4px_4px_0_0_oklch(0_0_0_/_60%)] sm:max-w-sm">
				<DialogHeader>
					<DialogTitle className="font-pixel text-[10px] text-foreground tracking-wider">
						VERIFY IMAGE
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					{/* Verified status badge */}
					<div
						className={cn(
							"flex items-center gap-2 border-[2px] px-3 py-2",
							isVerified
								? "border-[oklch(0.55_0.15_145)] bg-[oklch(0.55_0.15_145)]/10"
								: "border-border bg-muted/40",
						)}
					>
						<span
							className={cn(
								"inline-block size-2",
								isVerified
									? "bg-[oklch(0.55_0.15_145)] shadow-[0_0_6px_oklch(0.55_0.15_145)]"
									: "bg-muted-foreground",
							)}
						/>
						<span
							className={cn(
								"font-pixel text-[7px] tracking-wider",
								isVerified
									? "text-[oklch(0.55_0.15_145)]"
									: "text-muted-foreground",
							)}
						>
							{isVerified
								? "VERIFIED ON SHELBY NETWORK"
								: "PENDING VERIFICATION"}
						</span>
					</div>

					{/* Merkle Root */}
					<div className="flex flex-col gap-1.5">
						<p className="font-pixel text-[7px] text-muted-foreground tracking-wider">
							MERKLE ROOT
						</p>
						<div className="flex items-center gap-2">
							<code
								className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-['JetBrains_Mono'] text-[9px] text-foreground"
								title={merkleHex}
							>
								{truncateHash(merkleHex)}
							</code>
							<button
								type="button"
								onClick={handleCopyHash}
								className="shrink-0 border-[2px] border-border px-1.5 py-0.5 font-pixel text-[6px] text-muted-foreground transition-colors hover:border-accent-brand hover:text-accent-brand"
							>
								COPY
							</button>
						</div>
					</div>

					{/* Meta info grid */}
					<div className="grid grid-cols-2 gap-x-4 gap-y-2">
						<InfoRow label="UPLOADED" value={formatDate(blob.creationMicros)} />
						<InfoRow
							label="EXPIRES"
							value={formatDate(blob.expirationMicros)}
						/>
						<InfoRow label="SIZE" value={formatBytes(blob.size)} />
						<InfoRow
							label="OWNER"
							value={`${blob.owner.toString().slice(0, 6)}...`}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="font-pixel text-[6px] text-muted-foreground tracking-wider">
				{label}
			</span>
			<span className="font-mono text-[9px] text-foreground">{value}</span>
		</div>
	);
}
