import * as React from 'react';
export * from '@tanstack/table-core';
import { TableOptions, TableInstance, Table, TableGenerics, Overwrite } from '@tanstack/table-core';
export declare type Renderable<TProps> = React.ReactNode | React.FunctionComponent<TProps> | React.Component<TProps>;
export declare type Render = <TProps extends {}>(Comp: Renderable<TProps>, props: TProps) => React.ReactNode | JSX.Element;
export declare type ReactTableGenerics = Overwrite<TableGenerics, {
    Renderer: Render;
    Rendered: ReturnType<Render>;
}>;
export declare const render: Render;
export declare const createTable: () => Table<{
    Renderer: Render;
    Rendered: React.ReactNode | JSX.Element;
}>;
export declare type UseTableInstanceOptions<TGenerics extends ReactTableGenerics> = TableOptions<TGenerics>;
export declare function useTableInstance<TGenerics extends ReactTableGenerics>(table: Table<TGenerics>, options: UseTableInstanceOptions<TGenerics>): TableInstance<TGenerics>;
