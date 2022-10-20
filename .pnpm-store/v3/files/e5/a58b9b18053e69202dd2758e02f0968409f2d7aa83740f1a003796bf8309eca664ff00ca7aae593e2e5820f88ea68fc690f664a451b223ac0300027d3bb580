import { isConstantTime } from "../helpers";
import { nodeHmacSha256Sign, nodeHmacSha512Sign } from "../lib/node";
export async function hmacSha256Sign(key, msg) {
    const result = nodeHmacSha256Sign(key, msg);
    return result;
}
export async function hmacSha256Verify(key, msg, sig) {
    const expectedSig = nodeHmacSha256Sign(key, msg);
    const result = isConstantTime(expectedSig, sig);
    return result;
}
export async function hmacSha512Sign(key, msg) {
    const result = nodeHmacSha512Sign(key, msg);
    return result;
}
export async function hmacSha512Verify(key, msg, sig) {
    const expectedSig = nodeHmacSha512Sign(key, msg);
    const result = isConstantTime(expectedSig, sig);
    return result;
}
//# sourceMappingURL=hmac.js.map