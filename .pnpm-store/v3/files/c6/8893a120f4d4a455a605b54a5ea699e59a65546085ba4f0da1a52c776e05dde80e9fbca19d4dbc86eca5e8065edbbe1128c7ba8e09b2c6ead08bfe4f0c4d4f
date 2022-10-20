import { AxisScale } from '@visx/axis';
import React from 'react';
import { GlyphProps, GlyphsProps } from '../../../types';
/** Memoized useTransition config */
export declare function useAnimatedGlyphsConfig<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>({ xScale, yScale, horizontal }: {
    xScale: XScale;
    yScale: YScale;
    horizontal?: boolean;
}): {
    unique: boolean;
    from: ({ x, y, color }: GlyphProps<Datum>) => {
        x: number;
        y: number;
        color: string | undefined;
        opacity: number;
    };
    leave: ({ x, y, color }: GlyphProps<Datum>) => {
        x: number;
        y: number;
        color: string | undefined;
        opacity: number;
    };
    enter: ({ x, y, color }: GlyphProps<Datum>) => {
        x: number;
        y: number;
        color: string | undefined;
        opacity: number;
    };
    update: ({ x, y, color }: GlyphProps<Datum>) => {
        x: number;
        y: number;
        color: string | undefined;
        opacity: number;
    };
    keys: (glyph: GlyphProps<Datum>) => string;
};
export default function AnimatedGlyphs<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>({ renderGlyph, glyphs, horizontal, xScale, yScale, onBlur, onFocus, onPointerMove, onPointerOut, onPointerUp, }: {
    renderGlyph: React.FC<GlyphProps<Datum>>;
} & GlyphsProps<XScale, YScale, Datum>): JSX.Element;
//# sourceMappingURL=AnimatedGlyphs.d.ts.map