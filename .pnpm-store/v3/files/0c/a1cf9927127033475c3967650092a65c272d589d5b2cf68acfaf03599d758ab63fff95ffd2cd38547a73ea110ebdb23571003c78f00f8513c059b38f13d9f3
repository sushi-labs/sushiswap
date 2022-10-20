"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
const repeater_1 = require("@repeaterjs/repeater");
/**
 * Utility for mapping an event stream.
 */
const map = (mapper) => (source) => new repeater_1.Repeater(async (push, stop) => {
    const iterable = source[Symbol.asyncIterator]();
    stop.then(() => {
        iterable.return?.();
    });
    let latest;
    while ((latest = await iterable.next()).done === false) {
        await push(await mapper(latest.value));
    }
    stop();
});
exports.map = map;
