import { verify } from "@octokit/webhooks-methods";
import { toNormalizedJsonString } from "./to-normalized-json-string";
export async function verifyAndReceive(state, event) {
    // verify will validate that the secret is not undefined
    const matchesSignature = await verify(state.secret, typeof event.payload === "object"
        ? toNormalizedJsonString(event.payload)
        : event.payload, event.signature);
    if (!matchesSignature) {
        const error = new Error("[@octokit/webhooks] signature does not match event payload and secret");
        return state.eventHandler.receive(Object.assign(error, { event, status: 400 }));
    }
    return state.eventHandler.receive({
        id: event.id,
        name: event.name,
        payload: typeof event.payload === "string"
            ? JSON.parse(event.payload)
            : event.payload,
    });
}
