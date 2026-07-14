import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

export async function getStoredToken(): Promise<string | null> {
	return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function updateStoredToken(token: string): Promise<void> {
	await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeStoredToken(): Promise<void> {
	await SecureStore.deleteItemAsync(TOKEN_KEY);
}

type UnauthorizedListener = () => void;

let unauthorizedListener: UnauthorizedListener | null = null;

export function setOnUnauthorized(listener: UnauthorizedListener | null): void {
	unauthorizedListener = listener;
}

export function notifyUnauthorized(): void {
	unauthorizedListener?.();
}
