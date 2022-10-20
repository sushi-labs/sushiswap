import { ReactNode } from 'react';
import { NoInfer, Falsy } from '@react-spring/types';
import { Valid } from '../types/common';
import { PickAnimated, SpringValues } from '../types';
import { UseSpringProps } from '../hooks/useSpring';
export declare type TrailComponentProps<Item, Props extends object = any> = unknown & UseSpringProps<Props> & {
    items: readonly Item[];
    children: (item: NoInfer<Item>, index: number) => ((values: SpringValues<PickAnimated<Props>>) => ReactNode) | Falsy;
};
export declare function Trail<Item, Props extends TrailComponentProps<Item>>({ items, children, ...props }: Props & Valid<Props, TrailComponentProps<Item, Props>>): (string | number | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactFragment | null | undefined)[];
