'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @private
 * @description Gets the analyticsOptions from options- should include sdkSemver, techVersion, sdkCode, and feature
 * @param {ITrackedPropertiesThroughAnalytics} options
 * @returns {IAnalyticsOptions}
 */
function getAnalyticsOptions(options) {
    var analyticsOptions = {
        sdkSemver: options.sdkSemver,
        techVersion: options.techVersion,
        sdkCode: options.sdkCode,
        feature: '0'
    };
    if (options.accessibility) {
        analyticsOptions.feature = 'D';
    }
    if (options.lazyload) {
        analyticsOptions.feature = 'C';
    }
    if (options.responsive) {
        analyticsOptions.feature = 'A';
    }
    if (options.placeholder) {
        analyticsOptions.feature = 'B';
    }
    return analyticsOptions;
}

exports.getAnalyticsOptions = getAnalyticsOptions;
