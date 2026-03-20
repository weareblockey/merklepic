import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAccountBlobs } from "@shelby-protocol/react";
import type { BlobMetadata } from "@shelby-protocol/sdk/browser";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DeleteConfirmDialog } from "../components/delete-confirm-dialog";
import { ImageCard } from "../components/image-card";
import { LoadingSkeleton } from "../components/loading-skeleton";
import { ShareModal } from "../components/share-modal";
import { VerifyPanel } from "../components/verify-panel";
import { shelbyClient } from "../lib/shelby-client";

export const Route = createFileRoute("/gallery")({
	component: GalleryPage,
});

function GalleryPage() {
	const { connected, account } = useWallet();

	if (!connected || !account) {
		return (
			<main className="flex flex-col items-center justify-center gap-6 py-20">
				<p className="font-pixel text-[10px] text-muted-foreground tracking-wider">
					CONNECT WALLET TO VIEW YOUR SNAPS
				</p>
			</main>
		);
	}

	return <GalleryContent walletAddress={account.address.toString()} />;
}

function GalleryContent({ walletAddress }: { walletAddress: string }) {
	const {
		data: blobs,
		isLoading,
		isError,
		refetch,
	} = useAccountBlobs({
		client: shelbyClient,
		account: walletAddress,
	});

	const [shareBlob, setShareBlob] = useState<BlobMetadata | null>(null);
	const [verifyBlob, setVerifyBlob] = useState<BlobMetadata | null>(null);
	const [deleteBlob, setDeleteBlob] = useState<BlobMetadata | null>(null);

	if (isLoading) {
		return (
			<main className="overflow-y-auto px-4 py-8">
				<GalleryHeader count={null} />
				<LoadingSkeleton />
			</main>
		);
	}

	if (isError) {
		return (
			<main className="flex flex-col items-center justify-center gap-4 py-20">
				<p className="font-pixel text-[10px] text-destructive tracking-wider">
					FAILED TO LOAD SNAPS
				</p>
				<button
					type="button"
					onClick={() => refetch()}
					className="border-[2px] border-border px-3 py-1.5 font-pixel text-[8px] text-muted-foreground transition-colors hover:border-accent-brand hover:text-accent-brand"
				>
					RETRY
				</button>
			</main>
		);
	}

	// Filter deleted, sort newest first
	const activeBlobs = (blobs ?? [])
		.filter((b) => !b.isDeleted)
		.sort((a, b) => b.creationMicros - a.creationMicros);

	if (activeBlobs.length === 0) {
		return (
			<main className="flex flex-col items-center justify-center gap-6 py-20">
				<p className="text-center font-pixel text-[10px] text-muted-foreground leading-loose tracking-wider">
					NO SNAPS YET.
					<br />
					UPLOAD YOUR FIRST IMAGE!
				</p>
				<Link
					to="/"
					className="border-[2px] border-accent-brand px-4 py-2 font-pixel text-[8px] text-accent-brand transition-colors hover:bg-accent-brand hover:text-background"
				>
					UPLOAD NOW
				</Link>
			</main>
		);
	}

	return (
		<main className="overflow-y-auto px-4 py-8">
			<GalleryHeader count={activeBlobs.length} />

			<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
				{activeBlobs.map((blob) => (
					<ImageCard
						key={blob.name?.toString() ?? blob.blobNameSuffix}
						blob={blob}
						walletAddress={walletAddress}
						onCopyLink={(b) => setShareBlob(b)}
						onVerify={(b) => setVerifyBlob(b)}
						onDelete={(b) => setDeleteBlob(b)}
					/>
				))}
			</div>

			{/* Share modal */}
			{shareBlob && (
				<ShareModal
					blob={shareBlob}
					walletAddress={walletAddress}
					open={shareBlob !== null}
					onOpenChange={(o) => {
						if (!o) setShareBlob(null);
					}}
				/>
			)}

			{/* Verify panel */}
			{verifyBlob && (
				<VerifyPanel
					blob={verifyBlob}
					walletAddress={walletAddress}
					open={verifyBlob !== null}
					onOpenChange={(o) => {
						if (!o) setVerifyBlob(null);
					}}
				/>
			)}

			{/* Delete confirm */}
			{deleteBlob && (
				<DeleteConfirmDialog
					blob={deleteBlob}
					open={deleteBlob !== null}
					onOpenChange={(o) => {
						if (!o) setDeleteBlob(null);
					}}
					onDeleted={() => {
						setDeleteBlob(null);
						refetch();
					}}
				/>
			)}
		</main>
	);
}

function GalleryHeader({ count }: { count: number | null }) {
	return (
		<div className="mb-6 flex items-baseline gap-3">
			<h1 className="font-pixel text-accent-brand text-sm tracking-widest">
				MY SNAPS
			</h1>
			{count !== null && (
				<span className="font-mono text-[10px] text-muted-foreground">
					{count} {count === 1 ? "image" : "images"}
				</span>
			)}
		</div>
	);
}
