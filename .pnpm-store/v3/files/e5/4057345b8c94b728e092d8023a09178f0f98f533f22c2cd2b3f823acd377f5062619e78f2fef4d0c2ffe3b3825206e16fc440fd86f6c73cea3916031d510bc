export function getFromWindow(name) {
    let res = undefined;
    if (typeof window !== "undefined" && typeof window[name] !== "undefined") {
        res = window[name];
    }
    return res;
}
export function getFromWindowOrThrow(name) {
    const res = getFromWindow(name);
    if (!res) {
        throw new Error(`${name} is not defined in Window`);
    }
    return res;
}
export function getDocumentOrThrow() {
    return getFromWindowOrThrow("document");
}
export function getDocument() {
    return getFromWindow("document");
}
export function getNavigatorOrThrow() {
    return getFromWindowOrThrow("navigator");
}
export function getNavigator() {
    return getFromWindow("navigator");
}
export function getLocationOrThrow() {
    return getFromWindowOrThrow("location");
}
export function getLocation() {
    return getFromWindow("location");
}
export function getCryptoOrThrow() {
    return getFromWindowOrThrow("crypto");
}
export function getCrypto() {
    return getFromWindow("crypto");
}
export function getLocalStorageOrThrow() {
    return getFromWindowOrThrow("localStorage");
}
export function getLocalStorage() {
    return getFromWindow("localStorage");
}
//# sourceMappingURL=index.js.map