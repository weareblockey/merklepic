import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@merklepic/ui/components/alert-dialog";
import { useDeleteBlobs } from "@shelby-protocol/react";
import type { BlobMetadata } from "@shelby-protocol/sdk/browser";
import { toast } from "sonner";
import { shelbyClient } from "../lib/shelby-client";

interface DeleteConfirmDialogProps {
	blob: BlobMetadata;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleted: () => void;
}

export function DeleteConfirmDialog({
	blob,
	open,
	onOpenChange,
	onDeleted,
}: DeleteConfirmDialogProps) {
	const wallet = useWallet();

	const { mutate: deleteBlobs, isPending } = useDeleteBlobs({
		client: shelbyClient,
		onSuccess: () => {
			toast.success("Image deleted");
			onOpenChange(false);
			onDeleted();
		},
		onError: (err) => {
			toast.error(`Delete failed: ${err.message}`);
		},
	});

	function handleConfirm() {
		if (!wallet.account) {
			toast.error("Wallet not connected");
			return;
		}
		deleteBlobs({
			signer: wallet,
			blobNames: [blob.blobNameSuffix],
		});
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="border-[3px] border-destructive shadow-[4px_4px_0_0_oklch(0_0_0_/_60%)]">
				<AlertDialogHeader>
					<AlertDialogTitle className="font-pixel text-[10px] text-foreground tracking-wider">
						DELETE IMAGE
					</AlertDialogTitle>
					<AlertDialogDescription className="flex flex-col gap-2 pt-2">
						<span className="font-pixel text-[8px] text-muted-foreground">
							THIS WILL REMOVE THE IMAGE FROM SHELBY NETWORK.
						</span>
						<span className="font-pixel text-[8px] text-muted-foreground">
							THIS ACTION REQUIRES A TRANSACTION.
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel
						className="border-[2px] border-border font-pixel text-[8px]"
						disabled={isPending}
					>
						CANCEL
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						className="border-[2px] border-destructive font-pixel text-[8px]"
						disabled={isPending}
						onClick={handleConfirm}
					>
						{isPending ? "DELETING..." : "DELETE"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
