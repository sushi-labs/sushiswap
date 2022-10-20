import { encodeVersion } from "./encodeVersion.js";
import { getAnalyticsOptions } from "./getAnalyticsOptions.js";
import { packageVersion } from "../internal/utils/packageVersion.js";
/**
 * @private
 * @description Try to get the node version out of process, if browser just return 0.0.0
 */
function getNodeVersion() {
    const failedVersion = '0.0.0';
    if (typeof window !== 'undefined') {
        return failedVersion;
    }
    else {
        // node env
        try {
            return process.versions.node || failedVersion;
        }
        catch (e) {
            return failedVersion;
        }
    }
}
/**
 * @private
 * @description Ensure that all values ITrackedPropertiesThroughAnalytics are populated.
 * Accept a partial map of values and returns the complete interface of ITrackedPropertiesThroughAnalytics
 * @param {ITrackedPropertiesThroughAnalytics} trackedAnalytics
 * @param {ITrackedPropertiesThroughAnalytics} trackedAnalytics
 */
function ensureShapeOfTrackedProperties(trackedAnalytics) {
    // try to get the process version from node, but if we're on the client return 0.0.0
    const defaults = {
        techVersion: getNodeVersion(),
        sdkCode: 'T',
        sdkSemver: packageVersion.split('-')[0],
        responsive: false,
        placeholder: false,
        lazyload: false,
        accessibility: false
    };
    if (!trackedAnalytics) {
        return defaults;
    }
    else {
        return Object.assign(Object.assign({}, defaults), trackedAnalytics);
    }
}
/**
 * @private
 * @description Creates the complete SDK signature by using all the values provided by ITrackedPropertiesThroughAnalytics
 *              Creation of the signature
 *              - Set the AlgoVersion of the encoding, this is an internal letter that represents the version
 *                of our encoding algorithm, it will allow us to perform breaking changes if we'll need them.
 *              - Take the constant SDK code (Arbitrary letter chosen for each SDK, for Base that letter is 'T')
 *                this is used to tell apart which SDK is being tracked.
 *              - Take the {major.minor} versions of the node version (techVersion) (14.2, 16.2 etc.)
 *              - Take the full semver of the SDK you wish to track
 *              - Take the features used(lazy, placeholder etc.) and turn them to a letter (for example accessibility -> D)
 *              - Before appending the string, the Versions must be encoded, see the function `encodeVersion` for more details
 *              - Append all the variables to a single string
 *              - In any case of an error, return the single letter 'E'
 *
 * @return {string} sdkAnalyticsSignature
 */
export function getSDKAnalyticsSignature(_trackedAnalytics) {
    const trackedAnalytics = ensureShapeOfTrackedProperties(_trackedAnalytics);
    const analyticsOptions = getAnalyticsOptions(trackedAnalytics);
    try {
        const twoPartVersion = removePatchFromSemver(analyticsOptions.techVersion);
        const encodedSDKVersion = encodeVersion(analyticsOptions.sdkSemver);
        const encodedTechVersion = encodeVersion(twoPartVersion);
        const featureCode = analyticsOptions.feature;
        const SDKCode = analyticsOptions.sdkCode;
        const algoVersion = 'A'; // The algo version is determined here, it should not be an argument
        return `${algoVersion}${SDKCode}${encodedSDKVersion}${encodedTechVersion}${featureCode}`;
    }
    catch (e) {
        // Either SDK or Node versions were unparsable
        return 'E';
    }
}
/**
 * @private
 * @description Removes patch version from the semver if it exists
 *              Turns x.y.z OR x.y into x.y
 * @param {'x.y.z' | 'x.y' | string} semVerStr
 */
function removePatchFromSemver(semVerStr) {
    const parts = semVerStr.split('.');
    return `${parts[0]}.${parts[1]}`;
}
