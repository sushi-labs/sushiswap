import * as encoding from "@walletconnect/encoding";
import * as jsonRpcUtils from "@walletconnect/jsonrpc-utils";
import { infuraNetworks } from "./constants";
export function sanitizeHex(hex) {
    return encoding.sanitizeHex(hex);
}
export function addHexPrefix(hex) {
    return encoding.addHexPrefix(hex);
}
export function removeHexPrefix(hex) {
    return encoding.removeHexPrefix(hex);
}
export function removeHexLeadingZeros(hex) {
    return encoding.removeHexLeadingZeros(encoding.addHexPrefix(hex));
}
export const payloadId = jsonRpcUtils.payloadId;
export function uuid() {
    const result = ((a, b) => {
        for (b = a = ""; a++ < 36; b += (a * 51) & 52 ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16) : "-") {
        }
        return b;
    })();
    return result;
}
export function logDeprecationWarning() {
    console.warn("DEPRECATION WARNING: This WalletConnect client library will be deprecated in favor of @walletconnect/client. Please check docs.walletconnect.org to learn more about this migration!");
}
export function getInfuraRpcUrl(chainId, infuraId) {
    let rpcUrl;
    const network = infuraNetworks[chainId];
    if (network) {
        rpcUrl = `https://${network}.infura.io/v3/${infuraId}`;
    }
    return rpcUrl;
}
export function getRpcUrl(chainId, rpc) {
    let rpcUrl;
    const infuraUrl = getInfuraRpcUrl(chainId, rpc.infuraId);
    if (rpc.custom && rpc.custom[chainId]) {
        rpcUrl = rpc.custom[chainId];
    }
    else if (infuraUrl) {
        rpcUrl = infuraUrl;
    }
    return rpcUrl;
}
//# sourceMappingURL=misc.js.map