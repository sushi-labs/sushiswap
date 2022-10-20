import { TableFeature } from '../core/instance';
import { OnChangeFn, TableGenerics, TableInstance, Row, RowModel, Updater } from '../types';
export declare type RowSelectionState = Record<string, boolean>;
export declare type RowSelectionTableState = {
    rowSelection: RowSelectionState;
};
export declare type RowSelectionOptions<TGenerics extends TableGenerics> = {
    enableRowSelection?: boolean | ((row: Row<TGenerics>) => boolean);
    enableMultiRowSelection?: boolean | ((row: Row<TGenerics>) => boolean);
    enableSubRowSelection?: boolean | ((row: Row<TGenerics>) => boolean);
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
};
export declare type RowSelectionRow = {
    getIsSelected: () => boolean;
    getIsSomeSelected: () => boolean;
    getCanSelect: () => boolean;
    getCanMultiSelect: () => boolean;
    getCanSelectSubRows: () => boolean;
    toggleSelected: (value?: boolean) => void;
    getToggleSelectedHandler: () => (event: unknown) => void;
};
export declare type RowSelectionInstance<TGenerics extends TableGenerics> = {
    getToggleAllRowsSelectedHandler: () => (event: unknown) => void;
    getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void;
    setRowSelection: (updater: Updater<RowSelectionState>) => void;
    resetRowSelection: (defaultState?: boolean) => void;
    getIsAllRowsSelected: () => boolean;
    getIsAllPageRowsSelected: () => boolean;
    getIsSomeRowsSelected: () => boolean;
    getIsSomePageRowsSelected: () => boolean;
    toggleAllRowsSelected: (value: boolean) => void;
    toggleAllPageRowsSelected: (value: boolean) => void;
    getPreSelectedRowModel: () => RowModel<TGenerics>;
    getSelectedRowModel: () => RowModel<TGenerics>;
    getFilteredSelectedRowModel: () => RowModel<TGenerics>;
    getGroupedSelectedRowModel: () => RowModel<TGenerics>;
};
export declare const RowSelection: TableFeature;
export declare function selectRowsFn<TGenerics extends TableGenerics>(instance: TableInstance<TGenerics>, rowModel: RowModel<TGenerics>): RowModel<TGenerics>;
export declare function isRowSelected<TGenerics extends TableGenerics>(row: Row<TGenerics>, selection: Record<string, boolean>, instance: TableInstance<TGenerics>): boolean | 'some';
