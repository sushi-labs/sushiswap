<hr>
<div align="center">
  <h1 align="center">
    useScrollPosition()
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=@react-hook/window-scroll">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@react-hook/window-scroll?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/@react-hook/window-scroll">
    <img alt="Types" src="https://img.shields.io/npm/types/@react-hook/window-scroll?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@react-hook/window-scroll">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@react-hook/window-scroll?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@react-hook/window-scroll?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i @react-hook/window-scroll</pre>
<hr>

A React hook for updating components when the scroll position of the window on the y-axis changes.
This hook throttles updates to the scroll position using [useThrottle()](https://github.com/jaredLunde/react-hook/tree/master/packages/throttle)
at `30fps` by default, but this rate is configurable.

## Quick Start

[Check out the example on **CodeSandbox**](https://codesandbox.io/s/react-hookwindow-size-and-react-hookwindow-scroll-examples-oqmer?file=/src/App.js)

```jsx harmony
import useScrollPosition from '@react-hook/window-scroll'

const Component = (props) => {
  const scrollY = useScrollPosition(60 /*fps*/)
  return <div>scroll pos: {scrollY}</div>
}
```

## API

### useScrollPosition(fps?: number): number

A hook that performantly updates its scroll position at a constant frame rate.

#### Arguments

|     | Type     | Default | Description                                                                   |
| --- | -------- | ------- | ----------------------------------------------------------------------------- |
| fps | `number` | `30`    | Defines the rate in frames per second at which the scroll position is updated |

#### Returns `scrollY: number`

|         | Type     | Description                                             |
| ------- | -------- | ------------------------------------------------------- |
| scrollY | `number` | The current scroll position of the window on the y-axis |

## LICENSE

MIT
