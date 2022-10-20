'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * A video codec parameter can be either a String or a Hash.
 * @param {Object} param <code>vc_<codec>[ : <profile> : [<level>]]</code>
 *                       or <code>{ codec: 'h264', profile: 'basic', level: '3.1' }</code>
 * @return {String} <code><codec> : <profile> : [<level>]]</code> if a Hash was provided
 *                   or the param if a String was provided.
 *                   Returns null if param is not a Hash or String
 */
function processVideoParams(param) {
    switch (param && param.constructor) {
        case Object: {
            var video = "";
            if ('codec' in param) {
                video = param.codec;
                if ('profile' in param) {
                    video += ":" + param.profile;
                    if ('level' in param) {
                        video += ":" + param.level;
                    }
                }
            }
            return video;
        }
        case String:
            return param;
        default:
            return null;
    }
}

exports.processVideoParams = processVideoParams;
