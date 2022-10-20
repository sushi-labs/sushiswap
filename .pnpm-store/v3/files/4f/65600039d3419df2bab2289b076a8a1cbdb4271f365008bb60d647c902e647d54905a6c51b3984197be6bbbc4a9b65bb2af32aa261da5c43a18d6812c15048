import { ReactNode } from 'react';
import * as yoga_layout from 'yoga-layout';

declare let Yoga: typeof yoga_layout;
declare function init(yoga: typeof Yoga): void;

/**
 * This class handles everything related to fonts.
 */

declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
declare type Style = 'normal' | 'italic';
interface FontOptions {
    data: Buffer | ArrayBuffer;
    name: string;
    weight?: Weight;
    style?: Style;
}

interface SatoriOptions {
    width: number;
    height: number;
    fonts: FontOptions[];
    embedFont?: boolean;
    debug?: boolean;
    graphemeImages?: Record<string, string>;
    loadAdditionalAsset?: (languageCode: string, segment: string) => Promise<FontOptions | string | undefined>;
}

declare function satori(element: ReactNode, options: SatoriOptions): Promise<string>;

export { SatoriOptions, satori as default, init };
