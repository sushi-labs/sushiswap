CSS Background Parser
=====================

Parse an element’s CSS background properties to get a list of individual backgrounds.

_This library is still a work in progress and is probably not very useful yet. It’s pre-1.0 and has no tests yet._

* Methods
    * [parseElementStyle()][parseElementStyle]
* Objects
    * [Background][Background]
    * [BackgroundList][BackgroundList]


## Usage

Available on npm as `css-background-parser`, or in the browser as a global called `cssBgParser`

### Methods

#### <a name="parseElementStyle"></a> `parseElementStyle(styleObject)`

Takes a [`CSSStyleDeclaration`][CSSStyleDeclaration] object and returns a [`BackgroundList`][BackgroundList] of backgrounds found in the styles.

In non-techo-babble, the only input is an object which represents an element’s style. It could be `element.style`, the result of `window.getComputedStyle(element)`, or a custom object that happens to have properties which are prefixed `background` (`backgroundColor`, `backgroundSize`, etc.).

If you want the most accurate results, I suggest you use `window.getComputedStyle(element)` — see the code examples below.

Since multiple backgrounds can be assigned to an element, this method will always return a [`BackgroundList`][BackgroundList], even if there is only one background. Backgrounds are listed in order from top layer to bottom layer (in other words, the first layer is closest to the person looking at the screen). This means that the `color` property will only be filled on the _last_ `Background` object in the list, representing the bottom layer.

A very basic example:

```js
var style = getComputedStyle(someElement);
var bglist = cssBgParser.parseElementStyle(style);

console.log(bglist.backgrounds.length);  // 1
console.log(bglist.backgrounds[0]);      // Logs a Background object
```

Multiple backgrounds:

```js
someElement.style.backgroundImage = 'linear-gradient(white, blue), url(/background.png)';
someElement.style.backgroundColor = 'black';

var style = getComputedStyle(someElement);
var bglist = cssBgParser.parseElementStyle(style);

console.log(bglist.backgrounds.length);    // 2

console.log(bglist.backgrounds[0].image);  // "linear-gradient(white, blue)"
console.log(bglist.backgrounds[1].image);  // "url(http://example.com/background.png)"

console.log(bglist.backgrounds[0].color);  // ""
console.log(bglist.backgrounds[1].color);  // "rgb(0, 0, 0)"
```

The difference between `element.style` and `window.getComputedStyle(element)`:

```js
someElement.style.background = 'red';

var parsedStyle = cssBgParser.parsesomeElemententStyle(elem.style);
console.log(parsedStyle.backgrounds[0]);
/*
 * Background {
 *     attachment: "initial"
 *     clip: "initial"
 *     color: "red"
 *     image: "initial"
 *     origin: "initial"
 *     position: "initial"
 *     repeat: "initial"
 *     size: "initial"
 * }
 */

var computed = getComputedStyle(elem);
var parsedComputed = cssBgParser.parseElementStyle(computed);
console.log(parsedComputed.backgrounds[0]);
/*
 * Background {
 *     attachment: "scroll"
 *     clip: "border-box"
 *     color: "rgb(255, 0, 0)"
 *     image: "none"
 *     origin: "padding-box"
 *     position: "0% 0%"
 *     repeat: "repeat"
 *     size: "auto"
 * }
 */
```

---

### Objects / “Classes”

#### <a name="Background"></a> `Background(props)`

A simple object holding the properties of a single background for an element.

##### Properties

`Background` objects contain the following properties, listed here with their default values (as defined by the [CSS specification][CSSBackgroundSpec]):

* `attachment` — "scroll"
* `clip` — "border-box"
* `color` — ""
* `image` — "none"
* `origin` — "padding-box"
* `position` — "0% 0%"
* `repeat` — "repeat"
* `size` — "auto"

A `Background` can be instantiated with an optional first parameter, which is an object containing key/value pairs of properties to set. Any properties in the list above that are not found in the `props` argument are set to their default values. In most cases, though, you’d only deal with `Background` objects as return values from `parseElementStyle()`.

##### Methods

* `toString()`
  Returns a string of all properties, in a format that matches browsers’ formatting of the `background` CSS shorthand property (when an element has only a single background). For reference, the format is:
  `<color> <repeat> <attachment> <position> / <size> <origin> <clip>`

---

#### <a name="BackgroundList"></a> `BackgroundList(arrayOfBackgrounds)`

A collection of [`Background`][Background] objects representing all the backgrounds used for a single element.

##### Properties

`BackgroundList` objects only contain a single property called `backgrounds`, which is an array of `Background` objects.

A `BackgroundList` can be instantiated with an optional first parameter, which is an array of `Background` objects that gets assigned to the `backgrounds` property. In most cases, though, you’d only deal with `BackgroundList` objects as return values from `parseElementStyle()`.

##### Methods

* `toString()`
  Returns a comma-separated string of all `Background`s contained in the collection, calling `.toString()` on each `Background`. This matches browsers’ formatting of the `background` CSS shorthand property (when an element has multiple backgrounds).



[parseElementStyle]: #Background
[Background]: #Background
[BackgroundList]: #BackgroundList

[CSSBackgroundSpec]: http://www.w3.org/TR/css3-background/#backgrounds
[CSSStyleDeclaration]: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
