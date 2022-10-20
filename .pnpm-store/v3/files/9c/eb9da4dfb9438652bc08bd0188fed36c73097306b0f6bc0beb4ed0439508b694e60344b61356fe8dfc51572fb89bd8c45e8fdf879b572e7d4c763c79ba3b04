import type { ReactElement } from 'react';
import type { SatoriOptions } from 'satori';
import { EmojiType } from './emoji';
export declare type ImageResponseOptions = ConstructorParameters<typeof Response>[1] & {
    /**
     * The width of the image.
     *
     * @type {number}
     * @default 1200
     */
    width?: number;
    /**
     * The height of the image.
     *
     * @type {number}
     * @default 630
     */
    height?: number;
    /**
     * Display debug information on the image.
     *
     * @type {boolean}
     * @default false
     */
    debug?: boolean;
    /**
     * A list of fonts to use.
     *
     * @type {{ data: ArrayBuffer; name: string; weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; style?: 'normal' | 'italic' }[]}
     * @default Noto Sans Latin Regular.
     */
    fonts?: SatoriOptions['fonts'];
    /**
     * Using a specific Emoji style. Defaults to `twemoji`.
     *
     * @link https://github.com/vercel/og#emoji
     * @type {EmojiType}
     * @default 'twemoji'
     */
    emoji?: EmojiType;
};
export declare class ImageResponse {
    constructor(element: ReactElement, options?: ImageResponseOptions);
}
