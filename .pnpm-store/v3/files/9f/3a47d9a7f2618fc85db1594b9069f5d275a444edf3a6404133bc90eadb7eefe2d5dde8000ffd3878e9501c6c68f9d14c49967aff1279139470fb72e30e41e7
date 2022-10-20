/// <reference types="react" />
import { StackPathConfig } from '@visx/shape';
import { AxisScale } from '@visx/axis';
import { CombinedStackData, SeriesProps } from '../types';
declare type UseStackedData<Datum extends object> = {
    children: JSX.Element | JSX.Element[];
} & Pick<StackPathConfig<Datum, string>, 'offset' | 'order'>;
export default function useStackedData<XScale extends AxisScale, YScale extends AxisScale, Datum extends object, ChildrenProps extends SeriesProps<XScale, YScale, Datum>>({ children, order, offset }: UseStackedData<Datum>): {
    seriesChildren: import("react").ReactElement<ChildrenProps, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)>[];
    dataKeys: string[];
    stackedData: import("d3-shape").Series<CombinedStackData<XScale, YScale>, string>[];
};
export {};
//# sourceMappingURL=useStackedData.d.ts.map