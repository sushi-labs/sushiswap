import React, { MutableRefObject, Ref, MouseEventHandler } from 'react';
import { Props } from '../../types.js';
import { PropsForFeatures } from '../../utils/render.js';
declare type MouseEvent<T> = Parameters<MouseEventHandler<T>>[0];
interface PopoverRenderPropArg {
    open: boolean;
    close(focusableElement?: HTMLElement | MutableRefObject<HTMLElement | null> | MouseEvent<HTMLElement>): void;
}
interface ButtonRenderPropArg {
    open: boolean;
}
declare type ButtonPropsWeControl = 'id' | 'type' | 'aria-expanded' | 'aria-controls' | 'onKeyDown' | 'onClick';
interface OverlayRenderPropArg {
    open: boolean;
}
declare type OverlayPropsWeControl = 'id' | 'aria-hidden' | 'onClick';
declare let OverlayRenderFeatures: number;
interface PanelRenderPropArg {
    open: boolean;
    close: (focusableElement?: HTMLElement | MutableRefObject<HTMLElement | null>) => void;
}
declare type PanelPropsWeControl = 'id' | 'onKeyDown';
declare let PanelRenderFeatures: number;
interface GroupRenderPropArg {
}
declare type GroupPropsWeControl = 'id';
export declare let Popover: (<TTag extends React.ElementType<any> = "div">(props: Props<TTag, PopoverRenderPropArg, "1D45E01E-AF44-47C4-988A-19A94EBAF55C">, ref: Ref<HTMLElement>) => JSX.Element) & {
    displayName: string;
} & {
    Button: (<TTag_1 extends React.ElementType<any> = "button">(props: Props<TTag_1, ButtonRenderPropArg, ButtonPropsWeControl>, ref: Ref<HTMLButtonElement>) => JSX.Element) & {
        displayName: string;
    };
    Overlay: (<TTag_2 extends React.ElementType<any> = "div">(props: Props<TTag_2, OverlayRenderPropArg, OverlayPropsWeControl> & (({
        static?: undefined;
    } & {
        unmount?: boolean | undefined;
    }) | ({
        unmount?: undefined;
    } & {
        static?: boolean | undefined;
    })), ref: Ref<HTMLDivElement>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
        displayName: string;
    };
    Panel: (<TTag_3 extends React.ElementType<any> = "div">(props: Props<TTag_3, PanelRenderPropArg, PanelPropsWeControl> & (({
        static?: undefined;
    } & {
        unmount?: boolean | undefined;
    }) | ({
        unmount?: undefined;
    } & {
        static?: boolean | undefined;
    })) & {
        focus?: boolean | undefined;
    }, ref: Ref<HTMLDivElement>) => JSX.Element) & {
        displayName: string;
    };
    Group: (<TTag_4 extends React.ElementType<any> = "div">(props: Props<TTag_4, GroupRenderPropArg, "id">, ref: Ref<HTMLElement>) => JSX.Element) & {
        displayName: string;
    };
};
export {};
