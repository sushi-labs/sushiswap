import { TableInstance, Row, RowModel, TableGenerics } from '../types';
export declare function getExpandedRowModel<TGenerics extends TableGenerics>(): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics>;
export declare function expandRows<TGenerics extends TableGenerics>(rowModel: RowModel<TGenerics>, instance: TableInstance<TGenerics>): {
    rows: Row<TGenerics>[];
    flatRows: Row<TGenerics>[];
    rowsById: Record<string, Row<TGenerics>>;
};
