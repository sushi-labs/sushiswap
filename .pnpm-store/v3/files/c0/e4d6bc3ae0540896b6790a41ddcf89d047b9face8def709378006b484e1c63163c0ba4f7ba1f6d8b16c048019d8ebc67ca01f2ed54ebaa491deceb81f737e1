import React from 'react';
import { AxisScale } from '@visx/axis';
import { GlyphsProps, SeriesProps } from '../../../types';
import { WithRegisteredDataProps } from '../../../enhancers/withRegisteredData';
export declare type BaseGlyphSeriesProps<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> = SeriesProps<XScale, YScale, Datum> & {
    /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
    colorAccessor?: (d: Datum, index: number) => string | null | undefined;
    /** The size of a `Glyph`, a `number` or a function which takes a `Datum` and returns a `number`. */
    size?: number | ((d: Datum) => number);
    /** Function which handles rendering glyphs. */
    renderGlyphs: (glyphsProps: GlyphsProps<XScale, YScale, Datum>) => React.ReactNode;
};
export declare function BaseGlyphSeries<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>({ colorAccessor, data, dataKey, onBlur, onFocus, onPointerMove, onPointerOut, onPointerUp, onPointerDown, enableEvents, renderGlyphs, size, xAccessor, xScale, yAccessor, yScale, }: BaseGlyphSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>): JSX.Element;
declare const _default: <XScale extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, YScale extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, Datum extends object>(props: SeriesProps<XScale, YScale, Datum> & Pick<SeriesProps<import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, object> & {
    /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
    colorAccessor?: ((d: object, index: number) => string | null | undefined) | undefined;
    /** The size of a `Glyph`, a `number` or a function which takes a `Datum` and returns a `number`. */
    size?: number | ((d: object) => number) | undefined;
    /** Function which handles rendering glyphs. */
    renderGlyphs: (glyphsProps: GlyphsProps<import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, object>) => React.ReactNode;
} & Pick<import("../../../types").DataContextType<import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, object>, "xScale" | "yScale">, "size" | "colorAccessor" | "renderGlyphs">) => JSX.Element | null;
export default _default;
//# sourceMappingURL=BaseGlyphSeries.d.ts.map