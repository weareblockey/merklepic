import { Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Toaster } from "@merklepic/ui/components/sonner";
import { ShelbyClientProvider } from "@shelby-protocol/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { ErrorBoundary } from "../components/error-boundary";
import Header from "../components/header";
import appCss from "../index.css?url";
import { shelbyClient } from "../lib/shelby-client";

// biome-ignore lint/complexity/noBannedTypes: TanStack Router requires this exact type shape
export type RouterAppContext = {};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "MerklePic" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			// Google Fonts: readable sans + pixel accent + mono
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Press+Start+2P&family=VT323&family=JetBrains+Mono:wght@400;500;700&display=swap",
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	// Create QueryClient inside component to avoid SSR data leaks between requests
	const [queryClient] = useState(() => new QueryClient());

	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
				{/* Buffer polyfill must load before Aptos/Shelby SDK modules */}
				<script type="module" src="/src/polyfills.ts" />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<AptosWalletAdapterProvider
						autoConnect={true}
						dappConfig={{ network: Network.SHELBYNET }}
					>
						<ShelbyClientProvider client={shelbyClient}>
							{/* Toaster outside ErrorBoundary so toasts still show on crash */}
							<Toaster richColors />
							<ErrorBoundary>
								<div className="grid h-svh grid-rows-[auto_1fr]">
									<Header />
									<Outlet />
								</div>
								<TanStackRouterDevtools position="bottom-left" />
							</ErrorBoundary>
						</ShelbyClientProvider>
					</AptosWalletAdapterProvider>
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
