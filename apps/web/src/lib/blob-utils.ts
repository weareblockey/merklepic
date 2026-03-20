import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";
import { shelbyClient } from "./shelby-client";

export function generateBlobName(filename: string): string {
	// Sanitize filename: strip path separators and non-safe chars
	const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
	return `merklepic_${Date.now()}_${safe}`;
}

export function calculateExpirationMicros(days: number): number {
	return (Date.now() + days * 24 * 60 * 60 * 1000) * 1000;
}

export function constructBlobUrl(address: string, blobName: string): string {
	return `${shelbyClient.baseUrl}/v1/blobs/${address}/${blobName}`;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
	if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
		return {
			valid: false,
			error: `Invalid file type. Accepted: ${ACCEPTED_IMAGE_TYPES.map((t) => t.replace("image/", ".")).join(", ")}`,
		};
	}
	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
		};
	}
	return { valid: true };
}
