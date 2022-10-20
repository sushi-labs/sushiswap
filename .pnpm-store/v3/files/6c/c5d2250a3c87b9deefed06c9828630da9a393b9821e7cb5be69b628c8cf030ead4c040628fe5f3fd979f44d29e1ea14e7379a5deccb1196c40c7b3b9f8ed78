import { Repeater } from '@repeaterjs/repeater';
export function filter(filter) {
    return (source) => new Repeater(async (push, stop) => {
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
