import { isConstantTime } from "../helpers";
import { fallbackHmacSha256Sign, fallbackHmacSha512Sign, } from "../lib/fallback";
export async function hmacSha256Sign(key, msg) {
    const result = fallbackHmacSha256Sign(key, msg);
    return result;
}
export async function hmacSha256Verify(key, msg, sig) {
    const expectedSig = fallbackHmacSha256Sign(key, msg);
    const result = isConstantTime(expectedSig, sig);
    return result;
}
export async function hmacSha512Sign(key, msg) {
    const result = fallbackHmacSha512Sign(key, msg);
    return result;
}
export async function hmacSha512Verify(key, msg, sig) {
    const expectedSig = fallbackHmacSha512Sign(key, msg);
    const result = isConstantTime(expectedSig, sig);
    return result;
}
//# sourceMappingURL=hmac.js.map