import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { SHELBYUSD_FA_METADATA_ADDRESS } from "@shelby-protocol/sdk/browser";
import { useQuery } from "@tanstack/react-query";

const aptosClient = new Aptos(new AptosConfig({ network: Network.SHELBYNET }));

// ShelbyUSD uses 6 decimals (similar to USDC)
const SHELBYUSD_DECIMALS = 1e6;

export function useShelbyUsdBalance() {
	const { account, connected } = useWallet();

	return useQuery({
		queryKey: ["shelbyusd-balance", account?.address],
		enabled: connected && !!account?.address,
		queryFn: async () => {
			if (!account?.address) return 0;
			try {
				const amount = await aptosClient.getAccountCoinAmount({
					accountAddress: account.address,
					faMetadataAddress: SHELBYUSD_FA_METADATA_ADDRESS,
				});
				return amount / SHELBYUSD_DECIMALS;
			} catch {
				// Account may not hold ShelbyUSD yet
				return 0;
			}
		},
		refetchInterval: 30_000,
		staleTime: 15_000,
	});
}
