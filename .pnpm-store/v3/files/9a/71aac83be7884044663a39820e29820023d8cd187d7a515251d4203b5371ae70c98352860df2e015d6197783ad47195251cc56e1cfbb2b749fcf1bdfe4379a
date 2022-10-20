import React from 'react';
import { AxisScale } from '@visx/axis';
import { BarsProps, SeriesProps } from '../../../types';
export declare type BaseBarSeriesProps<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> = SeriesProps<XScale, YScale, Datum> & {
    /** Rendered component which is passed BarsProps by BaseBarSeries after processing. */
    BarsComponent: React.FC<BarsProps<XScale, YScale>>;
    /**
     * Specify bar padding when bar thickness does not come from a `band` scale.
     * Accepted values are [0, 1], 0 = no padding, 1 = no bar, defaults to 0.1.
     */
    barPadding?: number;
    /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
    colorAccessor?: (d: Datum, index: number) => string | null | undefined;
} & Pick<BarsProps<XScale, YScale>, 'radius' | 'radiusAll' | 'radiusTop' | 'radiusRight' | 'radiusBottom' | 'radiusLeft'>;
declare const _default: <XScale extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, YScale extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, Datum extends object>(props: SeriesProps<XScale, YScale, Datum> & Pick<SeriesProps<import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, object> & {
    /** Rendered component which is passed BarsProps by BaseBarSeries after processing. */
    BarsComponent: React.FC<BarsProps<import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>>>;
    /**
     * Specify bar padding when bar thickness does not come from a `band` scale.
     * Accepted values are [0, 1], 0 = no padding, 1 = no bar, defaults to 0.1.
     */
    barPadding?: number | undefined;
    /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
    colorAccessor?: ((d: object, index: number) => string | null | undefined) | undefined;
} & Pick<BarsProps<import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>>, "radius" | "radiusAll" | "radiusTop" | "radiusRight" | "radiusBottom" | "radiusLeft"> & Pick<import("../../../types").DataContextType<import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, object>, "xScale" | "yScale">, "radius" | "colorAccessor" | "radiusAll" | "radiusTop" | "radiusRight" | "radiusBottom" | "radiusLeft" | "BarsComponent" | "barPadding">) => JSX.Element | null;
export default _default;
//# sourceMappingURL=BaseBarSeries.d.ts.map