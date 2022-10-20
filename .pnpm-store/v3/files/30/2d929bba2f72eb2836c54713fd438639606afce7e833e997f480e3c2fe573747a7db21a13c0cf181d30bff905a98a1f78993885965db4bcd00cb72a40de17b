import { Cell, Column, Row, TableGenerics, TableInstance } from '../types';
export declare type CoreCell<TGenerics extends TableGenerics> = {
    id: string;
    getValue: () => TGenerics['Value'];
    row: Row<TGenerics>;
    column: Column<TGenerics>;
    renderCell: () => string | null | TGenerics['Rendered'];
};
export declare function createCell<TGenerics extends TableGenerics>(instance: TableInstance<TGenerics>, row: Row<TGenerics>, column: Column<TGenerics>, columnId: string): Cell<TGenerics>;
