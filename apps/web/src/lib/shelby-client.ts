import { Network } from "@aptos-labs/ts-sdk";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";

// Shelby Protocol runs on its own network (shelbynet), not Aptos testnet
export const shelbyClient = new ShelbyClient({
	network: Network.SHELBYNET,
	apiKey: (import.meta as unknown as { env: Record<string, string> }).env
		.VITE_GEOMI_API_KEY,
});
