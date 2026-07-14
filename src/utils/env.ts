const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
	throw new Error(
		"EXPO_PUBLIC_API_BASE_URL não está definida. Configure no .env ou .env.local",
	);
}

export const env = {
	API_BASE_URL,
};
