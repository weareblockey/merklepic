import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_GEOMI_API_KEY: z.string().optional(),
	},
	// biome-ignore lint/suspicious/noExplicitAny: Vite env not typed via import.meta
	runtimeEnv: (import.meta as any).env,
	emptyStringAsUndefined: true,
});
