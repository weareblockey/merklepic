import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

const aptosClient = new Aptos(new AptosConfig({ network: Network.SHELBYNET }));

// 1 APT = 1e8 octas
const OCTAS_PER_APT = 1e8;

export function useAptosBalance() {
	const { account, connected } = useWallet();

	return useQuery({
		queryKey: ["apt-balance", account?.address],
		enabled: connected && !!account?.address,
		queryFn: async () => {
			if (!account?.address) return 0;
			try {
				const octas = await aptosClient.getAccountAPTAmount({
					accountAddress: account.address,
				});
				return octas / OCTAS_PER_APT;
			} catch {
				// Account may not exist on-chain yet (no faucet claimed)
				return 0;
			}
		},
		refetchInterval: 30_000,
		staleTime: 15_000,
	});
}
