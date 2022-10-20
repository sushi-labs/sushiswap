<hr>
<div align="center">
  <h1 align="center">
    useLatest()
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=@react-hook/latest">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@react-hook/latest?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/@react-hook/latest">
    <img alt="Types" src="https://img.shields.io/npm/types/@react-hook/latest?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.com/jaredLunde/react-hook">
    <img alt="Build status" src="https://img.shields.io/travis/com/jaredLunde/react-hook?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@react-hook/latest">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@react-hook/latest?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@react-hook/latest?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i @react-hook/latest</pre>
<hr>

A React hook that updates useRef().current with the most recent value each invocation

## Quick Start

```jsx harmony
import useLatest from '@react-hook/latest'

const useEvent = (element, name, listener) => {
  const latest = useLatest(listener)

  React.useEffect(() => {
    const listen = (e) => latest.current(e)
    element.addEventListener(name, listen)
    return () => element.removeEventListener(name, listen)
  }, [latest])
}
```

## API

### useLatest(value)

```ts
const useLatest: <T extends any>(current: T) => React.MutableRefObject<T>
```

### Props

| Prop  | Type            | Required? | Description               |
| ----- | --------------- | --------- | ------------------------- |
| value | `T extends any` | Yes       | Any value you want stored |

### Returns `React.MutableRefObject<T>`

## LICENSE

MIT
