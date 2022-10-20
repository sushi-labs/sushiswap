const domain = "walletconnect.org";
const alphanumerical = "abcdefghijklmnopqrstuvwxyz0123456789";
const bridges = alphanumerical.split("").map(char => `https://${char}.bridge.walletconnect.org`);
export function extractHostname(url) {
    let hostname = url.indexOf("//") > -1 ? url.split("/")[2] : url.split("/")[0];
    hostname = hostname.split(":")[0];
    hostname = hostname.split("?")[0];
    return hostname;
}
export function extractRootDomain(url) {
    return extractHostname(url)
        .split(".")
        .slice(-2)
        .join(".");
}
export function randomBridgeIndex() {
    return Math.floor(Math.random() * bridges.length);
}
export function selectRandomBridgeUrl() {
    return bridges[randomBridgeIndex()];
}
export function shouldSelectRandomly(url) {
    return extractRootDomain(url) === domain;
}
export function getBridgeUrl(url) {
    if (shouldSelectRandomly(url)) {
        return selectRandomBridgeUrl();
    }
    return url;
}
//# sourceMappingURL=url.js.map