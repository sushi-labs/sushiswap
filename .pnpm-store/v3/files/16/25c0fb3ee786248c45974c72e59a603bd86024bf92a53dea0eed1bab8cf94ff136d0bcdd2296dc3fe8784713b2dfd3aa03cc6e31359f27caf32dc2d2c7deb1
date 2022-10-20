Single slider, similar to `<input type="range" defaultValue={0} />`

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

Slider with marks

```jsx
<ReactSlider
    className="horizontal-slider"
    marks
    markClassName="example-mark"
    min={0}
    max={9}
    thumbClassName="example-thumb"
    trackClassName="example-track"
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

An inverted slider with custom marks

```jsx
<ReactSlider
    className="horizontal-slider"
    marks={[5, 6, 7, 8, 9]}
    markClassName="example-mark"
    min={0}
    max={9}
    invert
    thumbClassName="example-thumb"
    trackClassName="example-track"
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

Double slider

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 100]}
    ariaLabel={['Lower thumb', 'Upper thumb']}
    ariaValuetext={state => `Thumb value ${state.valueNow}`}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    pearling
    minDistance={10}
/>
```

Multi slider

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 50, 100]}
    ariaLabel={['Leftmost thumb', 'Middle thumb', 'Rightmost thumb']}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    pearling
    minDistance={10}
/>
```

Vertical slider

```jsx
<ReactSlider
    className="vertical-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 50, 100]}
    ariaLabel={['Lowest thumb', 'Middle thumb', 'Top thumb']}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    orientation="vertical"
    invert
    pearling
    minDistance={10}
/>
```

Vertical slider with marks at an interval

```jsx
<ReactSlider
    className="vertical-slider"
    markClassName="example-mark"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 50, 100]}
    marks={25}
    ariaLabel={['Lowest thumb', 'Middle thumb', 'Top thumb']}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    orientation="vertical"
    invert
    pearling
    minDistance={10}
/>
```

Track changes with `onBeforeChange`, `onChange`, and `onAfterChange` event handlers

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    onBeforeChange={(value, index) => console.log(`onBeforeChange: ${JSON.stringify({ value, index })}`)}
    onChange={(value, index) => console.log(`onChange: ${JSON.stringify({ value, index })}`)}
    onAfterChange={(value, index) => console.log(`onAfterChange: ${JSON.stringify({ value, index })}`)}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

Using the `onChange` event handler, you can use the slider as a controlled component

```jsx
const [value, setValue] = React.useState([25, 50]);

<ReactSlider
    value={value}
    onBeforeChange={(value, index) => console.log(`onBeforeChange: ${JSON.stringify({ value, index })}`)}
    onChange={(value, index) => console.log(`onChange: ${JSON.stringify({ value, index })}`)}
    onAfterChange={(value, index) => console.log(`onAfterChange: ${JSON.stringify({ value, index })}`)}
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

Custom styling using [styled-components](https://www.styled-components.com/)

```jsx
import styled from 'styled-components';

const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    width: 25px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => props.index === 2 ? '#f00' : props.index === 1 ? '#0f0' : '#ddd'};
    border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

<StyledSlider
    defaultValue={[50, 75]}
    renderTrack={Track}
    renderThumb={Thumb}
/>
```

In some case you may need to programatically tell the slider to resize, for example if the parent container is resizing independently of the window.
Set a [ref](https://reactjs.org/docs/refs-and-the-dom.html) on the slider component, and call `resize`.

```jsx
import styled from 'styled-components';

const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    width: 25px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => (props.index === 2 ? '#f00' : props.index === 1 ? '#0f0' : '#ddd')};
    border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const StyledContainer = styled.div`
    resize: horizontal;
    overflow: auto;
    width: 50%;
    max-width: 100%;
    padding-right: 8px;
`;

const ResizableSlider = () => {
    const containerRef = React.useRef();
    const sliderRef = React.useRef();
    React.useEffect(() => {
        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            sliderRef.current.resize();
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.unobserve(containerRef.current);
        };
    });

    return (
        <StyledContainer ref={containerRef}>
            <StyledSlider
                ref={sliderRef}
                defaultValue={[50, 75]}
                renderTrack={Track}
                renderThumb={Thumb}
            />
        </StyledContainer>
    );
};

<ResizableSlider />
```

Single slider, applying `ariaLabelledby` to establish association with a label

```jsx
<div>
    <label id="slider-label">
        React Slider example
    </label>
    <ReactSlider
        ariaLabelledby="slider-label"
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    />
</div>
```

Double slider, applying `ariaLabelledby` as an array to multiple thumb labels

```jsx
<div>
    <label id="first-slider-label">
        Start slider label
    </label>
    <label id="second-slider-label">
        End slider label
    </label>
    <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        defaultValue={[0, 100]}
        ariaLabelledby={['first-slider-label', 'second-slider-label']}
        ariaValuetext={state => `Thumb value ${state.valueNow}`}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        pearling
        minDistance={10}
    />
</div>