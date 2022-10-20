interface PointInSegment {
    x: number | undefined;
    y: number | undefined;
}
/** Different algorithms to segment the line */
export declare type LineSegmentation = 'x' | 'y' | 'length';
declare type LineSegments = {
    x: number;
    y: number;
}[][];
export interface GetLineSegmentsConfig {
    /** Full path `d` attribute to be broken up into `n` segments. */
    path: string;
    /** Array of length `n`, where `n` is the number of segments. */
    pointsInSegments: PointInSegment[][];
    /**
     * How to segment the line
     * - `x`: Split based on x-position,
     *  assuming x values increase only (`segment[i].x > segment[i-1].x`)
     *  or decrease only (`segment[i].x < segment[i-1].x`).
     * - `y`: Split based on y-position,
     *  assuming y values increase only (`segment[i].y > segment[i-1].y`)
     *  or decrease only (`segment[i].y < segment[i-1].y`).
     * - `length`: Assuming the path length between consecutive points are equal.
     *
     * Default is `x`.
     */
    segmentation: LineSegmentation;
    /**
     * The `path` will be sampled every `sampleRate` pixel to generate the returned points.
     * Default is `1` pixel.
     */
    sampleRate?: number;
}
export default function getSplitLineSegments({ path, pointsInSegments, segmentation, sampleRate, }: GetLineSegmentsConfig): LineSegments;
export {};
//# sourceMappingURL=getSplitLineSegments.d.ts.map