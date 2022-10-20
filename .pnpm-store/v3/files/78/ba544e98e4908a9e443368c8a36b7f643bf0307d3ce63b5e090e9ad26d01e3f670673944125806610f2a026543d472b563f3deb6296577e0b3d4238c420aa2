import { Column, Header, HeaderGroup, TableGenerics, TableInstance } from '../types';
import { TableFeature } from './instance';
export declare type CoreHeaderGroup<TGenerics extends TableGenerics> = {
    id: string;
    depth: number;
    headers: Header<TGenerics>[];
};
export declare type CoreHeader<TGenerics extends TableGenerics> = {
    id: string;
    index: number;
    depth: number;
    column: Column<TGenerics>;
    headerGroup: HeaderGroup<TGenerics>;
    subHeaders: Header<TGenerics>[];
    colSpan: number;
    rowSpan: number;
    getLeafHeaders: () => Header<TGenerics>[];
    isPlaceholder: boolean;
    placeholderId?: string;
    renderHeader: (options?: {
        renderPlaceholder?: boolean;
    }) => string | null | TGenerics['Rendered'];
    renderFooter: (options?: {
        renderPlaceholder?: boolean;
    }) => string | null | TGenerics['Rendered'];
};
export declare type HeadersInstance<TGenerics extends TableGenerics> = {
    getHeaderGroups: () => HeaderGroup<TGenerics>[];
    getLeftHeaderGroups: () => HeaderGroup<TGenerics>[];
    getCenterHeaderGroups: () => HeaderGroup<TGenerics>[];
    getRightHeaderGroups: () => HeaderGroup<TGenerics>[];
    getFooterGroups: () => HeaderGroup<TGenerics>[];
    getLeftFooterGroups: () => HeaderGroup<TGenerics>[];
    getCenterFooterGroups: () => HeaderGroup<TGenerics>[];
    getRightFooterGroups: () => HeaderGroup<TGenerics>[];
    getFlatHeaders: () => Header<TGenerics>[];
    getLeftFlatHeaders: () => Header<TGenerics>[];
    getCenterFlatHeaders: () => Header<TGenerics>[];
    getRightFlatHeaders: () => Header<TGenerics>[];
    getLeafHeaders: () => Header<TGenerics>[];
    getLeftLeafHeaders: () => Header<TGenerics>[];
    getCenterLeafHeaders: () => Header<TGenerics>[];
    getRightLeafHeaders: () => Header<TGenerics>[];
};
export declare const Headers: TableFeature;
export declare function buildHeaderGroups<TGenerics extends TableGenerics>(allColumns: Column<TGenerics>[], columnsToGroup: Column<TGenerics>[], instance: TableInstance<TGenerics>, headerFamily?: 'center' | 'left' | 'right'): HeaderGroup<TGenerics>[];
