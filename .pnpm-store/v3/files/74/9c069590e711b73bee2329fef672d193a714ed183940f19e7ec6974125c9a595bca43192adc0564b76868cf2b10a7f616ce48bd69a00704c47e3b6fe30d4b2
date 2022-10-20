import { ElementType } from 'react';
import * as konva from 'react-konva';
export declare type KonvaExports = typeof konva;
export declare type Primitives = {
    [P in keyof KonvaExports]: KonvaExports[P] extends ElementType ? P : never;
}[keyof KonvaExports];
export declare const primitives: Primitives[];
