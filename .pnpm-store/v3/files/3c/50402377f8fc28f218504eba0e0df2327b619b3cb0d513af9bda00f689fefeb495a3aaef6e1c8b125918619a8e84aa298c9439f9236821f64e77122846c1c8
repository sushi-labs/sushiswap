import * as windowMetadata from "@walletconnect/window-metadata";
import * as windowGetters from "@walletconnect/window-getters";
import { detect, } from "detect-browser";
export function detectEnv(userAgent) {
    return detect(userAgent);
}
export function detectOS() {
    const env = detectEnv();
    return env && env.os ? env.os : undefined;
}
export function isAndroid() {
    const os = detectOS();
    return os ? os.toLowerCase().includes("android") : false;
}
export function isIOS() {
    const os = detectOS();
    return os
        ? os.toLowerCase().includes("ios") ||
            (os.toLowerCase().includes("mac") && navigator.maxTouchPoints > 1)
        : false;
}
export function isMobile() {
    const os = detectOS();
    return os ? isAndroid() || isIOS() : false;
}
export function isNode() {
    const env = detectEnv();
    const result = env && env.name ? env.name.toLowerCase() === "node" : false;
    return result;
}
export function isBrowser() {
    const result = !isNode() && !!getNavigator();
    return result;
}
export const getFromWindow = windowGetters.getFromWindow;
export const getFromWindowOrThrow = windowGetters.getFromWindowOrThrow;
export const getDocumentOrThrow = windowGetters.getDocumentOrThrow;
export const getDocument = windowGetters.getDocument;
export const getNavigatorOrThrow = windowGetters.getNavigatorOrThrow;
export const getNavigator = windowGetters.getNavigator;
export const getLocationOrThrow = windowGetters.getLocationOrThrow;
export const getLocation = windowGetters.getLocation;
export const getCryptoOrThrow = windowGetters.getCryptoOrThrow;
export const getCrypto = windowGetters.getCrypto;
export const getLocalStorageOrThrow = windowGetters.getLocalStorageOrThrow;
export const getLocalStorage = windowGetters.getLocalStorage;
export function getClientMeta() {
    return windowMetadata.getWindowMetadata();
}
//# sourceMappingURL=browser.js.map