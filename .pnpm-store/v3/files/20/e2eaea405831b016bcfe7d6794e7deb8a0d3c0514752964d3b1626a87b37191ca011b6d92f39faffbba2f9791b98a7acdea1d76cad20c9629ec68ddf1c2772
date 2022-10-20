# Change Log

## 3.0.2 ( September 5th, 2021)

**Big fix:**

- Check if the value passed to `reset` is a number

## 3.0.1 ( June 20th, 2021)

**Big fix:**

- Fix an issue where the new `updateInterval` prop didn't really respect that elapsed time. Now, for example, if it is set to 10 seconds then the next update will be exactly after 10 seconds.

**Implemented enhancements:**

- `newStartAt` value can now be passed to the `onComplete` callback as well as the `reset` method. This feature was available in v2 of the hook and it is implemented again in v.3

## 3.0.0 ( June 18th, 2021)

The hooks is now written in TypeScript.

**Breaking Changes:**

- IE is not longer supported
- `autoResetKey` props has been deprecated
- `reset` method of the hook return value no longer accepts `newStartAt`. When it is fired the animation will start over from the initially provided `startAt` value
- `onComplete` return value does not accept `newStartAt`

**New features:**

- `updateInterval` prop now controls how often the hook should rerender. Set as a number in seconds
- `onUpdate` callback will be fired with the current elapsed time when the `elapsedTime` changes.

**Chore:**

- example folder is added, which can we be used for development or testing the hook

## 2.1.8 (May 13th, 2021)

**Chore:**

- Update dependencies
- Add list of supported browsers

## 2.1.7 (March 25th, 2021)

**Chore:**

- Update dependencies

## 2.1.6 (December 12th, 2020)

**Chore:**

- Add Renovate and dump the versions of all dependencies

## 2.1.5 (June 21st, 2020)

**Big fix:**

- A warning is thrown by React that it can not update state on unmounted component when the hook component is unmounted from the onComplete callback and the callback returns shouldRepeat = true. Originally reported bug - https://github.com/vydimitrov/react-countdown-circle-timer/issues/28#issuecomment-645471853

## 2.1.4 (June 3rd, 2020)

**Big fix:**

- Fix an issue where pausing the animation once it is completed, resetting the timer and playing again it did not work.

## 2.1.3 (May 29th, 2020)

**Big fix:**

- SSR: use `useEffect` when environment is `node` or `window` is undefined. When the environment is browser `useLayoutEffect` should be used instead
- Remove side effects from `useState` so `React.StrictMode` doesn't bug the hook in development
- Add a test to ensure that timeout is cancelled when `isPlaying` is set to `false` when the duration is reached

## 2.1.2 (May 18th, 2020)

**Big fix:**

- Reset method will now ignore any none number value passed to it and it will use the previous `startAt` value

## 2.1.1 (May 13th, 2020)

**Implemented enhancements:**

- `autoResetKey` is a new prop that allows resetting the animation when the key changes. It works similar to React's `key` prop

## 2.0.1 (May 12th, 2020)

**Bug fix:**

Fix an issue where resetting the animation once it was done when the `isPlaying` was set to true did not start playing after the reset

## 2.0.0 (May 11th, 2020)

**Breaking Changes:**

- The hook now returns an object with `elapsedTime` in seconds and `reset` method, like so `{ elapsedTime, reset }`
- `durationSeconds` is renamed to just `duration`. The duration is now set in **seconds**
- `startAt` now expects value in **seconds**
- `onComplete` will receive as an argument the `totalElapsedTime` in **seconds**. The animation can now be repeated by returning an object instead of an array. The object may have the following params: `shouldRepeat` indicates if the loop should start over; `delay` - delay before looping again in seconds; `newStartAt` set new start at value. |
- Changing the `duration` while the loop is running will update the duration - if the new duration is more than the previous one, the measurement of the elapsed time will continue to the new duration; if the duration is less than the previous one, the `onComplete` callback will be fired.

**Implemented enhancements:**

- `options.shouldResetOnDurationChange` can be set to reset elapsed time when the duration changes
- the hook now returns `reset` method, which can be used to reset the elapsed time

## 1.1.5 (December 22nd, 2019)

**Implemented enhancements:**

- Refactor internals
- Add test coverage

## 1.1.4 (December 19th, 2019)

**Implemented enhancements:**

- Add a new config option "startAt" to change the start time of the animation. Defaults to 0 if not provided

## 1.1.3 (November 27th, 2019)

**Implemented enhancements:**

- Add TypeScript type definitions

## 1.1.2 (November 16th, 2019)

**Implemented enhancements:**

- Add CHANGELOG.md to repo

## 1.1.0 (November 16th, 2019)

**Implemented enhancements:**

- `config.isRepeated` is deprecated due to an issue to toggle it while the animation loop is running
- Animation now can be repeated by returning an array `[shouldRepeat: boolean, delay: number]` from `config.onComplete`
- Code samples are removed from ReadMe and replaced with buttons to edit on CodeSandbox
