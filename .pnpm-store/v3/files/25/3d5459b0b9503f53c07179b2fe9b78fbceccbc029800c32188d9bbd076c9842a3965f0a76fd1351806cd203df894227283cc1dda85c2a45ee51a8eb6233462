# Change Log

## 3.0.1 (September 5th, 2021)

**Fix:**

- upgraded `use-elapsed-time` to 3.0.2, which fixes an issue where reset method was taking any kind of value as newStartAt value. Not it checks if the value provided is a number

## 3.0.0 ( September 5th , 2021)

**Breaking Changes:**

- IE is not longer supported
- `autoResetKey` props has been deprecated.
- `shouldUseToLocaleString` and the whole setup to use the built-in `toLocaleString` out of the box has been deprecated. The same result can be achieved using the `formatter` function.
- React PropTypes has been removed as well as the `prop-types` peer-dependency. The component and hook will rely on the TypeScript types.
- `prefix` and `suffix` props has been deprecated. The same result can be achieved just by adding them to in front and behind the value.

**New features:**

- `updateInterval` prop now determines how often the animated value will change. When set to 0 the value will update on each key frame (default behavior).
- `onUpdate` callback will be fired with the current animated value when it changes.

**Implemented enhancements:**

- bundle size is now even further reduced
- `esbuild` is now used to bundle the code
- example folder is added, which can be used for testing the hook and component

## 2.3.1 (March 25th, 2021)

**Implemented enhancements:**

- chore: upgrade dependencies

## 2.3.0 (Jan 15th, 2021)

**Implemented enhancements:**

- feat: add list of supported browsers to package.json

## 2.2.6 (Jan 12th, 2021)

**Implemented enhancements:**

- chore: Add renovate to the repo
- chore: Update all packages

## 2.2.5 (Sept 10th, 2020)

**Implemented enhancements:**

- chore: upgrade rollup and rollup-terser packages

## 2.2.4 (June 11th, 2020)

**Implemented enhancements:**

- feat: use Rollup instead of Webpack to bundle the package, which enables ES module bundles.

## 2.1.4 (June 8th, 2020)

**Implemented enhancements:**

- chore: update list of keywords in package.json

## 2.1.3 (June 3rd, 2020)

**Big fix:**

- fix: upgrade use-elapsed-time to 2.1.4 which fixes an issue where pausing the animation once it is completed, resetting the timer and playing again it did not work.

## 2.1.2 (June 1st, 2020)

**Implemented enhancements:**

- fix: upgrade `use-elapsed-time` package to v2.1.3 which replaces `useLayoutEffect` with `useEffect` when the environment is node for SSR and removes side effects from `useState` so React.StrictMode works as expected in development

## 2.1.1 (May 21st, 2020)

**Big fix:**

- fix: fix an issue where rounding numbers with bitwise shifting `number | 0` caused the last number to jump

## 2.1.0 (May 19th, 2020)

**Big fix:**

- Upgrade use-elapsed-time dependency to v 2.1.2, which fixes and issue with reset method that takes none number values

**Implemented enhancements:**

- The default decimal places count is not determined based on the maximum number of decimal places in `start` and `end`. The decimal places count is also used in `toLocaleString`

## 2.0.0 (May 18th, 2020)

**Breaking Changes**

- The hook now returns an object with two props: `value` and `reset`. `value` is the current count up value; `reset` is a method that reset the animation when it is fired
- The hook now accepts a single object as an argument with all props to configure the animation.

**Implemented enhancements:**

- The library exports also Count up component. The component is using the hook internally.
- Support `toLocaleString` with fallback options
- Add bunch of props to configure the output value
- Rewrite the source code using TypeScript
- Support React Native

## 1.0.4 (Nov 27th, 2019)

**Minor changes:**

- Update TypeScript type definitions

## 1.0.3 (Nov 24th, 2019)

**Minor changes:**

- Update Readme

## 1.0.2 (Nov 24th, 2019)

**Implemented enhancements:**

- Add TypeScript type definitions

## 1.0.1 (Nov 13th, 2019)

**Minor changes:**

- Update .gitignore, .npmignore and Readme

## 1.0.0 (Oct 6th, 2019)

**Implemented enhancements:**

- Init the project with simple hook and returns the count up value
