import { FunctionComponent } from "preact";
export interface SnackbarOptions {
    darkMode: boolean;
}
export interface SnackbarInstanceProps {
    message?: string;
    menuItems?: SnackbarMenuItem[];
    autoExpand?: boolean;
}
export interface SnackbarMenuItem {
    isRed: boolean;
    info: string;
    svgWidth: string;
    svgHeight: string;
    path: string;
    defaultFillRule: string;
    defaultClipRule: string;
    onClick: () => void;
}
export declare class Snackbar {
    private readonly darkMode;
    private readonly items;
    private nextItemKey;
    private root;
    constructor(options: Readonly<SnackbarOptions>);
    attach(el: Element): void;
    presentItem(itemProps: SnackbarInstanceProps): () => void;
    clear(): void;
    private render;
}
export declare const SnackbarContainer: FunctionComponent<{
    darkMode: boolean;
}>;
export declare const SnackbarInstance: FunctionComponent<SnackbarInstanceProps>;
