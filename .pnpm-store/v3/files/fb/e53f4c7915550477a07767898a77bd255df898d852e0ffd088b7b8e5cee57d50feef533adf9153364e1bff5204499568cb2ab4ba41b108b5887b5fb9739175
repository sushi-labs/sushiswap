- [Intro](#react-tiny-popover)
- [Installation](#install)
- [Demo](#demo)
- [Examples](#examples)
- [Hooks](#hooks)
- [Migrating from versions 3 and 4](#migrating-from-versions-3-and-4)
- [API](#api)

# react-tiny-popover

A lightweight, highly customizable, non-intrusive, and Typescript friendly popover react HOC with no other dependencies!

The component renders its child directly, without wrapping it with anything on the DOM, and in addition renders solely the JSX you provide when shown. It simply grabs the child component's coordinates and provides a robust and non-intrusive way for you to position your own content around the child. Your content will be appended to `document.body` (or an element of your choice) when shown, and removed when hidden. You can use it to generate little popups around input or button elements, menu fly-outs, or in pretty much any situation where you want some content to appear and disappear dynamically around a target. You can also specify your own location for your popover content or hook into the existing positioning process, allowing you to essentially make modal windows and the like, as well!

`react-tiny-popover` can also guard against container boundaries and reposition itself to prevent any kind of hidden overflow. You can specify a priority of desired positions to fall back to, if you'd like.

Optionally, you can provide a renderer function for your popover content that injects the popover's current position, in case your content needs to know where it sits in relation to its target.

Since `react-tiny-popover` tries to be as non-invasive as possible, it will simply render the content you provide with the position and padding from the target that you provide. If you'd like an arrow pointing to the target to appear along with your content and don't feel like building it yourself, you may be interested in wrapping your content with the customizable `ArrowContainer` component, also provided! `ArrowContainer`'s arrow will follow its target dynamically, and handles boundary collisions as well.

## Install

```shell
yarn add react-tiny-popover
```

or

```shell
npm install react-tiny-popover --save
```

## [Demo](https://alexkatz.github.io/react-tiny-popover/)

:+1:

## Examples

```JSX
import { Popover } from 'react-tiny-popover'

...

<Popover
  isOpen={isPopoverOpen}
  positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
  content={<div>Hi! I'm popover content.</div>}
>
  <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
    Click me!
  </div>
</Popover>;
```

```JSX
import { Popover } from 'react-tiny-popover'

...

<Popover
  isOpen={isPopoverOpen}
  positions={['top', 'left']} // if you'd like, you can limit the positions
  padding={10} // adjust padding here!
  reposition={false} // prevents automatic readjustment of content position that keeps your popover content within its parent's bounds
  onClickOutside={() => setIsPopoverOpen(false)} // handle click events outside of the popover/target here!
  content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
    <div>
      <div>Hi! I'm popover content. Here's my current position: {position}.</div>
      <div>I'm {` ${nudgedLeft} `} pixels beyond my boundary horizontally!</div>
      <div>I'm {` ${nudgedTop} `} pixels beyond my boundary vertically!</div>
    </div>
  )}
>
  <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>Click me!</div>
</Popover>;
```

```JSX
import { useRef } from 'react';
import { Popover, ArrowContainer } from 'react-tiny-popover'

const clickMeButtonRef = useRef<HTMLButtonElement | undefined>();

<Popover
  isOpen={isPopoverOpen}
  positions={['top', 'right', 'left', 'bottom']}
  padding={10}
  onClickOutside={() => setIsPopoverOpen(false)}
  ref={clickMeButtonRef} // if you'd like a ref to your popover's child, you can grab one here
  content={({ position, childRect, popoverRect }) => (
    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
      position={position}
      childRect={childRect}
      popoverRect={popoverRect}
      arrowColor={'blue'}
      arrowSize={10}
      arrowStyle={{ opacity: 0.7 }}
      className='popover-arrow-container'
      arrowClassName='popover-arrow'
    >
      <div
        style={{ backgroundColor: 'blue', opacity: 0.7 }}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        Hi! I'm popover content. Here's my position: {position}.
      </div>
    </ArrowContainer>
  )}
>
  <button onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
    Click me!
  </button>
</Popover>;
```

If you'd like to use a custom React element as `Popover`'s target, you'll have to pass the `ref` that `Popover` provides to an inner DOM element of your component. The best way to accomplish this is with [React's ref forwarding API](https://reactjs.org/docs/forwarding-refs.html). Here's a simple example, using Typescript:

```JSX
import React, { useState } from 'react';
import { Popover } from 'react-tiny-popover';

interface CustomComponentProps extends React.ComponentPropsWithoutRef<'div'> {
  onClick(): void;
}

const CustomComponent = React.forwardRef<HTMLDivElement, CustomComponentProps>((props, ref) => (
  <div ref={ref} onClick={props.onClick}>
    {props.children}
  </div>
));

const App: React.FC = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <div>
      <Popover isOpen={isPopoverOpen} content={<div>hey from popover content</div>}>
        <CustomComponent onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
          hey from a custom target component
        </CustomComponent>
      </Popover>
    </div>
  );
};

export default App;
```

## Hooks

If you prefer going completely headless (though `react-tiny-popover` is fairly headless as is), you may prefer `usePopover` and `useArrowContainer` instead.

To create your own custom arrow container, the `useArrowContainer` hook works as so:

```JSX
import { useArrowContainer } from 'react-tiny-popover';

// ...

const { arrowContainerStyle, arrowStyle } = useArrowContainer({
  childRect // from PopoverState,
  popoverRect // from PopoverState,
  position // from PopoverState,
  arrowColor // string,
  arrowSize // number,
});

// ...

// You can then use these styles to render your arrow container in whatever way you'd like
return (
    <div style={arrowContainerStyle}>
      <div style={arrowStyle} />
      {children}
    </div>
);
```

Similarly, `usePopover` allows you to create your own popover component as so:

```JSX
import { usePopover } from 'react-tiny-popover'

// ...

const onPositionPopover = useCallback(
  (popoverState: PopoverState) => setPopoverState(popoverState),
  [],
);

const [positionPopover, popoverRef] = usePopover({
  childRef,
  containerClassName,
  parentElement,
  contentLocation,
  positions,
  align,
  padding,
  boundaryInset,
  boundaryElement,
  reposition,
  onPositionPopover,
});

// ...

```

After attaching `popoverRef` and `childRef` to the DOM, you can fire `positionPopover` at any time to update your popover's position.

Admittedly, this is a bit more advanced, but play around and see what you can come up with! Feel free to examine the internal Popover component to see how the hook is used there.

## Migrating from versions 3 and 4

`react-tiny-popover` 5 and up has abandoned use of `findDOMNode` to gain a reference to `Popover`'s target DOM node, and now explicitly relies on a ref. Since React has deprecated `findDOMNode` in `StrictMode`, now seems like an appropriate time to shift away from this under-the-hood logic toward a clearer and more declarative API.

If your code looked this way, it can stay this way. React elements handle refs out of the box with no issues:

```JSX
<Popover
  isOpen={isPopoverOpen}
  content={<div>Hi! I'm popover content.</div>}
>
  <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
    Click me!
  </div>
</Popover>;
```

However, if you use a custom component as a your `Popover`'s child, you'll have to implement ref forwarding. Without ref forwarding, `Popover` will not be able to inject a reference into your component and refer to it.

For example:

```JSX
interface Props extends React.ComponentPropsWithoutRef<'div'> {
  onClick(): void;
}

// this component will no longer work as a Popover child
const CustomComponent: React.FC<Props> = props => (
  <div onClick={props.onClick}>
    {props.children}
  </div>
)

// instead, you'll simply implement ref forwarding, as so:
const CustomComponent = React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  <div ref={ref} onClick={props.onClick}>
    {props.children}
  </div>
));
```

Check out [React's ref forwarding API](https://reactjs.org/docs/forwarding-refs.html) for more info, and see the examples above.

## API

### Popover

| <b>Property<b>     | Type                             | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children           | `JSX.Element` or `Function`      | ✔️       | If the `JSX.Element` you provide is a custom component, it should [forward refs](https://reactjs.org/docs/forwarding-refs.html). If you provide a function of form `(ref: React.Ref) => JSX.Element`, it'll return from it the JSX.Element target that you'd like the popover content to track. Don't forget to attach that `ref` to it, though.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| isOpen             | `boolean`                        | ✔️       | When this boolean is set to true, the popover is visible and tracks the target. When the boolean is false, the popover content is neither visible nor present on the DOM.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| content            | `JSX.Element` or `Function`      | ✔️       | Here, you'll provide the content that will appear as the popover. Rather than a JSX element like a `<div>`, you may supply a function that returns a JSX.Element, which will look like this: `(popoverState: PopoverState) => JSX.Element`. Here, `position` is of type `'top', 'bottom', 'left', 'right'`. `align` is of type `start`, `center`, or `end`. Both `targetRect` and `popoverRect` are `ClientRect` objects of format `{ height: number, width: number, top: number, left: number, right: number, bottom: number }`, and represent the popover content and target `div`'s coordinates within your browser's window. `nudgedLeft` and `nudgedTop` specify the X and Y offset the popover content is shifted by to keep it within the window's bounds during a boundary collision. You may want to use these values to adjust your content depending on its location in relation to the window and the target, especially if you have repositioning disabled. Sweet. |
| padding            | `number`                         |          | This number determines the gap, in pixels, between your target content and your popover content. Defaults to 6.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| reposition         | `boolean`                        |          | If false, rather than the popover content repositioning on a boundary collision, the popover content container will move beyond your `parentElement`'s bounds. You are, however, supplied with `nudgedLeft` and `nudgedTop` values by the function you can opt to provide to `content`, so you may choose to handle content overflow as you wish.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| position           | `string[]`                       |          | You may provide a priority list of preferred positions for your popover content in relation to its target, in the form of an array. Valid values for the array are `'top', 'bottom', 'left', 'right'`. If the popover reaches the edge of the window or its otherwise specified boundary (see `parentElement` and `boundaryInset`), and repositioning is enabled, it will attempt to render in the order you specify. The default order is `['top', 'left', 'right', 'bottom']`. If you'd like, you can provide a shorter array like `['top', 'left']`. Once the array of positions is exhausted, the popover will no longer attempt to reposition.                                                                                                                                                                                                                                                                                                                             |
| align              | `string`                         |          | Possible values are `start`, `center`, and `end`. If `start` is specified, the popover content's top or left location is aligned with its target's. With `end` specified, the content's bottom or right location is aligned with its target's. If `center` is specified, the popover content and target's centers are aligned. Defaults to `center`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ref                | `React.Ref`                      |          | Since `Popover` relies on ref forwarding to access its child, it's not simple to obtain a second reference to that child. This property acts as a "pass through" for you to obtain a ref to the child you've provided `Popover`. The value of the ref you provide here will be `Popover`'s child.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| onClickOutside     | `Function`                       |          | If `react-tiny-popover` detects a click event outside of the target and outside of the popover, you may handle this event here, in the form of `(e: MouseEvent) => void`. Note that event handling uses capturing, so this will likely fire before any event handlers targeting the actual element that was clicked.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| contentLocation    | `object` or `Function`           |          | If you'd like to hook directly into the positioning process, you may do so here! You can provide an object of type `{ top: number, left: number }` to completely override the popover content's (`popoverRect`) location. You can also provide a function that looks like this: `(popoverState: PopoverState) => { top: number, left: number }` (The arguments to this function are the same as the content renderer function above).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| parentElement      | `HTMLElement`                    |          | Provide an HTML element here to have your popover content appended to it rather than `document.body`. This is useful if you'd like your popover to sit at a particular place within the DOM. Supplying a `parentElement` will not in most cases directly affect the positioning of the popover.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| boundaryInset      | `number`                         |          | This number specifies the inset around your `parentElement`'s border that boundary violations are determined at. Defaults to 0. Can be negative.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| boundaryElement    | `HTMLElement`                    |          | If provided (and `reposition` is enabled), your popover will adhere to the boundaries of this element as determined by `Element.getBoundingClientRect()`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| containerStyle     | `object` (`CSSStyleDeclaration`) |          | Your popover content is rendered to the DOM in a single container `div`. If you'd like to apply style directly to this container `div`, you may do so here! Be aware that as this `div` is a DOM element and not a React element, all style values must be strings. For example, 5 pixels must be represented as `'5px'`, as you'd do with vanilla DOM manipulation in Javascript.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| containerClassName | `string`                         |          | If you'd like to apply styles to the single container `div` that your popover content is rendered within via stylesheets, you can specify a custom className for the container here.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### PopoverState

| <b>Property<b> | Type                                                            | Description                                                                                                                                                                                                                                                                                                                              |
| -------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isPositioned   | `boolean`                                                       | After the popover has positioned its contents, this field is true. Prior, it is false.                                                                                                                                                                                                                                                   |
| childRect      | `ClientRect`                                                    | The current rect of the popover's child (i.e., the source from which the popover renders).                                                                                                                                                                                                                                               |
| popoverRect    | `ClientRect`                                                    | The current rect of the popover's contents.                                                                                                                                                                                                                                                                                              |
| parentRect     | `ClientRect`                                                    | The current rect of the popover child's parent.                                                                                                                                                                                                                                                                                          |
| position       | `'left'` \| `'right'` \| `'top'` \| `'bottom'` \| `undefined`   | The current position of the popover in relation to the child. `undefined` implies the user has set an explicit `contentLocation`.                                                                                                                                                                                                        |
| align          | `'start'` \| `'center'` \| `'end'` \| `undefined`               | The cross-axis alignment of the popover's contents. `undefined` implies the user has set an explicit `contentLocation`.                                                                                                                                                                                                                  |
| padding        | `number`                                                        | The distance between the popover's child and contents. If set to zero, the two are touching.                                                                                                                                                                                                                                             |
| nudgedLeft     | `number`                                                        | If the popover's contents encounter a boundary violation that does not warrant a reposition, the contents are instead "nudged" by the appropriate top and left values to keep the contents within the boundary. This is the left value.                                                                                                  |
| nudgedTop      | `number`                                                        | If the popover's contents encounter a boundary violation that does not warrant a reposition, the contents are instead "nudged" by the appropriate top and left values to keep the contents within the boundary. This is the top value.                                                                                                   |
| boundaryInset  | `number`                                                        | The popover's contents will encounter boundary violations prior to the actual `parentElement`'s boundaries by this number in pixels. Can be negative.                                                                                                                                                                                    |
| boundaryRect   | `ClientRect`                                                    | The current rect of the popover's boundaries.                                                                                                                                                                                                                                                                                            |
| violations     | `{ top: number; left: number; bottom: number; right: number; }` | An object containing boundary violations. Expect a value of `0` if no boundary violation exists at that bound (i.e., your popover is entirely within that bound), and expect positive values representing pixels beyond that bound if a violation exists (i.e., your popover exceeds the `top` bound by ten pixels, `top` will be `10`). |
| hasViolations  | `boolean`                                                       | `true` if violations exist at any boundary, `false` otherwise.                                                                                                                                                                                                                                                                           |

### ArrowContainer

| <b>Property<b> | Type          | Required | Description                                                                                                                                                                                                                   |
| -------------- | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| position       | `string`      | ✔️       | The `ArrowContainer` needs to know its own position in relation to the target, so it can point in the correct direction!                                                                                                      |
| children       | `JSX.Element` | ✔️       | You'll provide the `ArrowContainer` with a JSX.Element child to render as your popover content.                                                                                                                               |
| targetRect     | `object`      | ✔️       | The `ArrowContainer` must know its target's bounding rect in order to position its arrow properly. This object is of type `{ width: number, height: number, top: number, left: number, right: number, bottom: number }`.      |
| popoverRect    | `object`      | ✔️       | This allows the `ArrowContainer` to know its own bounding rect in order to position its arrow properly. This object is of type `{ width: number, height: number, top: number, left: number, right: number, bottom: number }`. |
| arrowSize      | `number`      |          | The size of the triangle arrow. Defaults to 10 or something like that.                                                                                                                                                        |
| arrowColor     | `string`      |          | The color of the arrow! Exciting.                                                                                                                                                                                             |
| arrowStyle     | `object`      |          | You may append to the arrow's style here.                                                                                                                                                                                     |
| style          | `object`      |          | If you'd like to append to the style of the `ArrowContainer` itself, do so here. Rad.                                                                                                                                         |
