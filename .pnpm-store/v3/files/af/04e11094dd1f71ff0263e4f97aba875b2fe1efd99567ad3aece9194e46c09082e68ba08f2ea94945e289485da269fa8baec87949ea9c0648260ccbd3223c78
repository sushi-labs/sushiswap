import React from 'react';
import { GetLineSegmentsConfig } from '../util/getSplitLineSegments';
import { LinePathConfig } from '../types';
export declare type SplitLinePathRenderer = (renderProps: {
    index: number;
    segment: {
        x: number;
        y: number;
    }[];
    styles?: Omit<React.SVGProps<SVGPathElement>, 'x' | 'y' | 'children'>;
}) => React.ReactNode;
export declare type SplitLinePathProps<Datum> = {
    /** Array of data segments, where each segment will be a separate path in the rendered line. */
    segments: Datum[][];
    /** Styles to apply to each segment. If fewer styles are specified than the number of segments, they will be re-used. */
    styles: Omit<React.SVGProps<SVGPathElement>, 'x' | 'y' | 'children'>[];
    /** Override render function which is passed the configured path generator as input. */
    children?: SplitLinePathRenderer;
    /** className applied to path element. */
    className?: string;
} & LinePathConfig<Datum> & Pick<GetLineSegmentsConfig, 'segmentation' | 'sampleRate'>;
export default function SplitLinePath<Datum>({ children, className, curve, defined, segmentation, sampleRate, segments, x, y, styles, }: SplitLinePathProps<Datum>): JSX.Element;
//# sourceMappingURL=SplitLinePath.d.ts.map