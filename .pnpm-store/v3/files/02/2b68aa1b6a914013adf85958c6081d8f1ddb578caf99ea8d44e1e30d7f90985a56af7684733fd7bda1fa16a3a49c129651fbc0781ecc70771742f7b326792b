import { browserHmacSha256Sign, browserHmacSha512Sign } from "../lib/browser";
import { isConstantTime } from "../helpers";
export async function hmacSha256Sign(key, msg) {
    const result = await browserHmacSha256Sign(key, msg);
    return result;
}
export async function hmacSha256Verify(key, msg, sig) {
    const expectedSig = await browserHmacSha256Sign(key, msg);
    const result = isConstantTime(expectedSig, sig);
    return result;
}
export async function hmacSha512Sign(key, msg) {
    const result = await browserHmacSha512Sign(key, msg);
    return result;
}
export async function hmacSha512Verify(key, msg, sig) {
    const expectedSig = await browserHmacSha512Sign(key, msg);
    const result = isConstantTime(expectedSig, sig);
    return result;
}
//# sourceMappingURL=hmac.js.map