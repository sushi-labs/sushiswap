import { TableFeature } from '../core/instance';
import { OnChangeFn, TableGenerics, Updater } from '../types';
import { ColumnPinningPosition } from './Pinning';
export declare type ColumnSizingTableState = {
    columnSizing: ColumnSizingState;
    columnSizingInfo: ColumnSizingInfoState;
};
export declare type ColumnSizingState = Record<string, number>;
export declare type ColumnSizingInfoState = {
    startOffset: null | number;
    startSize: null | number;
    deltaOffset: null | number;
    deltaPercentage: null | number;
    isResizingColumn: false | string;
    columnSizingStart: [string, number][];
};
export declare type ColumnResizeMode = 'onChange' | 'onEnd';
export declare type ColumnSizingOptions = {
    enableColumnResizing?: boolean;
    columnResizeMode?: ColumnResizeMode;
    onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
    onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>;
};
export declare type ColumnSizingDefaultOptions = {
    columnResizeMode: ColumnResizeMode;
    onColumnSizingChange: OnChangeFn<ColumnSizingState>;
    onColumnSizingInfoChange: OnChangeFn<ColumnSizingInfoState>;
};
export declare type ColumnSizingInstance<TGenerics extends TableGenerics> = {
    setColumnSizing: (updater: Updater<ColumnSizingState>) => void;
    setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void;
    resetColumnSizing: (defaultState?: boolean) => void;
    resetHeaderSizeInfo: (defaultState?: boolean) => void;
    getTotalSize: () => number;
    getLeftTotalSize: () => number;
    getCenterTotalSize: () => number;
    getRightTotalSize: () => number;
};
export declare type ColumnSizingColumnDef = {
    enableResizing?: boolean;
    size?: number;
    minSize?: number;
    maxSize?: number;
};
export declare type ColumnSizingColumn<TGenerics extends TableGenerics> = {
    getSize: () => number;
    getStart: (position?: ColumnPinningPosition) => number;
    getCanResize: () => boolean;
    getIsResizing: () => boolean;
    resetSize: () => void;
};
export declare type ColumnSizingHeader<TGenerics extends TableGenerics> = {
    getSize: () => number;
    getStart: (position?: ColumnPinningPosition) => number;
    getResizeHandler: () => (event: unknown) => void;
};
export declare const defaultColumnSizing: {
    size: number;
    minSize: number;
    maxSize: number;
};
export declare const ColumnSizing: TableFeature;
export declare function passiveEventSupported(): boolean;
