/**
 * table-core
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
declare type VisibilityState = Record<string, boolean>;
declare type VisibilityTableState = {
    columnVisibility: VisibilityState;
};
declare type VisibilityOptions = {
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    enableHiding?: boolean;
};
declare type VisibilityDefaultOptions = {
    onColumnVisibilityChange: OnChangeFn<VisibilityState>;
};
declare type VisibilityInstance<TData extends RowData> = {
    getVisibleFlatColumns: () => Column<TData, unknown>[];
    getVisibleLeafColumns: () => Column<TData, unknown>[];
    getLeftVisibleLeafColumns: () => Column<TData, unknown>[];
    getRightVisibleLeafColumns: () => Column<TData, unknown>[];
    getCenterVisibleLeafColumns: () => Column<TData, unknown>[];
    setColumnVisibility: (updater: Updater<VisibilityState>) => void;
    resetColumnVisibility: (defaultState?: boolean) => void;
    toggleAllColumnsVisible: (value?: boolean) => void;
    getIsAllColumnsVisible: () => boolean;
    getIsSomeColumnsVisible: () => boolean;
    getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void;
};
declare type VisibilityColumnDef = {
    enableHiding?: boolean;
};
declare type VisibilityRow<TData extends RowData> = {
    _getAllVisibleCells: () => Cell<TData, unknown>[];
    getVisibleCells: () => Cell<TData, unknown>[];
};
declare type VisibilityColumn = {
    getCanHide: () => boolean;
    getIsVisible: () => boolean;
    toggleVisibility: (value?: boolean) => void;
    getToggleVisibilityHandler: () => (event: unknown) => void;
};
declare const Visibility: TableFeature;

declare type ColumnOrderTableState = {
    columnOrder: ColumnOrderState;
};
declare type ColumnOrderState = string[];
declare type ColumnOrderOptions = {
    onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
};
declare type ColumnOrderDefaultOptions = {
    onColumnOrderChange: OnChangeFn<ColumnOrderState>;
};
declare type ColumnOrderInstance<TData extends RowData> = {
    setColumnOrder: (updater: Updater<ColumnOrderState>) => void;
    resetColumnOrder: (defaultState?: boolean) => void;
    _getOrderColumnsFn: () => (columns: Column<TData, unknown>[]) => Column<TData, unknown>[];
};
declare const Ordering: TableFeature;

declare type ColumnPinningPosition = false | 'left' | 'right';
declare type ColumnPinningState = {
    left?: string[];
    right?: string[];
};
declare type ColumnPinningTableState = {
    columnPinning: ColumnPinningState;
};
declare type ColumnPinningOptions = {
    onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
    enablePinning?: boolean;
};
declare type ColumnPinningDefaultOptions = {
    onColumnPinningChange: OnChangeFn<ColumnPinningState>;
};
declare type ColumnPinningColumnDef = {
    enablePinning?: boolean;
};
declare type ColumnPinningColumn = {
    getCanPin: () => boolean;
    getPinnedIndex: () => number;
    getIsPinned: () => ColumnPinningPosition;
    pin: (position: ColumnPinningPosition) => void;
};
declare type ColumnPinningRow<TData extends RowData> = {
    getLeftVisibleCells: () => Cell<TData, unknown>[];
    getCenterVisibleCells: () => Cell<TData, unknown>[];
    getRightVisibleCells: () => Cell<TData, unknown>[];
};
declare type ColumnPinningInstance<TData extends RowData> = {
    setColumnPinning: (updater: Updater<ColumnPinningState>) => void;
    resetColumnPinning: (defaultState?: boolean) => void;
    getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean;
    getLeftLeafColumns: () => Column<TData, unknown>[];
    getRightLeafColumns: () => Column<TData, unknown>[];
    getCenterLeafColumns: () => Column<TData, unknown>[];
};
declare const Pinning: TableFeature;

declare type CoreHeaderGroup<TData extends RowData> = {
    id: string;
    depth: number;
    headers: Header<TData, unknown>[];
};
declare type HeaderContext<TData, TValue> = {
    table: Table<TData>;
    header: Header<TData, TValue>;
    column: Column<TData, TValue>;
};
declare type CoreHeader<TData extends RowData, TValue> = {
    id: string;
    index: number;
    depth: number;
    column: Column<TData, TValue>;
    headerGroup: HeaderGroup<TData>;
    subHeaders: Header<TData, TValue>[];
    colSpan: number;
    rowSpan: number;
    getLeafHeaders: () => Header<TData, unknown>[];
    isPlaceholder: boolean;
    placeholderId?: string;
    getContext: () => HeaderContext<TData, TValue>;
};
declare type HeadersInstance<TData extends RowData> = {
    getHeaderGroups: () => HeaderGroup<TData>[];
    getLeftHeaderGroups: () => HeaderGroup<TData>[];
    getCenterHeaderGroups: () => HeaderGroup<TData>[];
    getRightHeaderGroups: () => HeaderGroup<TData>[];
    getFooterGroups: () => HeaderGroup<TData>[];
    getLeftFooterGroups: () => HeaderGroup<TData>[];
    getCenterFooterGroups: () => HeaderGroup<TData>[];
    getRightFooterGroups: () => HeaderGroup<TData>[];
    getFlatHeaders: () => Header<TData, unknown>[];
    getLeftFlatHeaders: () => Header<TData, unknown>[];
    getCenterFlatHeaders: () => Header<TData, unknown>[];
    getRightFlatHeaders: () => Header<TData, unknown>[];
    getLeafHeaders: () => Header<TData, unknown>[];
    getLeftLeafHeaders: () => Header<TData, unknown>[];
    getCenterLeafHeaders: () => Header<TData, unknown>[];
    getRightLeafHeaders: () => Header<TData, unknown>[];
};
declare const Headers: TableFeature;
declare function buildHeaderGroups<TData extends RowData>(allColumns: Column<TData, unknown>[], columnsToGroup: Column<TData, unknown>[], table: Table<TData>, headerFamily?: 'center' | 'left' | 'right'): HeaderGroup<TData>[];

declare const filterFns: {
    includesString: FilterFn<any>;
    includesStringSensitive: FilterFn<any>;
    equalsString: FilterFn<any>;
    arrIncludes: FilterFn<any>;
    arrIncludesAll: FilterFn<any>;
    arrIncludesSome: FilterFn<any>;
    equals: FilterFn<any>;
    weakEquals: FilterFn<any>;
    inNumberRange: FilterFn<any>;
};
declare type BuiltInFilterFn = keyof typeof filterFns;

declare type FiltersTableState = {
    columnFilters: ColumnFiltersState;
    globalFilter: any;
};
declare type ColumnFiltersState = ColumnFilter[];
declare type ColumnFilter = {
    id: string;
    value: unknown;
};
declare type ResolvedColumnFilter<TData extends RowData> = {
    id: string;
    resolvedValue: unknown;
    filterFn: FilterFn<TData>;
};
declare type FilterFn<TData extends RowData> = {
    (row: Row<TData>, columnId: string, filterValue: any, addMeta: (meta: FilterMeta) => void): boolean;
    resolveFilterValue?: TransformFilterValueFn<TData>;
    autoRemove?: ColumnFilterAutoRemoveTestFn<TData>;
};
declare type TransformFilterValueFn<TData extends RowData> = (value: any, column?: Column<TData, unknown>) => unknown;
declare type ColumnFilterAutoRemoveTestFn<TData extends RowData> = (value: any, column?: Column<TData, unknown>) => boolean;
declare type CustomFilterFns<TData extends RowData> = Record<string, FilterFn<TData>>;
declare type FilterFnOption<TData extends RowData> = 'auto' | BuiltInFilterFn | keyof FilterFns | FilterFn<TData>;
declare type FiltersColumnDef<TData extends RowData> = {
    filterFn?: FilterFnOption<TData>;
    enableColumnFilter?: boolean;
    enableGlobalFilter?: boolean;
};
declare type FiltersColumn<TData extends RowData> = {
    getAutoFilterFn: () => FilterFn<TData> | undefined;
    getFilterFn: () => FilterFn<TData> | undefined;
    setFilterValue: (updater: Updater<any>) => void;
    getCanFilter: () => boolean;
    getCanGlobalFilter: () => boolean;
    getFacetedRowModel: () => RowModel<TData>;
    _getFacetedRowModel?: () => RowModel<TData>;
    getIsFiltered: () => boolean;
    getFilterValue: () => unknown;
    getFilterIndex: () => number;
    getFacetedUniqueValues: () => Map<any, number>;
    _getFacetedUniqueValues?: () => Map<any, number>;
    getFacetedMinMaxValues: () => undefined | [number, number];
    _getFacetedMinMaxValues?: () => undefined | [number, number];
};
declare type FiltersRow<TData extends RowData> = {
    columnFilters: Record<string, boolean>;
    columnFiltersMeta: Record<string, FilterMeta>;
};
declare type FiltersOptions<TData extends RowData> = {
    enableFilters?: boolean;
    manualFiltering?: boolean;
    filterFromLeafRows?: boolean;
    getFilteredRowModel?: (table: Table<any>) => () => RowModel<any>;
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    enableColumnFilters?: boolean;
    globalFilterFn?: FilterFnOption<TData>;
    onGlobalFilterChange?: OnChangeFn<any>;
    enableGlobalFilter?: boolean;
    getColumnCanGlobalFilter?: (column: Column<TData, unknown>) => boolean;
    getFacetedRowModel?: (table: Table<TData>, columnId: string) => () => RowModel<TData>;
    getFacetedUniqueValues?: (table: Table<TData>, columnId: string) => () => Map<any, number>;
    getFacetedMinMaxValues?: (table: Table<TData>, columnId: string) => () => undefined | [number, number];
} & (keyof FilterFns extends never ? {
    filterFns?: Record<string, FilterFn<any>>;
} : {
    filterFns: Record<keyof FilterFns, FilterFn<any>>;
});
declare type FiltersInstance<TData extends RowData> = {
    setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
    resetColumnFilters: (defaultState?: boolean) => void;
    getPreFilteredRowModel: () => RowModel<TData>;
    getFilteredRowModel: () => RowModel<TData>;
    _getFilteredRowModel?: () => RowModel<TData>;
    setGlobalFilter: (updater: Updater<any>) => void;
    resetGlobalFilter: (defaultState?: boolean) => void;
    getGlobalAutoFilterFn: () => FilterFn<TData> | undefined;
    getGlobalFilterFn: () => FilterFn<TData> | undefined;
    getGlobalFacetedRowModel: () => RowModel<TData>;
    _getGlobalFacetedRowModel?: () => RowModel<TData>;
    getGlobalFacetedUniqueValues: () => Map<any, number>;
    _getGlobalFacetedUniqueValues?: () => Map<any, number>;
    getGlobalFacetedMinMaxValues: () => undefined | [number, number];
    _getGlobalFacetedMinMaxValues?: () => undefined | [number, number];
};
declare const Filters: TableFeature;
declare function shouldAutoRemoveFilter<TData extends RowData>(filterFn?: FilterFn<TData>, value?: any, column?: Column<TData, unknown>): boolean;

declare const reSplitAlphaNumeric: RegExp;
declare const sortingFns: {
    alphanumeric: SortingFn<any>;
    alphanumericCaseSensitive: SortingFn<any>;
    text: SortingFn<any>;
    textCaseSensitive: SortingFn<any>;
    datetime: SortingFn<any>;
    basic: SortingFn<any>;
};
declare type BuiltInSortingFn = keyof typeof sortingFns;

declare type SortDirection = 'asc' | 'desc';
declare type ColumnSort = {
    id: string;
    desc: boolean;
};
declare type SortingState = ColumnSort[];
declare type SortingTableState = {
    sorting: SortingState;
};
declare type SortingFn<TData extends RowData> = {
    (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number;
};
declare type CustomSortingFns<TData extends RowData> = Record<string, SortingFn<TData>>;
declare type SortingFnOption<TData extends RowData> = 'auto' | keyof SortingFns | BuiltInSortingFn | SortingFn<TData>;
declare type SortingColumnDef<TData extends RowData> = {
    sortingFn?: SortingFnOption<TData>;
    sortDescFirst?: boolean;
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    invertSorting?: boolean;
    sortUndefined?: false | -1 | 1;
};
declare type SortingColumn<TData extends RowData> = {
    getAutoSortingFn: () => SortingFn<TData>;
    getAutoSortDir: () => SortDirection;
    getSortingFn: () => SortingFn<TData>;
    getFirstSortDir: () => SortDirection;
    getNextSortingOrder: () => SortDirection | false;
    getCanSort: () => boolean;
    getCanMultiSort: () => boolean;
    getSortIndex: () => number;
    getIsSorted: () => false | SortDirection;
    clearSorting: () => void;
    toggleSorting: (desc?: boolean, isMulti?: boolean) => void;
    getToggleSortingHandler: () => undefined | ((event: unknown) => void);
};
declare type SortingOptions<TData extends RowData> = {
    manualSorting?: boolean;
    onSortingChange?: OnChangeFn<SortingState>;
    enableSorting?: boolean;
    enableSortingRemoval?: boolean;
    enableMultiRemove?: boolean;
    enableMultiSort?: boolean;
    sortDescFirst?: boolean;
    getSortedRowModel?: (table: Table<any>) => () => RowModel<any>;
    maxMultiSortColCount?: number;
    isMultiSortEvent?: (e: unknown) => boolean;
} & (keyof SortingFns extends never ? {
    sortingFns?: Record<string, SortingFn<any>>;
} : {
    sortingFns: Record<keyof SortingFns, SortingFn<any>>;
});
declare type SortingInstance<TData extends RowData> = {
    setSorting: (updater: Updater<SortingState>) => void;
    resetSorting: (defaultState?: boolean) => void;
    getPreSortedRowModel: () => RowModel<TData>;
    getSortedRowModel: () => RowModel<TData>;
    _getSortedRowModel?: () => RowModel<TData>;
};
declare const Sorting: TableFeature;

declare const aggregationFns: {
    sum: AggregationFn<any>;
    min: AggregationFn<any>;
    max: AggregationFn<any>;
    extent: AggregationFn<any>;
    mean: AggregationFn<any>;
    median: AggregationFn<any>;
    unique: AggregationFn<any>;
    uniqueCount: AggregationFn<any>;
    count: AggregationFn<any>;
};
declare type BuiltInAggregationFn = keyof typeof aggregationFns;

declare type GroupingState = string[];
declare type GroupingTableState = {
    grouping: GroupingState;
};
declare type AggregationFn<TData extends RowData> = (columnId: string, leafRows: Row<TData>[], childRows: Row<TData>[]) => any;
declare type CustomAggregationFns = Record<string, AggregationFn<any>>;
declare type AggregationFnOption<TData extends RowData> = 'auto' | keyof AggregationFns | BuiltInAggregationFn | AggregationFn<TData>;
declare type GroupingColumnDef<TData extends RowData, TValue> = {
    aggregationFn?: AggregationFnOption<TData>;
    aggregatedCell?: ColumnDefTemplate<ReturnType<Cell<TData, TValue>['getContext']>>;
    enableGrouping?: boolean;
};
declare type GroupingColumn<TData extends RowData> = {
    getCanGroup: () => boolean;
    getIsGrouped: () => boolean;
    getGroupedIndex: () => number;
    toggleGrouping: () => void;
    getToggleGroupingHandler: () => () => void;
    getAutoAggregationFn: () => AggregationFn<TData> | undefined;
    getAggregationFn: () => AggregationFn<TData> | undefined;
};
declare type GroupingRow = {
    groupingColumnId?: string;
    groupingValue?: unknown;
    getIsGrouped: () => boolean;
    _groupingValuesCache: Record<string, any>;
};
declare type GroupingCell = {
    getIsGrouped: () => boolean;
    getIsPlaceholder: () => boolean;
    getIsAggregated: () => boolean;
};
declare type ColumnDefaultOptions = {
    onGroupingChange: OnChangeFn<GroupingState>;
    enableGrouping: boolean;
};
declare type GroupingOptions = {
    manualGrouping?: boolean;
    onGroupingChange?: OnChangeFn<GroupingState>;
    enableGrouping?: boolean;
    getGroupedRowModel?: (table: Table<any>) => () => RowModel<any>;
    groupedColumnMode?: false | 'reorder' | 'remove';
} & (keyof AggregationFns extends never ? {
    aggregationFns?: Record<string, AggregationFn<any>>;
} : {
    aggregationFns: Record<keyof AggregationFns, AggregationFn<any>>;
});
declare type GroupingColumnMode = false | 'reorder' | 'remove';
declare type GroupingInstance<TData extends RowData> = {
    setGrouping: (updater: Updater<GroupingState>) => void;
    resetGrouping: (defaultState?: boolean) => void;
    getPreGroupedRowModel: () => RowModel<TData>;
    getGroupedRowModel: () => RowModel<TData>;
    _getGroupedRowModel?: () => RowModel<TData>;
};
declare const Grouping: TableFeature;
declare function orderColumns<TData extends RowData>(leafColumns: Column<TData, unknown>[], grouping: string[], groupedColumnMode?: GroupingColumnMode): Column<TData, unknown>[];

declare type ExpandedStateList = Record<string, boolean>;
declare type ExpandedState = true | Record<string, boolean>;
declare type ExpandedTableState = {
    expanded: ExpandedState;
};
declare type ExpandedRow = {
    toggleExpanded: (expanded?: boolean) => void;
    getIsExpanded: () => boolean;
    getCanExpand: () => boolean;
    getToggleExpandedHandler: () => () => void;
};
declare type ExpandedOptions<TData extends RowData> = {
    manualExpanding?: boolean;
    onExpandedChange?: OnChangeFn<ExpandedState>;
    autoResetExpanded?: boolean;
    enableExpanding?: boolean;
    getExpandedRowModel?: (table: Table<any>) => () => RowModel<any>;
    getIsRowExpanded?: (row: Row<TData>) => boolean;
    getRowCanExpand?: (row: Row<TData>) => boolean;
    paginateExpandedRows?: boolean;
};
declare type ExpandedInstance<TData extends RowData> = {
    _autoResetExpanded: () => void;
    setExpanded: (updater: Updater<ExpandedState>) => void;
    toggleAllRowsExpanded: (expanded?: boolean) => void;
    resetExpanded: (defaultState?: boolean) => void;
    getCanSomeRowsExpand: () => boolean;
    getToggleAllRowsExpandedHandler: () => (event: unknown) => void;
    getIsSomeRowsExpanded: () => boolean;
    getIsAllRowsExpanded: () => boolean;
    getExpandedDepth: () => number;
    getExpandedRowModel: () => RowModel<TData>;
    _getExpandedRowModel?: () => RowModel<TData>;
    getPreExpandedRowModel: () => RowModel<TData>;
};
declare const Expanding: TableFeature;

declare type ColumnSizingTableState = {
    columnSizing: ColumnSizingState;
    columnSizingInfo: ColumnSizingInfoState;
};
declare type ColumnSizingState = Record<string, number>;
declare type ColumnSizingInfoState = {
    startOffset: null | number;
    startSize: null | number;
    deltaOffset: null | number;
    deltaPercentage: null | number;
    isResizingColumn: false | string;
    columnSizingStart: [string, number][];
};
declare type ColumnResizeMode = 'onChange' | 'onEnd';
declare type ColumnSizingOptions = {
    enableColumnResizing?: boolean;
    columnResizeMode?: ColumnResizeMode;
    onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
    onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>;
};
declare type ColumnSizingDefaultOptions = {
    columnResizeMode: ColumnResizeMode;
    onColumnSizingChange: OnChangeFn<ColumnSizingState>;
    onColumnSizingInfoChange: OnChangeFn<ColumnSizingInfoState>;
};
declare type ColumnSizingInstance = {
    setColumnSizing: (updater: Updater<ColumnSizingState>) => void;
    setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void;
    resetColumnSizing: (defaultState?: boolean) => void;
    resetHeaderSizeInfo: (defaultState?: boolean) => void;
    getTotalSize: () => number;
    getLeftTotalSize: () => number;
    getCenterTotalSize: () => number;
    getRightTotalSize: () => number;
};
declare type ColumnSizingColumnDef = {
    enableResizing?: boolean;
    size?: number;
    minSize?: number;
    maxSize?: number;
};
declare type ColumnSizingColumn = {
    getSize: () => number;
    getStart: (position?: ColumnPinningPosition) => number;
    getCanResize: () => boolean;
    getIsResizing: () => boolean;
    resetSize: () => void;
};
declare type ColumnSizingHeader = {
    getSize: () => number;
    getStart: (position?: ColumnPinningPosition) => number;
    getResizeHandler: () => (event: unknown) => void;
};
declare const defaultColumnSizing: {
    size: number;
    minSize: number;
    maxSize: number;
};
declare const ColumnSizing: TableFeature;
declare function passiveEventSupported(): boolean;

declare type PaginationState = {
    pageIndex: number;
    pageSize: number;
};
declare type PaginationTableState = {
    pagination: PaginationState;
};
declare type PaginationInitialTableState = {
    pagination?: Partial<PaginationState>;
};
declare type PaginationOptions = {
    pageCount?: number;
    manualPagination?: boolean;
    onPaginationChange?: OnChangeFn<PaginationState>;
    autoResetPageIndex?: boolean;
    getPaginationRowModel?: (table: Table<any>) => () => RowModel<any>;
};
declare type PaginationDefaultOptions = {
    onPaginationChange: OnChangeFn<PaginationState>;
};
declare type PaginationInstance<TData extends RowData> = {
    _autoResetPageIndex: () => void;
    setPagination: (updater: Updater<PaginationState>) => void;
    resetPagination: (defaultState?: boolean) => void;
    setPageIndex: (updater: Updater<number>) => void;
    resetPageIndex: (defaultState?: boolean) => void;
    setPageSize: (updater: Updater<number>) => void;
    resetPageSize: (defaultState?: boolean) => void;
    setPageCount: (updater: Updater<number>) => void;
    getPageOptions: () => number[];
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    previousPage: () => void;
    nextPage: () => void;
    getPrePaginationRowModel: () => RowModel<TData>;
    getPaginationRowModel: () => RowModel<TData>;
    _getPaginationRowModel?: () => RowModel<TData>;
    getPageCount: () => number;
};
declare const Pagination: TableFeature;

declare type RowSelectionState = Record<string, boolean>;
declare type RowSelectionTableState = {
    rowSelection: RowSelectionState;
};
declare type RowSelectionOptions<TData extends RowData> = {
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
    enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean);
    enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean);
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
};
declare type RowSelectionRow = {
    getIsSelected: () => boolean;
    getIsSomeSelected: () => boolean;
    getIsAllSubRowsSelected: () => boolean;
    getCanSelect: () => boolean;
    getCanMultiSelect: () => boolean;
    getCanSelectSubRows: () => boolean;
    toggleSelected: (value?: boolean) => void;
    getToggleSelectedHandler: () => (event: unknown) => void;
};
declare type RowSelectionInstance<TData extends RowData> = {
    getToggleAllRowsSelectedHandler: () => (event: unknown) => void;
    getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void;
    setRowSelection: (updater: Updater<RowSelectionState>) => void;
    resetRowSelection: (defaultState?: boolean) => void;
    getIsAllRowsSelected: () => boolean;
    getIsAllPageRowsSelected: () => boolean;
    getIsSomeRowsSelected: () => boolean;
    getIsSomePageRowsSelected: () => boolean;
    toggleAllRowsSelected: (value?: boolean) => void;
    toggleAllPageRowsSelected: (value?: boolean) => void;
    getPreSelectedRowModel: () => RowModel<TData>;
    getSelectedRowModel: () => RowModel<TData>;
    getFilteredSelectedRowModel: () => RowModel<TData>;
    getGroupedSelectedRowModel: () => RowModel<TData>;
};
declare const RowSelection: TableFeature;
declare function selectRowsFn<TData extends RowData>(table: Table<TData>, rowModel: RowModel<TData>): RowModel<TData>;
declare function isRowSelected<TData extends RowData>(row: Row<TData>, selection: Record<string, boolean>): boolean;
declare function isSubRowSelected<TData extends RowData>(row: Row<TData>, selection: Record<string, boolean>, table: Table<TData>): boolean | 'some' | 'all';

declare type CoreRow<TData extends RowData> = {
    id: string;
    index: number;
    original: TData;
    depth: number;
    _valuesCache: Record<string, unknown>;
    getValue: <TValue>(columnId: string) => TValue;
    renderValue: <TValue>(columnId: string) => TValue;
    subRows: Row<TData>[];
    getLeafRows: () => Row<TData>[];
    originalSubRows?: TData[];
    getAllCells: () => Cell<TData, unknown>[];
    _getAllCellsByColumnId: () => Record<string, Cell<TData, unknown>>;
};
declare const createRow: <TData extends unknown>(table: Table<TData>, id: string, original: TData, rowIndex: number, depth: number, subRows?: Row<TData>[] | undefined) => Row<TData>;

declare type CellContext<TData extends RowData, TValue> = {
    table: Table<TData>;
    column: Column<TData, TValue>;
    row: Row<TData>;
    cell: Cell<TData, TValue>;
    getValue: Getter<TValue>;
    renderValue: Getter<TValue | null>;
};
declare type CoreCell<TData extends RowData, TValue> = {
    id: string;
    getValue: CellContext<TData, TValue>['getValue'];
    renderValue: CellContext<TData, TValue>['renderValue'];
    row: Row<TData>;
    column: Column<TData, TValue>;
    getContext: () => CellContext<TData, TValue>;
};
declare function createCell<TData extends RowData, TValue>(table: Table<TData>, row: Row<TData>, column: Column<TData, TValue>, columnId: string): Cell<TData, TValue>;

declare type CoreColumn<TData extends RowData, TValue> = {
    id: string;
    depth: number;
    accessorFn?: AccessorFn<TData, TValue>;
    columnDef: ColumnDef<TData, TValue>;
    columns: Column<TData, TValue>[];
    parent?: Column<TData, TValue>;
    getFlatColumns: () => Column<TData, TValue>[];
    getLeafColumns: () => Column<TData, TValue>[];
};
declare function createColumn<TData extends RowData, TValue>(table: Table<TData>, columnDef: ColumnDef<TData, TValue>, depth: number, parent?: Column<TData, TValue>): Column<TData, TValue>;

interface TableMeta<TData extends RowData> {
}
interface ColumnMeta<TData extends RowData, TValue> {
}
interface FilterMeta {
}
interface FilterFns {
}
interface SortingFns {
}
interface AggregationFns {
}
declare type Updater<T> = T | ((old: T) => T);
declare type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void;
declare type RowData = unknown | object | any[];
declare type AnyRender = (Comp: any, props: any) => any;
declare type Table<TData extends RowData> = CoreInstance<TData> & HeadersInstance<TData> & VisibilityInstance<TData> & ColumnOrderInstance<TData> & ColumnPinningInstance<TData> & FiltersInstance<TData> & SortingInstance<TData> & GroupingInstance<TData> & ColumnSizingInstance & ExpandedInstance<TData> & PaginationInstance<TData> & RowSelectionInstance<TData>;
declare type TableOptionsResolved<TData extends RowData> = CoreOptions<TData> & VisibilityOptions & ColumnOrderOptions & ColumnPinningOptions & FiltersOptions<TData> & SortingOptions<TData> & GroupingOptions & ExpandedOptions<TData> & ColumnSizingOptions & PaginationOptions & RowSelectionOptions<TData>;
declare type TableOptions<TData extends RowData> = PartialKeys<TableOptionsResolved<TData>, 'state' | 'onStateChange' | 'renderFallbackValue'>;
declare type TableState = CoreTableState & VisibilityTableState & ColumnOrderTableState & ColumnPinningTableState & FiltersTableState & SortingTableState & ExpandedTableState & GroupingTableState & ColumnSizingTableState & PaginationTableState & RowSelectionTableState;
declare type InitialTableState = Partial<CoreTableState & VisibilityTableState & ColumnOrderTableState & ColumnPinningTableState & FiltersTableState & SortingTableState & ExpandedTableState & GroupingTableState & ColumnSizingTableState & PaginationInitialTableState & RowSelectionTableState>;
declare type Row<TData extends RowData> = CoreRow<TData> & VisibilityRow<TData> & ColumnPinningRow<TData> & FiltersRow<TData> & GroupingRow & RowSelectionRow & ExpandedRow;
declare type RowModel<TData extends RowData> = {
    rows: Row<TData>[];
    flatRows: Row<TData>[];
    rowsById: Record<string, Row<TData>>;
};
declare type AccessorFn<TData extends RowData, TValue = unknown> = (originalRow: TData, index: number) => TValue;
declare type ColumnDefTemplate<TProps extends object> = string | ((props: TProps) => any);
declare type StringOrTemplateHeader<TData, TValue> = string | ColumnDefTemplate<HeaderContext<TData, TValue>>;
declare type StringHeaderIdentifier = {
    header: string;
    id?: string;
};
declare type IdIdentifier<TData extends RowData, TValue> = {
    id: string;
    header?: StringOrTemplateHeader<TData, TValue>;
};
declare type ColumnIdentifiers<TData extends RowData, TValue> = IdIdentifier<TData, TValue> | StringHeaderIdentifier;
declare type ColumnDefBase<TData extends RowData, TValue = unknown> = {
    footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>;
    cell?: ColumnDefTemplate<CellContext<TData, TValue>>;
    meta?: ColumnMeta<TData, TValue>;
} & VisibilityColumnDef & ColumnPinningColumnDef & FiltersColumnDef<TData> & SortingColumnDef<TData> & GroupingColumnDef<TData, TValue> & ColumnSizingColumnDef;
declare type IdentifiedColumnDef<TData extends RowData, TValue = unknown> = ColumnDefBase<TData, TValue> & {
    id?: string;
    header?: StringOrTemplateHeader<TData, TValue>;
};
declare type DisplayColumnDef<TData extends RowData, TValue = unknown> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>;
declare type GroupColumnDef<TData extends RowData, TValue = unknown> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue> & {
    columns?: ColumnDef<TData, any>[];
};
declare type AccessorFnColumnDef<TData extends RowData, TValue = unknown> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue> & {
    accessorFn: AccessorFn<TData, TValue>;
};
declare type AccessorKeyColumnDef<TData extends RowData, TValue = unknown> = {
    id?: string;
} & Partial<ColumnIdentifiers<TData, TValue>> & ColumnDefBase<TData, TValue> & {
    accessorKey: string | keyof TData;
};
declare type AccessorColumnDef<TData extends RowData, TValue = unknown> = AccessorKeyColumnDef<TData, TValue> | AccessorFnColumnDef<TData, TValue>;
declare type ColumnDef<TData extends RowData, TValue = unknown> = DisplayColumnDef<TData, TValue> | GroupColumnDef<TData, TValue> | AccessorColumnDef<TData, TValue>;
declare type ColumnDefResolved<TData extends RowData, TValue = unknown> = Partial<UnionToIntersection<ColumnDef<TData, TValue>>> & {
    accessorKey?: string;
};
declare type Column<TData extends RowData, TValue = unknown> = CoreColumn<TData, TValue> & VisibilityColumn & ColumnPinningColumn & FiltersColumn<TData> & SortingColumn<TData> & GroupingColumn<TData> & ColumnSizingColumn;
declare type Cell<TData extends RowData, TValue> = CoreCell<TData, TValue> & GroupingCell;
declare type Header<TData extends RowData, TValue> = CoreHeader<TData, TValue> & ColumnSizingHeader;
declare type HeaderGroup<TData extends RowData> = CoreHeaderGroup<TData>;

declare type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
declare type Overwrite<T, U extends {
    [TKey in keyof T]?: any;
}> = Omit<T, keyof U> & U;
declare type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;
declare type IsAny<T, Y, N> = 1 extends 0 & T ? Y : N;
declare type IsKnown<T, Y, N> = unknown extends T ? N : Y;
declare type ComputeRange<N extends number, Result extends Array<unknown> = []> = Result['length'] extends N ? Result : ComputeRange<N, [...Result, Result['length']]>;
declare type Index40 = ComputeRange<40>[number];
declare type IsTuple<T> = T extends readonly any[] & {
    length: infer Length;
} ? Length extends Index40 ? T : never : never;
declare type AllowedIndexes<Tuple extends ReadonlyArray<any>, Keys extends number = never> = Tuple extends readonly [] ? Keys : Tuple extends readonly [infer _, ...infer Tail] ? AllowedIndexes<Tail, Keys | Tail['length']> : Keys;
declare type DeepKeys<T> = unknown extends T ? keyof T : object extends T ? string : T extends readonly any[] & IsTuple<T> ? AllowedIndexes<T> | DeepKeysPrefix<T, AllowedIndexes<T>> : T extends any[] ? never & 'Dynamic length array indexing is not supported' : T extends Date ? never : T extends object ? (keyof T & string) | DeepKeysPrefix<T, keyof T> : never;
declare type DeepKeysPrefix<T, TPrefix> = TPrefix extends keyof T & (number | string) ? `${TPrefix}.${DeepKeys<T[TPrefix]> & string}` : never;
declare type DeepValue<T, TProp> = T extends Record<string | number, any> ? TProp extends `${infer TBranch}.${infer TDeepProp}` ? DeepValue<T[TBranch], TDeepProp> : T[TProp & string] : never;
declare type NoInfer<T> = [T][T extends any ? 0 : never];
declare type Getter<TValue> = <TTValue = TValue>() => NoInfer<TTValue>;
declare function functionalUpdate<T>(updater: Updater<T>, input: T): T;
declare function noop(): void;
declare function makeStateUpdater<K extends keyof TableState>(key: K, instance: unknown): (updater: Updater<TableState[K]>) => void;
declare type AnyFunction = (...args: any) => any;
declare function isFunction<T extends AnyFunction>(d: any): d is T;
declare function flattenBy<TNode>(arr: TNode[], getChildren: (item: TNode) => TNode[]): TNode[];
declare function memo<TDeps extends readonly any[], TResult>(getDeps: () => [...TDeps], fn: (...args: NoInfer<[...TDeps]>) => TResult, opts: {
    key: any;
    debug?: () => any;
    onChange?: (result: TResult) => void;
}): () => TResult;

declare type TableFeature = {
    getDefaultOptions?: (table: any) => any;
    getInitialState?: (initialState?: InitialTableState) => any;
    createTable?: (table: any) => any;
    getDefaultColumnDef?: () => any;
    createColumn?: (column: any, table: any) => any;
    createHeader?: (column: any, table: any) => any;
    createCell?: (cell: any, column: any, row: any, table: any) => any;
    createRow?: (row: any, table: any) => any;
};
declare type CoreTableState = {};
declare type CoreOptions<TData extends RowData> = {
    data: TData[];
    state: Partial<TableState>;
    onStateChange: (updater: Updater<TableState>) => void;
    debugAll?: boolean;
    debugTable?: boolean;
    debugHeaders?: boolean;
    debugColumns?: boolean;
    debugRows?: boolean;
    initialState?: InitialTableState;
    autoResetAll?: boolean;
    mergeOptions?: (defaultOptions: TableOptions<TData>, options: Partial<TableOptions<TData>>) => TableOptions<TData>;
    meta?: TableMeta<TData>;
    getCoreRowModel: (table: Table<any>) => () => RowModel<any>;
    getSubRows?: (originalRow: TData, index: number) => undefined | TData[];
    getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
    columns: ColumnDef<TData, any>[];
    defaultColumn?: Partial<ColumnDef<TData, unknown>>;
    renderFallbackValue: any;
};
declare type CoreInstance<TData extends RowData> = {
    initialState: TableState;
    reset: () => void;
    options: RequiredKeys<TableOptionsResolved<TData>, 'state'>;
    setOptions: (newOptions: Updater<TableOptionsResolved<TData>>) => void;
    getState: () => TableState;
    setState: (updater: Updater<TableState>) => void;
    _features: readonly TableFeature[];
    _queue: (cb: () => void) => void;
    _getRowId: (_: TData, index: number, parent?: Row<TData>) => string;
    getCoreRowModel: () => RowModel<TData>;
    _getCoreRowModel?: () => RowModel<TData>;
    getRowModel: () => RowModel<TData>;
    getRow: (id: string) => Row<TData>;
    _getDefaultColumnDef: () => Partial<ColumnDef<TData, unknown>>;
    _getColumnDefs: () => ColumnDef<TData, unknown>[];
    _getAllFlatColumnsById: () => Record<string, Column<TData, unknown>>;
    getAllColumns: () => Column<TData, unknown>[];
    getAllFlatColumns: () => Column<TData, unknown>[];
    getAllLeafColumns: () => Column<TData, unknown>[];
    getColumn: (columnId: string) => Column<TData, unknown>;
};
declare function createTable<TData extends RowData>(options: TableOptionsResolved<TData>): Table<TData>;

declare type ColumnHelper<TData extends RowData> = {
    accessor: <TAccessor extends AccessorFn<TData> | DeepKeys<TData>, TValue extends TAccessor extends AccessorFn<TData, infer TReturn> ? TReturn : TAccessor extends DeepKeys<TData> ? DeepValue<TData, TAccessor> : never>(accessor: TAccessor, column: TAccessor extends AccessorFn<TData> ? DisplayColumnDef<TData, TValue> : IdentifiedColumnDef<TData, TValue>) => ColumnDef<TData, TValue>;
    display: (column: DisplayColumnDef<TData>) => ColumnDef<TData, unknown>;
    group: (column: GroupColumnDef<TData>) => ColumnDef<TData, unknown>;
};
declare function createColumnHelper<TData extends RowData>(): ColumnHelper<TData>;

declare function getCoreRowModel<TData extends RowData>(): (table: Table<TData>) => () => RowModel<TData>;

declare function getFilteredRowModel<TData extends RowData>(): (table: Table<TData>) => () => RowModel<TData>;

declare function getFacetedRowModel<TData extends RowData>(): (table: Table<TData>, columnId: string) => () => RowModel<TData>;

declare function getFacetedUniqueValues<TData extends RowData>(): (table: Table<TData>, columnId: string) => () => Map<any, number>;

declare function getFacetedMinMaxValues<TData extends RowData>(): (table: Table<TData>, columnId: string) => () => undefined | [number, number];

declare function getSortedRowModel<TData extends RowData>(): (table: Table<TData>) => () => RowModel<TData>;

declare function getGroupedRowModel<TData extends RowData>(): (table: Table<TData>) => () => RowModel<TData>;

declare function getExpandedRowModel<TData extends RowData>(): (table: Table<TData>) => () => RowModel<TData>;
declare function expandRows<TData extends RowData>(rowModel: RowModel<TData>): {
    rows: Row<TData>[];
    flatRows: Row<TData>[];
    rowsById: Record<string, Row<TData>>;
};

declare function getPaginationRowModel<TData extends RowData>(opts?: {
    initialSync: boolean;
}): (table: Table<TData>) => () => RowModel<TData>;

export { AccessorColumnDef, AccessorFn, AccessorFnColumnDef, AccessorKeyColumnDef, AggregationFn, AggregationFnOption, AggregationFns, AnyRender, BuiltInAggregationFn, BuiltInFilterFn, BuiltInSortingFn, Cell, CellContext, Column, ColumnDef, ColumnDefBase, ColumnDefResolved, ColumnDefTemplate, ColumnDefaultOptions, ColumnFilter, ColumnFilterAutoRemoveTestFn, ColumnFiltersState, ColumnHelper, ColumnMeta, ColumnOrderDefaultOptions, ColumnOrderInstance, ColumnOrderOptions, ColumnOrderState, ColumnOrderTableState, ColumnPinningColumn, ColumnPinningColumnDef, ColumnPinningDefaultOptions, ColumnPinningInstance, ColumnPinningOptions, ColumnPinningPosition, ColumnPinningRow, ColumnPinningState, ColumnPinningTableState, ColumnResizeMode, ColumnSizing, ColumnSizingColumn, ColumnSizingColumnDef, ColumnSizingDefaultOptions, ColumnSizingHeader, ColumnSizingInfoState, ColumnSizingInstance, ColumnSizingOptions, ColumnSizingState, ColumnSizingTableState, ColumnSort, CoreCell, CoreColumn, CoreHeader, CoreHeaderGroup, CoreInstance, CoreOptions, CoreRow, CoreTableState, CustomAggregationFns, CustomFilterFns, CustomSortingFns, DeepKeys, DeepValue, DisplayColumnDef, ExpandedInstance, ExpandedOptions, ExpandedRow, ExpandedState, ExpandedStateList, ExpandedTableState, Expanding, FilterFn, FilterFnOption, FilterFns, FilterMeta, Filters, FiltersColumn, FiltersColumnDef, FiltersInstance, FiltersOptions, FiltersRow, FiltersTableState, Getter, GroupColumnDef, Grouping, GroupingCell, GroupingColumn, GroupingColumnDef, GroupingColumnMode, GroupingInstance, GroupingOptions, GroupingRow, GroupingState, GroupingTableState, Header, HeaderContext, HeaderGroup, Headers, HeadersInstance, IdentifiedColumnDef, InitialTableState, IsAny, IsKnown, NoInfer, OnChangeFn, Ordering, Overwrite, Pagination, PaginationDefaultOptions, PaginationInitialTableState, PaginationInstance, PaginationOptions, PaginationState, PaginationTableState, PartialKeys, Pinning, RequiredKeys, ResolvedColumnFilter, Row, RowData, RowModel, RowSelection, RowSelectionInstance, RowSelectionOptions, RowSelectionRow, RowSelectionState, RowSelectionTableState, SortDirection, Sorting, SortingColumn, SortingColumnDef, SortingFn, SortingFnOption, SortingFns, SortingInstance, SortingOptions, SortingState, SortingTableState, StringOrTemplateHeader, Table, TableFeature, TableMeta, TableOptions, TableOptionsResolved, TableState, TransformFilterValueFn, UnionToIntersection, Updater, Visibility, VisibilityColumn, VisibilityColumnDef, VisibilityDefaultOptions, VisibilityInstance, VisibilityOptions, VisibilityRow, VisibilityState, VisibilityTableState, aggregationFns, buildHeaderGroups, createCell, createColumn, createColumnHelper, createRow, createTable, defaultColumnSizing, expandRows, filterFns, flattenBy, functionalUpdate, getCoreRowModel, getExpandedRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel, isFunction, isRowSelected, isSubRowSelected, makeStateUpdater, memo, noop, orderColumns, passiveEventSupported, reSplitAlphaNumeric, selectRowsFn, shouldAutoRemoveFilter, sortingFns };
