# React Ticker

[![NPM](https://img.shields.io/npm/v/react-ticker.svg)](https://www.npmjs.com/package/react-ticker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**React Ticker** is a lightweight, performant React component, that moves text, images and videos infinitely like a newsticker.

It can be used to replace the deprecated `marquee`-HTML-tag.

**[Check out the Demo!](https://andreasfaust.github.io/react-ticker/)**

## Features:

- Move its child-elements from **right to left** or **left to right**.
- **Dynamically create child-elements**, for example from an API.
  (Does not work for dynamic widths yet!)
- Repeat the elements infinitely.
- Three different modes of repetition.
- Control speed, starting and stopping.
- Define start offset.

## Getting started

1. Install the package with **npm** or **yarn**

   `npm install react-ticker`

   `yarn add react-ticker`

2. Use it in your React components!

```javascript
import React from 'react'
import Ticker from 'react-ticker'

const MoveStuffAround = () => (
    <Ticker>
        {({ index }) => (
            <>
                <h1>This is the Headline of element #{index}!</h1>
                <img src="www.my-image-source.com/" alt=""/>
            </>
        )}
    </Ticker>
)

export default MoveStuffAround

```

Take a look at the [CodeSandbox](https://codesandbox.io/s/quizzical-lehmann-nqy7w).


## Props

| **Name**  | **Type**         | **Default**   | **Description**                                                                                                                                                                                                                                                                                                                                                   |
| :-------- | :--------------- | :----------   | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| speed     | number           | `5`           |                                                                                                                                                                                                                                                                                                                                                                   |
| direction | string           | `toLeft`      | Opposite direction: `toRight`                                                                                                                                                                                                                                                                                                                                     |
| mode      | string           | `chain`       | `chain` By default, the elements follow one and another immediately. <br> `await` A new element appears as soon as the previous one has disappeared completely. <br> `smooth` A new element appears as soon as the previous one starts to disappear.                                                                                                              |
| height    | string or number | `auto`        | **Auto-height:** By default, the Ticker will adapt the height of its highest visible child. **Fixed height:** Alternatively you can give it a fixed height: A number will be set as pixels, a string can be everything.                                                                                                                                           |
| offset    | string or number | `0`           | By default, the first element in the Ticker will align to the Tickers left side. <br> **Fixed Offset:** A number will move the Ticker's first child to the right by n pixel. <br> **Relative Offset:** The offset can also be defined in percent of the Ticker’s width. <br> **Run-in:** The string `run-in` hides the first element, so the Ticker starts empty. |
| move      | boolean          | `true`        | Set to `false` stops the Ticker.                                                                                                                                                                                                                                                                                                                                  |
| onNext    | function         | (index) => {} | Return the index of the next element to the parent component                                                                                                                                                                                                                                                                                                      |
| onFinish  | function         | () => {}      | Tell the parent component that one element is out of screen                                                                                                                                                                                                                                                                                                       |

## Gotchas

### Await loading webfonts

If you want to move text around, be sure, that your webfonts have loaded, before you initiate the Ticker-component! Otherwise the widths might be calculated wrong for the first iteration.
To await your webfonts, try out [Web Font Loader](https://github.com/typekit/webfontloader).

### Avoid linebreaks

If you want to avoid linebreaks in your text-elements, use the CSS-property `white-space: nowrap;`.

### Dynamic loading of elements

It is possible to dynamically load new elements. This feature is still experimental. It only works properly, if you use the property `offset="run-in"` and provide a placeholder while loading.

```jsx
const GetRatesFromAPI = () => {
  const [rates, setRates] = useState("");
  useEffect(() => {
    async function fetchData() {
      const ratesFromAPI = await makeAPICall();
      setRates(ratesFromAPI);
    }
    fetchData();
  }, []);
  // A placeholder is needed, to tell react-ticker, that width and height might have changed
  // It uses MutationObserver internally
  return rates ? (
    <p style={{ whiteSpace: "nowrap" }}>{rates.join(" +++ ")} +++ </p>
  ) : (
    <p style={{ visibility: "hidden" }}>Placeholder</p>
  );
};

function StockTicker() {
  return (
    <Ticker offset="run-in" speed={10}>
      {() => <GetRatesFromAPI />}
    </Ticker>
  );
}

export default StockTicker;
```

React Ticker calls its function-as-child anytime it runs out of content. It does not matter, if this function is a static component or a component, that loads content from an API.
It is important, that you provide a placeholder during the loading time of the API-call, to trigger the mutation observer when the content has arrived.


### Render only if browser-tab is visible

Currently `react-ticker` runs out of elements, when you leave the browser tab. To fix it, there is this workaround using the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#Use_cases) utilized by this great Module: [react-page-visibility](https://www.npmjs.com/package/react-page-visibility)

```jsx
import React, { useState } from 'react'
import Ticker from 'react-ticker'
import PageVisibility from 'react-page-visibility'

const MoveStuffAround = () => {
  const [pageIsVisible, setPageIsVisible] = useState(true)

  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible)
  }

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      {pageIsVisible && (
        <Ticker>
          {({ index }) => (
              <>
                  <h1>This is the Headline of element #{index}!</h1>
                  <img src="www.my-image-source.com/" alt=""/>
              </>
          )}
        </Ticker>
      )}
    </PageVisibility>
  )
}

export default MoveStuffAround
```


## Dependencies

React Ticker has no dependecies besides React 16+ (the minimum minor-release still has to be looked up).

## Browser Support

React Ticker should work in all current browsers as well as Internet Explorer 11. If you discover bugs in older browser versions, please file an [issue](https://github.com/AndreasFaust/react-ticker/issues)!

## Contributing

Every contribution is very much appreciated.
Feel free to file bugs, feature- and pull-requests.

**If this plugin is helpful for you, please star it on [GitHub](https://github.com/AndreasFaust/react-ticker).**

## License

MIT © [https://github.com/AndreasFaust](https://github.com/https://github.com/AndreasFaust)
