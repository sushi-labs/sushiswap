import { safeJsonParse, safeJsonStringify } from "./json";
import { getLocalStorage } from "./browser";
export function setLocal(key, data) {
    const raw = safeJsonStringify(data);
    const local = getLocalStorage();
    if (local) {
        local.setItem(key, raw);
    }
}
export function getLocal(key) {
    let data = null;
    let raw = null;
    const local = getLocalStorage();
    if (local) {
        raw = local.getItem(key);
    }
    data = raw ? safeJsonParse(raw) : raw;
    return data;
}
export function removeLocal(key) {
    const local = getLocalStorage();
    if (local) {
        local.removeItem(key);
    }
}
//# sourceMappingURL=local.js.map