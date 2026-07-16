import { existsSync } from "node:fs";
import { defineConfig } from "orval";

for (const envFile of [".env.local", ".env"]) {
	if (existsSync(envFile)) {
		process.loadEnvFile(envFile);
		break;
	}
}

const API_SWAGGER_URL = process.env.EXPO_API_SWAGGER_URL;

export default defineConfig({
	api: {
		input: {
			target: API_SWAGGER_URL || "./swagger.json",
		},
		output: {
			mode: "tags-split",
			target: "./src/api/generated",
			schemas: "./src/api/generated/models",
			client: "react-query",
			httpClient: "axios",
			mock: false,
			override: {
				mutator: {
					path: "./src/lib/api-client.ts",
					name: "apiClient",
					default: true,
				},
				query: {
					useInfinite: false,
					useInfiniteQueryParam: "page",
				},
			},
		},
	},
});

