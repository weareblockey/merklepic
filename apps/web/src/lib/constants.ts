export const SHELBY_BLOBS_URL =
	"https://api.shelbynet.shelby.xyz/shelby/v1/blobs";

export const EXPIRATION_OPTIONS = [
	{ label: "7 Days", days: 7 },
	{ label: "30 Days", days: 30, default: true },
	{ label: "90 Days", days: 90 },
	{ label: "365 Days", days: 365 },
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ACCEPTED_IMAGE_TYPES = [
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
];

export const BLOB_POLL_INTERVAL = 3000;
export const BLOB_POLL_TIMEOUT = 120000;

// ShelbyUSD fungible asset token address on Aptos
export const SHELBYUSD_TOKEN_ADDRESS =
	"0x1b18363a9f1fe5e6ebf247daba5cc1c18052bb232efdc4c50f556053922d98e1";
