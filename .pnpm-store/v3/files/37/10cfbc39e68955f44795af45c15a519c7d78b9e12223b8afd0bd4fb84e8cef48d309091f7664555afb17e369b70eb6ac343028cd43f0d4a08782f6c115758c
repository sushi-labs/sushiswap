import { Repeater } from '@repeaterjs/repeater';
/**
 * Utility for mapping an event stream.
 */
export const map = (mapper) => (source) => new Repeater(async (push, stop) => {
    const iterable = source[Symbol.asyncIterator]();
    stop.then(() => {
        var _a;
        (_a = iterable.return) === null || _a === void 0 ? void 0 : _a.call(iterable);
    });
    let latest;
    while ((latest = await iterable.next()).done === false) {
        await push(await mapper(latest.value));
    }
    stop();
});
