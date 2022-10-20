import { Cell, Row, TableGenerics, TableInstance } from '../types';
export declare type CoreRow<TGenerics extends TableGenerics> = {
    id: string;
    index: number;
    original?: TGenerics['Row'];
    depth: number;
    _valuesCache: Record<string, any>;
    getValue: (columnId: string) => any;
    subRows: Row<TGenerics>[];
    getLeafRows: () => Row<TGenerics>[];
    originalSubRows?: TGenerics['Row'][];
    getAllCells: () => Cell<TGenerics>[];
    _getAllCellsByColumnId: () => Record<string, Cell<TGenerics>>;
};
export declare const createRow: <TGenerics extends TableGenerics>(instance: TableInstance<TGenerics>, id: string, original: TGenerics["Row"] | undefined, rowIndex: number, depth: number, subRows?: Row<TGenerics>[] | undefined) => Row<TGenerics>;
