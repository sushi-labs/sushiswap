import React from 'react';
import { AxisScale } from '@visx/axis';
import { CombinedStackData, SeriesProps } from '../types';
/** Returns the value which forms a stack group. */
export declare const getStackValue: <XScale extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>, YScale extends import("@visx/scale").ValueOf<import("@visx/scale").ScaleTypeToD3Scale<import("@visx/axis").AxisScaleOutput, any, any>>>(d: Pick<CombinedStackData<XScale, YScale>, "stack">) => import("@visx/scale").ScaleInput<XScale> | import("@visx/scale").ScaleInput<YScale>;
/**
 * Merges `seriesChildren` `props.data` by their `stack` value which
 * forms the stack grouping (`x` if vertical, `y` if horizontal)
 * and returns `CombinedStackData[]`.
 */
export default function combineBarStackData<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(seriesChildren: React.ReactElement<SeriesProps<XScale, YScale, Datum>>[], horizontal?: boolean): CombinedStackData<XScale, YScale>[];
//# sourceMappingURL=combineBarStackData.d.ts.map