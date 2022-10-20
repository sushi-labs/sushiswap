const API_URL = "https://registry.walletconnect.com";
export function getWalletRegistryUrl() {
    return API_URL + "/api/v2/wallets";
}
export function getDappRegistryUrl() {
    return API_URL + "/api/v2/dapps";
}
export function formatMobileRegistryEntry(entry, platform = "mobile") {
    var _a;
    return {
        name: entry.name || "",
        shortName: entry.metadata.shortName || "",
        color: entry.metadata.colors.primary || "",
        logo: (_a = entry.image_url.sm) !== null && _a !== void 0 ? _a : "",
        universalLink: entry[platform].universal || "",
        deepLink: entry[platform].native || "",
    };
}
export function formatMobileRegistry(registry, platform = "mobile") {
    return Object.values(registry)
        .filter(entry => !!entry[platform].universal || !!entry[platform].native)
        .map((entry) => formatMobileRegistryEntry(entry, platform));
}
//# sourceMappingURL=registry.js.map