import { Cell, Column, Header, TableGenerics, TableInstance, Row, AccessorFn, ColumnDef, Renderable } from '../types';
export declare type CoreColumnDefType = 'data' | 'display' | 'group';
export declare type CoreColumnDef<TGenerics extends TableGenerics> = {
    id: string;
    accessorKey?: string & keyof TGenerics['Row'];
    accessorFn?: AccessorFn<TGenerics['Row']>;
    columns?: ColumnDef<TGenerics>[];
    header?: Renderable<TGenerics, {
        instance: TableInstance<TGenerics>;
        header: Header<TGenerics>;
        column: Column<TGenerics>;
    }>;
    footer?: Renderable<TGenerics, {
        instance: TableInstance<TGenerics>;
        header: Header<TGenerics>;
        column: Column<TGenerics>;
    }>;
    cell?: Renderable<TGenerics, {
        instance: TableInstance<TGenerics>;
        row: Row<TGenerics>;
        column: Column<TGenerics>;
        cell: Cell<TGenerics>;
        getValue: () => TGenerics['Value'];
    }>;
    meta?: TGenerics['ColumnMeta'];
};
export declare type CoreColumn<TGenerics extends TableGenerics> = {
    id: string;
    depth: number;
    accessorFn?: AccessorFn<TGenerics['Row']>;
    columnDef: ColumnDef<TGenerics>;
    columnDefType: CoreColumnDefType;
    columns: Column<TGenerics>[];
    parent?: Column<TGenerics>;
    getFlatColumns: () => Column<TGenerics>[];
    getLeafColumns: () => Column<TGenerics>[];
};
export declare function createColumn<TGenerics extends TableGenerics>(instance: TableInstance<TGenerics>, columnDef: ColumnDef<TGenerics> & {
    columnDefType?: CoreColumnDefType;
}, depth: number, parent?: Column<TGenerics>): Column<TGenerics>;
