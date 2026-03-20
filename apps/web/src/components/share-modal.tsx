import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@merklepic/ui/components/dialog";
import { useBlobMetadata } from "@shelby-protocol/react";
import type { BlobMetadata } from "@shelby-protocol/sdk/browser";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BLOB_POLL_INTERVAL, BLOB_POLL_TIMEOUT } from "../lib/constants";
import { getBlobUrl } from "./image-card";

interface ShareModalProps {
	blob: BlobMetadata;
	walletAddress: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ShareModal({ blob, open, onOpenChange }: ShareModalProps) {
	const [timedOut, setTimedOut] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Poll for written status when pending
	const { data: freshMeta } = useBlobMetadata({
		account: blob.owner.toString(),
		name: blob.blobNameSuffix,
		enabled: open && !blob.isWritten && !timedOut,
		refetchInterval: BLOB_POLL_INTERVAL,
	});

	const isWritten = blob.isWritten || freshMeta?.isWritten === true;
	const blobUrl = getBlobUrl(blob);

	// Start timeout when modal opens and blob is pending
	useEffect(() => {
		if (!open) {
			setTimedOut(false);
			if (timerRef.current) clearTimeout(timerRef.current);
			return;
		}
		if (blob.isWritten || isWritten) return;

		timerRef.current = setTimeout(() => {
			setTimedOut(true);
		}, BLOB_POLL_TIMEOUT);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [open, blob.isWritten, isWritten]);

	function handleCopy() {
		navigator.clipboard
			.writeText(blobUrl)
			.then(() => toast.success("Link copied!"))
			.catch(() => toast.error("Failed to copy link"));
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[3px] border-border shadow-[4px_4px_0_0_oklch(0_0_0_/_60%)] sm:max-w-sm">
				<DialogHeader>
					<DialogTitle className="font-pixel text-[10px] text-foreground tracking-wider">
						SHARE IMAGE
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					{isWritten ? (
						/* Blob is live — show URL */
						<>
							<p className="font-mono text-[9px] text-muted-foreground">
								DIRECT LINK
							</p>
							<div className="flex gap-2">
								<input
									readOnly
									value={blobUrl}
									className="min-w-0 flex-1 border-[2px] border-border bg-muted px-2 py-1.5 font-mono text-[9px] text-foreground outline-none"
								/>
								<button
									type="button"
									onClick={handleCopy}
									className="border-[2px] border-accent-brand px-2 py-1.5 font-pixel text-[8px] text-accent-brand transition-colors hover:bg-accent-brand hover:text-background"
								>
									COPY
								</button>
							</div>
						</>
					) : timedOut ? (
						/* Timed out */
						<div className="flex flex-col items-center gap-3 py-4">
							<span className="font-pixel text-[8px] text-destructive">
								NETWORK TAKING LONGER.
							</span>
							<span className="font-pixel text-[8px] text-destructive">
								TRY AGAIN LATER.
							</span>
						</div>
					) : (
						/* Polling */
						<div className="flex flex-col items-center gap-3 py-4">
							<div className="size-6 animate-spin border-2 border-accent-brand border-t-transparent" />
							<span className="text-center font-pixel text-[8px] text-muted-foreground leading-relaxed">
								FETCHING DATA FROM SHELBYNET...
							</span>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
