import { ElementType } from 'react';
import * as Zdog from 'react-zdog';
declare type ZdogExports = typeof Zdog;
declare type ZdogElements = {
    [P in keyof ZdogExports]: P extends 'Illustration' ? never : ZdogExports[P] extends ElementType ? P : never;
}[keyof ZdogExports];
export declare const primitives: {
    [key in ZdogElements]: ElementType;
};
export {};
