<div align="center">
  <h1>use-count-up</h1>
  <a href="https://www.npmjs.com/package/use-count-up">
    <img alt="NPM version" src="https://img.shields.io/npm/v/use-count-up" />
  </a>
  <a href="https://www.npmtrends.com/use-count-up">
    <img alt="Weekly downloads" src="https://img.shields.io/npm/dw/use-count-up" />
  </a>
  <a href="https://codecov.io/gh/vydimitrov/use-count-up">
    <img alt="Code Coverage" src="https://img.shields.io/codecov/c/gh/vydimitrov/use-count-up" />
  </a>
  <a href="https://bundlephobia.com/result?p=use-count-up@latest">
    <img alt="Bundle Size" src="https://img.shields.io/bundlephobia/minzip/use-count-up" />
  </a>

  <p>
    <br />
    <strong>React/React Native component and hook to animate<br />counting up or down to a number</strong>
  </p>
</div>

<hr />

## Key features

:trophy: Lighter implementation and smaller bundle size [in comparison with similar feature solutions](https://bundlephobia.com/scan-results?packages=use-count-up@latest,react-countup)  
:flags: Declarative API _(no more imperative calls to `start()` and `update()`)_  
&nbsp;:iphone:&nbsp; React Native support for iOS and Android  
:deciduous_tree: Tree-shakable  
&nbsp;:file_cabinet: Server-side rendering (SSR) compatibility

## Installation

```
yarn add use-count-up
```

## Demo

<img src="https://user-images.githubusercontent.com/10707142/82188777-ac628e80-98ee-11ea-8a10-0469713a3bbc.gif" width="300">

Check the React demo on [CodeSandbox](https://codesandbox.io/s/aged-monad-0mrfu?fontsize=14) and React Native demo on [Expo Snack](https://snack.expo.io/@vydimitrov/use-count-up?platform=ios) to get started.

## Component basic usage

```jsx
import { CountUp } from 'use-count-up'

const MyComponent = () => <CountUp isCounting end={1320} duration={3.2} />
```

The `CountUp` component should be wrapped in a `Text` component when used in a React Native project like so:

```jsx
import { Text } from 'react-native'
import { CountUp } from 'use-count-up'

const MyComponent = () => (
  <Text>
    <CountUp isCounting end={1320} duration={3.2} />
  </Text>
)
```

## Hook basic usage

The hook accepts the same properties as the component. The usage for React and React Native is the same.

```jsx
import { useCountUp } from 'use-count-up'

const MyComponent = () => {
  const { value } = useCountUp({
    isCounting: true,
    end: 1320,
    duration: 3.2,
  })

  return value
}
```

## Props

The component and the hook accept the same props. They are fully interchangeable.

| Prop Name              | Type               | Default      | Description                                                                                                                                                                              |
| ---------------------- | ------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **isCounting**         | boolean            | false        | Play and pause counting animation                                                                                                                                                        |
| **start**              | number             | 0            | Initial value                                                                                                                                                                            |
| **end**                | number             | -            | Target value                                                                                                                                                                             |
| **duration**           | number             | -            | Animation duration in seconds. Defaults to 2 seconds if `end` is set                                                                                                                     |
| **decimalPlaces**      | number             | -            | Number of decimal places after the decimal separator. Defaults to the max decimal places count from `start` and `end` props                                                              |
| **decimalSeparator**   | string             | -            | Decimal separator character                                                                                                                                                              |
| **thousandsSeparator** | string             | -            | Thousands separator character                                                                                                                                                            |
| **easing**             | string \| function | easeOutCubic | _Type: easeOutCubic \| easeInCubic \| linear \| [easing func](http://www.gizma.com/easing/)_ <br> Easing function to control the animation progress                                      |
| **formatter**          | function           | -            | _Type: (value: number) => number \| string \| node_ <br> A function that formats the output value. It has the highest priority so all other formatting options are ignored               |
| **updateInterval**     | number             | 0            | Update interval in seconds. Determines how often the animated value will change. When set to 0 the value will update on each key frame                                                   |
| **children**           | function           | -            | _Type: ({ value: number, reset: () => void }) => number \| string \| node_ <br> CountUp component - children prop                                                                        |
| **onComplete**         | function           | -            | _Type: () => void \| {shouldRepeat: boolean, delay: number}_ <br> On complete handler. Repeat animation by returning an object with `shouldRepeat` equals `true` and `delay` in seconds. |
| **onUpdate**           | function           | -            | _Type: (currentValue: number \| string \| node) => void_ <br> On value update event handler                                                                                              |

## Return values

The hook returns the current count up value and reset method to reset the animation.

```jsx
import { useCountUp } from 'use-count-up'

const { value, reset } = useCountUp({ isCounting: true })
```

The component's children render function will receive as props the current count up value and reset method to reset the animation.

```jsx
import { CountUp } from 'use-count-up'

const MyComponent = () => (
  <CountUp isCounting>{({ value, reset }) => value}</CountUp>
)
```

## Why use `toLocaleString` with `formatter`

Number formatting varies per language group. For example, the number `3842.45` in German will be formatted as `3.842,45` whereas in British English it will be `3,842.45` (spot the different decimal and thousands separators). `Number.toLocaleString()` is a [built-in JS method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) that returns a string with a language-sensitive representation of the number. The basic implementation of the method will detect the default locale that is set up on the user's computer and will format the number accordingly. The browser support for `toLocaleString` [is incredibly good](https://caniuse.com/#search=number%20toLocaleString).

If you expect variance in the geographical/country distribution of your users, then this is a must. The simplest way to use `toLocaleString` with the Count up component or hook is to use the `formatter` prop, like so:

```jsx
import { CountUp } from 'use-count-up'

const MyComponent = () => (
  <CountUp
    isCounting
    end={1320}
    formatter={(value) => value.toLocaleString()}
  />
)
```

`toLocaleString` method accepts an object with [two parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat), `locale` and `options`, which allows further customization of the number value. Setting up the first parameter, `locale`, allows the use of a specific locale and fallback option. The second parameter, `options`, will let you format the value in a custom way. For example, you may choose to add a min and max number of decimal places, or set currency. Keep in mind though that the `locale` and `options` arguments are [not supported in all browsers](https://caniuse.com/#feat=mdn-javascript_builtins_number_tolocalestring_locales).

## Recipes

### Reset animation

Pass a key prop to CountUp component and change it when the animation should repeat. It can be also used when a change of `start` or `end` value should start the animation over.

```jsx
import { CountUp } from 'use-count-up'

const MyComponent = ({ end }) => <CountUp isCounting end={end} key={end} />
```

### Repeat animation on completion

Return from the `onComplete` handler an object with key `shouldRepeat: true`. Optionally the `delay` before repeating can be set. In the example below the animation will be repeated in 2 seconds

```jsx
import { CountUp } from 'use-count-up'

const onComplete = () => {
  // do your stuff here
  return { shouldRepeat: true, delay: 2 }
}

const MyComponent = () => (
  <CountUp isCounting end={4378.2} onComplete={onComplete} />
)
```

### Count up to infinity

Don't provide `end` and `duration` props. `start` prop can be set to any value

```jsx
import { CountUp } from 'use-count-up'

const MyComponent = () => <CountUp isCounting start={1024.4} />
```

### Count up/down n-seconds

Set the `easing` to "linear" and `duration` to the seconds it should count up/down. The `updateInterval` can be set to 1, so it updates once every second. Here is an example of a 10-second count-down:

```jsx
import { CountUp } from 'use-count-up'

const MyComponent = () => (
  <CountUp
    isCounting
    start={10}
    end={0}
    duration={10}
    easing="linear"
    updateInterval={1}
    onUpdate={(currentValue) => {
      // it will fire once every second
    }}
  />
)
```
