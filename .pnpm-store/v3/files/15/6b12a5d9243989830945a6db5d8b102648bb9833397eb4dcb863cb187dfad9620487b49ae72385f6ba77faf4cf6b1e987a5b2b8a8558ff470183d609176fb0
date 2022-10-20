import { OnChangeFn, Updater, Column, TableGenerics } from '../types';
import { TableFeature } from '../core/instance';
export declare type ColumnOrderTableState = {
    columnOrder: ColumnOrderState;
};
export declare type ColumnOrderState = string[];
export declare type ColumnOrderOptions = {
    onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
};
export declare type ColumnOrderDefaultOptions = {
    onColumnOrderChange: OnChangeFn<ColumnOrderState>;
};
export declare type ColumnOrderInstance<TGenerics extends TableGenerics> = {
    setColumnOrder: (updater: Updater<ColumnOrderState>) => void;
    resetColumnOrder: (defaultState?: boolean) => void;
    _getOrderColumnsFn: () => (columns: Column<TGenerics>[]) => Column<TGenerics>[];
};
export declare const Ordering: TableFeature;
