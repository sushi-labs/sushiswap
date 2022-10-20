import { Repeater } from '@repeaterjs/repeater';
/**
 * Utility for mapping an event stream.
 */
export const map = (mapper) => (source) => new Repeater(async (push, stop) => {
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
