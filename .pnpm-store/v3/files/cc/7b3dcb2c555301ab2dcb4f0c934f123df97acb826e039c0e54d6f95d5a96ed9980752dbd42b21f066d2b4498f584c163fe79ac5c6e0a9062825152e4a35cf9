import { TableFeature } from '../core/instance';
import { OnChangeFn, Updater, Column, TableGenerics, Cell } from '../types';
export declare type ColumnPinningPosition = false | 'left' | 'right';
export declare type ColumnPinningState = {
    left?: string[];
    right?: string[];
};
export declare type ColumnPinningTableState = {
    columnPinning: ColumnPinningState;
};
export declare type ColumnPinningOptions = {
    onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
    enablePinning?: boolean;
};
export declare type ColumnPinningDefaultOptions = {
    onColumnPinningChange: OnChangeFn<ColumnPinningState>;
};
export declare type ColumnPinningColumnDef = {
    enablePinning?: boolean;
};
export declare type ColumnPinningColumn = {
    getCanPin: () => boolean;
    getPinnedIndex: () => number;
    getIsPinned: () => ColumnPinningPosition;
    pin: (position: ColumnPinningPosition) => void;
};
export declare type ColumnPinningRow<TGenerics extends TableGenerics> = {
    getLeftVisibleCells: () => Cell<TGenerics>[];
    getCenterVisibleCells: () => Cell<TGenerics>[];
    getRightVisibleCells: () => Cell<TGenerics>[];
};
export declare type ColumnPinningInstance<TGenerics extends TableGenerics> = {
    setColumnPinning: (updater: Updater<ColumnPinningState>) => void;
    resetColumnPinning: (defaultState?: boolean) => void;
    getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean;
    getLeftLeafColumns: () => Column<TGenerics>[];
    getRightLeafColumns: () => Column<TGenerics>[];
    getCenterLeafColumns: () => Column<TGenerics>[];
};
export declare const Pinning: TableFeature;
