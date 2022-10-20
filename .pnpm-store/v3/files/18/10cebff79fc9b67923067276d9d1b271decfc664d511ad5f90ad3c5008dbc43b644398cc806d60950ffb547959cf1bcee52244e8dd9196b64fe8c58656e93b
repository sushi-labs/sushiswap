"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
const repeater_1 = require("@repeaterjs/repeater");
function filter(filter) {
    return (source) => new repeater_1.Repeater(async (push, stop) => {
        const iterable = source[Symbol.asyncIterator]();
        stop.then(() => {
            iterable.return?.();
        });
        let latest;
        while ((latest = await iterable.next()).done === false) {
            if (filter(latest.value)) {
                await push(latest.value);
            }
        }
        stop();
    });
}
exports.filter = filter;
