import { TableFeature } from '../core/instance';
import { Cell, Column, OnChangeFn, TableGenerics, Updater } from '../types';
export declare type VisibilityState = Record<string, boolean>;
export declare type VisibilityTableState = {
    columnVisibility: VisibilityState;
};
export declare type VisibilityOptions = {
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    enableHiding?: boolean;
};
export declare type VisibilityDefaultOptions = {
    onColumnVisibilityChange: OnChangeFn<VisibilityState>;
};
export declare type VisibilityInstance<TGenerics extends TableGenerics> = {
    getVisibleFlatColumns: () => Column<TGenerics>[];
    getVisibleLeafColumns: () => Column<TGenerics>[];
    getLeftVisibleLeafColumns: () => Column<TGenerics>[];
    getRightVisibleLeafColumns: () => Column<TGenerics>[];
    getCenterVisibleLeafColumns: () => Column<TGenerics>[];
    setColumnVisibility: (updater: Updater<VisibilityState>) => void;
    resetColumnVisibility: (defaultState?: boolean) => void;
    toggleAllColumnsVisible: (value?: boolean) => void;
    getIsAllColumnsVisible: () => boolean;
    getIsSomeColumnsVisible: () => boolean;
    getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void;
};
export declare type VisibilityColumnDef = {
    enableHiding?: boolean;
};
export declare type VisibilityRow<TGenerics extends TableGenerics> = {
    _getAllVisibleCells: () => Cell<TGenerics>[];
    getVisibleCells: () => Cell<TGenerics>[];
};
export declare type VisibilityColumn = {
    getCanHide: () => boolean;
    getIsVisible: () => boolean;
    toggleVisibility: (value?: boolean) => void;
    getToggleVisibilityHandler: () => (event: unknown) => void;
};
export declare const Visibility: TableFeature;
