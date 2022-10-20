'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sdkAnalytics_stringPad = require('./stringPad.cjs');

/**
 * This file maps sequences of 6 bit binary digits to a character in base64.
 * 000000 -> A
 * 110011 -> Z
 * 111111 -> /
 */
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64Map = {};
var num = 0;
chars.split('').forEach(function (char) {
    var key = num.toString(2);
    key = sdkAnalytics_stringPad.stringPad(key, 6, '0');
    base64Map[key] = char;
    num++;
});

exports.base64Map = base64Map;
