import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { cn } from "@merklepic/ui/lib/utils";
import { useUploadBlobs } from "@shelby-protocol/react";
import { useNavigate } from "@tanstack/react-router";
import { ImageIcon, UploadCloudIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
	calculateExpirationMicros,
	generateBlobName,
	validateFile,
} from "../lib/blob-utils";
import { shelbyClient } from "../lib/shelby-client";
import { ExpirationSelector } from "./expiration-selector";

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadZone() {
	const { connected, account, signAndSubmitTransaction } = useWallet();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [expirationDays, setExpirationDays] = useState(30);
	const [fileError, setFileError] = useState<string | null>(null);

	const uploadBlobs = useUploadBlobs({
		client: shelbyClient,
		onSuccess: () => {
			toast.success("Upload complete!");
			navigate({ to: "/gallery" });
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Upload failed");
		},
	});

	const handleFileSelect = useCallback((file: File) => {
		setFileError(null);
		const validation = validateFile(file);
		if (!validation.valid) {
			setFileError(validation.error ?? "Invalid file");
			setSelectedFile(null);
			return;
		}
		setSelectedFile(file);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleUpload = useCallback(async () => {
		if (!selectedFile || !account || !connected) return;

		const blobName = generateBlobName(selectedFile.name);
		const blobData = new Uint8Array(await selectedFile.arrayBuffer());
		const expirationMicros = calculateExpirationMicros(expirationDays);

		uploadBlobs.mutate({
			signer: { account: account.address, signAndSubmitTransaction },
			blobs: [{ blobName, blobData }],
			expirationMicros,
		});
	}, [
		selectedFile,
		account,
		connected,
		expirationDays,
		signAndSubmitTransaction,
		uploadBlobs.mutate,
	]);

	const isPending = uploadBlobs.isPending;

	return (
		<div className="relative mx-auto w-full max-w-[560px]">
			{/* Disconnected overlay */}
			{!connected && (
				<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 border-3 border-border bg-background/90">
					<span className="text-sm font-medium text-muted-foreground tracking-wide">
						WALLET NOT CONNECTED
					</span>
					<span className="font-pixel text-sm text-accent-brand tracking-wider">
						CONNECT WALLET TO UPLOAD
					</span>
				</div>
			)}

			{/* Upload zone */}
			<section
				aria-label="File upload drop zone"
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					"flex flex-col items-center justify-center gap-6 p-8",
					"min-h-[240px] md:min-h-[320px]",
					"border-[3px] border-dashed transition-none",
					isDragging
						? "border-accent-brand bg-accent-brand/5 shadow-[0_0_16px_var(--accent-brand),0_0_32px_oklch(0.70_0.25_300_/_30%)]"
						: "border-border bg-card",
					isPending && "pointer-events-none opacity-60",
				)}
			>
				{isPending ? (
					/* Uploading state */
					<div className="flex flex-col items-center gap-4">
						<div
							className="size-10 animate-spin border-[3px] border-accent-brand border-t-transparent"
							style={{
								animationTimingFunction: "steps(8)",
								animationDuration: "1s",
							}}
							role="status"
							aria-label="Uploading"
						/>
						<span className="font-pixel text-sm text-accent-brand tracking-widest">
							UPLOADING...
						</span>
					</div>
				) : selectedFile ? (
					/* Selected state */
					<div className="flex w-full flex-col items-center gap-6">
						<div className="flex w-full max-w-xs items-center gap-3 border-[2px] border-border bg-background p-3">
							<ImageIcon size={20} className="shrink-0 text-accent-brand" />
							<div className="flex min-w-0 flex-col">
								<span className="truncate font-mono text-foreground text-sm">
									{selectedFile.name}
								</span>
								<span className="font-mono text-xs text-muted-foreground">
									{formatBytes(selectedFile.size)}
								</span>
							</div>
						</div>

						<ExpirationSelector
							value={expirationDays}
							onChange={setExpirationDays}
						/>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => {
									setSelectedFile(null);
									setFileError(null);
									if (fileInputRef.current) fileInputRef.current.value = "";
								}}
								className="h-10 cursor-pointer rounded-none border-[2px] border-border bg-background px-4 font-semibold text-xs text-muted-foreground tracking-wider transition-none hover:border-destructive hover:text-destructive"
							>
								CANCEL
							</button>
							<button
								type="button"
								onClick={handleUpload}
								disabled={!connected || isPending}
								className="h-10 cursor-pointer rounded-none border-[2px] border-accent-brand bg-accent-brand/15 px-6 font-semibold text-xs text-accent-brand tracking-wider shadow-[2px_2px_0_0_var(--accent-brand)] transition-none hover:bg-accent-brand/25 disabled:cursor-not-allowed disabled:opacity-40"
							>
								UPLOAD
							</button>
						</div>
					</div>
				) : (
					/* Idle state */
					<div className="flex flex-col items-center gap-4">
						<UploadCloudIcon
							size={48}
							className={cn(
								"transition-none",
								isDragging ? "text-accent-brand" : "text-muted-foreground",
							)}
						/>
						<div className="flex flex-col items-center gap-1">
							<span className="font-pixel text-sm text-foreground tracking-widest">
								DRAG &amp; DROP
							</span>
							<span className="text-base text-muted-foreground">
								or click to browse
							</span>
						</div>
						<span className="text-xs text-muted-foreground/60">
							PNG · JPG · GIF · WEBP · max 10MB
						</span>

						{fileError && (
							<span className="text-sm font-medium text-destructive tracking-wide">
								{fileError}
							</span>
						)}

						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="h-9 cursor-pointer rounded-none border-[2px] border-border bg-background px-4 font-semibold text-xs text-foreground tracking-wider shadow-[2px_2px_0_0_oklch(0_0_0_/_50%)] transition-none hover:border-accent-brand hover:text-accent-brand"
						>
							BROWSE FILES
						</button>
					</div>
				)}

				<input
					ref={fileInputRef}
					type="file"
					accept="image/png,image/jpeg,image/gif,image/webp"
					className="sr-only"
					onChange={handleInputChange}
					aria-label="Upload image file"
				/>
			</section>
		</div>
	);
}
