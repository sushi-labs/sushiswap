'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sdkAnalytics_base64Map = require('./base64Map.cjs');
var sdkAnalytics_stringPad = require('./stringPad.cjs');
var sdkAnalytics_reverseVersion = require('./reverseVersion.cjs');

/**
 * @private
 * @description Encodes a semVer-like version string
 * @param {string} semVer Input can be either x.y.z or x.y
 * @return {string} A string built from 3 characters of the base64 table that encode the semVer
 */
function encodeVersion(semVer) {
    var strResult = '';
    // support x.y or x.y.z by using 'parts' as a variable
    var parts = semVer.split('.').length;
    var paddedStringLength = parts * 6; // we pad to either 12 or 18 characters
    // reverse (but don't mirror) the version. 1.5.15 -> 15.5.1
    // Pad to two spaces, 15.5.1 -> 15.05.01
    var paddedReversedSemver = sdkAnalytics_reverseVersion.reverseVersion(semVer);
    // turn 15.05.01 to a string '150501' then to a number 150501
    var num = parseInt(paddedReversedSemver.split('.').join(''));
    // Represent as binary, add left padding to 12 or 18 characters.
    // 150,501 -> 100100101111100101
    var paddedBinary = num.toString(2);
    paddedBinary = sdkAnalytics_stringPad.stringPad(paddedBinary, paddedStringLength, '0');
    // Stop in case an invalid version number was provided
    // paddedBinary must be built from sections of 6 bits
    if (paddedBinary.length % 6 !== 0) {
        throw 'Version must be smaller than 43.21.26)';
    }
    // turn every 6 bits into a character using the base64Map
    paddedBinary.match(/.{1,6}/g).forEach(function (bitString) {
        // console.log(bitString);
        strResult += sdkAnalytics_base64Map.base64Map[bitString];
    });
    return strResult;
}

exports.encodeVersion = encodeVersion;
