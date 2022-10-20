import React from 'react';
import { AxisScale } from '@visx/axis';
import { DataContextType, SeriesProps } from '../types';
export declare type WithRegisteredDataProps<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> = Pick<DataContextType<XScale, YScale, Datum>, 'xScale' | 'yScale'>;
/**
 * An HOC that handles registering the Series's data and renders the
 * `BaseSeriesComponent`
 * - only if x and y scales are available in context, and
 * - overrides `props.data/xAccessor/yAccessor` with the values from context.
 * This is useful for avoiding nasty syntax with undefined scales when using
 * hooks, and ensures that data + scales are always matched in the case of
 * prop changes, etc.
 */
export default function withRegisteredData<BaseComponentProps extends SeriesProps<XScale, YScale, Datum>, XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(BaseSeriesComponent: React.ComponentType<BaseComponentProps>): <XScale_1 extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, YScale_1 extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, Datum_1 extends object>(props: SeriesProps<XScale_1, YScale_1, Datum_1> & Pick<BaseComponentProps, Exclude<keyof BaseComponentProps, "data" | "onFocus" | "onBlur" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerOut" | "xScale" | "yScale" | "dataKey" | "xAccessor" | "yAccessor" | "enableEvents">>) => JSX.Element | null;
//# sourceMappingURL=withRegisteredData.d.ts.map