import { cn } from "@merklepic/ui/lib/utils";
import type { BlobMetadata } from "@shelby-protocol/sdk/browser";
import { shelbyClient } from "../lib/shelby-client";

function getBlobUrl(blob: BlobMetadata): string {
	const owner = blob.owner.toString();
	return `${shelbyClient.baseUrl}/v1/blobs/${owner}/${blob.blobNameSuffix}`;
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(microseconds: number): string {
	const ms = Math.floor(microseconds / 1000);
	return new Date(ms).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function getDaysUntilExpiry(expirationMicros: number): number {
	const nowMs = Date.now();
	const expiryMs = Math.floor(expirationMicros / 1000);
	return Math.floor((expiryMs - nowMs) / (1000 * 60 * 60 * 24));
}

function getStatus(blob: BlobMetadata): "PENDING" | "LIVE" | "EXPIRED" {
	// Compare raw timestamps — floored days misclassifies <24h remaining as expired
	const nowMicros = Date.now() * 1000;
	if (blob.expirationMicros <= nowMicros) return "EXPIRED";
	if (!blob.isWritten) return "PENDING";
	return "LIVE";
}

function truncateName(name: string, max = 24): string {
	if (name.length <= max) return name;
	const ext = name.lastIndexOf(".");
	if (ext > 0 && name.length - ext <= 6) {
		const baseTrunc = max - (name.length - ext) - 3;
		return `${name.slice(0, baseTrunc)}...${name.slice(ext)}`;
	}
	return `${name.slice(0, max - 3)}...`;
}

interface ImageCardProps {
	blob: BlobMetadata;
	walletAddress: string;
	onCopyLink: (blob: BlobMetadata) => void;
	onVerify: (blob: BlobMetadata) => void;
	onDelete: (blob: BlobMetadata) => void;
}

export function ImageCard({
	blob,
	onCopyLink,
	onVerify,
	onDelete,
}: ImageCardProps) {
	const status = getStatus(blob);
	const daysLeft = getDaysUntilExpiry(blob.expirationMicros);
	const isNearExpiry = status !== "EXPIRED" && daysLeft >= 0 && daysLeft < 7;
	const blobUrl = getBlobUrl(blob);
	const displayName =
		blob.blobNameSuffix || blob.name?.toString() || "untitled";

	const statusColors: Record<typeof status, string> = {
		PENDING: "bg-[oklch(0.7_0.15_85)] text-black",
		LIVE: "bg-[oklch(0.55_0.15_145)] text-white",
		EXPIRED: "bg-destructive text-destructive-foreground",
	};

	return (
		<article
			className={cn(
				"group border-[3px] border-border bg-card shadow-[4px_4px_0_0_oklch(0_0_0_/_60%)]",
				"transition-transform duration-0 hover:-translate-y-0.5",
				isNearExpiry && "border-[oklch(0.7_0.15_85)]",
			)}
		>
			{/* Thumbnail 4:3 */}
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
				{!blob.isWritten ? (
					/* PENDING spinner overlay */
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80">
						<div className="size-6 animate-spin border-2 border-accent-brand border-t-transparent" />
						<span className="font-pixel text-[6px] text-muted-foreground">
							PROCESSING...
						</span>
					</div>
				) : (
					<img
						src={blobUrl}
						alt={displayName}
						loading="lazy"
						className="h-full w-full object-cover"
						onError={() => console.error("Image load failed:", blobUrl)}
					/>
				)}
			</div>

			{/* Card body */}
			<div className="flex flex-col gap-2 p-3">
				{/* Name */}
				<p
					className="font-[VT323] text-foreground text-sm leading-none"
					title={displayName}
				>
					{truncateName(displayName)}
				</p>

				{/* Meta row: expiry + status badge */}
				<div className="flex items-center justify-between gap-2">
					<span
						className={cn(
							"font-mono text-[9px] text-muted-foreground",
							isNearExpiry && "text-[oklch(0.7_0.15_85)]",
						)}
					>
						EXP: {formatDate(blob.expirationMicros)}
						{isNearExpiry && " !!"}
					</span>
					<span
						className={cn(
							"px-1.5 py-0.5 font-pixel text-[6px] uppercase leading-none",
							statusColors[status],
						)}
					>
						{status}
					</span>
				</div>

				{/* File size */}
				<p className="font-mono text-[9px] text-muted-foreground">
					{formatBytes(blob.size)}
				</p>

				{/* Actions */}
				<div className="flex flex-wrap gap-1 pt-1">
					<ActionButton label="COPY LINK" onClick={() => onCopyLink(blob)} />
					<ActionButton label="VERIFY" onClick={() => onVerify(blob)} />
					<ActionButton
						label="DELETE"
						onClick={() => onDelete(blob)}
						variant="destructive"
					/>
				</div>
			</div>
		</article>
	);
}

interface ActionButtonProps {
	label: string;
	onClick: () => void;
	variant?: "default" | "destructive";
}

function ActionButton({
	label,
	onClick,
	variant = "default",
}: ActionButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"border-[2px] px-1.5 py-0.5 font-pixel text-[6px] leading-none transition-colors",
				variant === "destructive"
					? "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
					: "border-border text-muted-foreground hover:border-accent-brand hover:text-accent-brand",
			)}
		>
			{label}
		</button>
	);
}

export { formatBytes, formatDate, getBlobUrl };
