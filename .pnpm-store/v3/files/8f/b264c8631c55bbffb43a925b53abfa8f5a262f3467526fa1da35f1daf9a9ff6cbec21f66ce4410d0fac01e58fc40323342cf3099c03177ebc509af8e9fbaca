import { verify as verifyMethod } from "@octokit/webhooks-methods";
import { toNormalizedJsonString } from "./to-normalized-json-string";
export async function verify(secret, payload, signature) {
    return verifyMethod(secret, typeof payload === "string" ? payload : toNormalizedJsonString(payload), signature);
}
