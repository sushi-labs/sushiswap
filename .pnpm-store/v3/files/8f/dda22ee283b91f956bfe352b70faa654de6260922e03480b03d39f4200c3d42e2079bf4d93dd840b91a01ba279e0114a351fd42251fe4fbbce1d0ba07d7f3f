import { FieldValues, ResolverOptions, ResolverResult } from 'react-hook-form';
import * as Yup from 'yup';
import type Lazy from 'yup/lib/Lazy';
declare type Options<T extends Yup.AnyObjectSchema | Lazy<any>> = Parameters<T['validate']>[1];
export declare type Resolver = <T extends Yup.AnyObjectSchema | Lazy<any>>(schema: T, schemaOptions?: Options<T>, factoryOptions?: {
    mode?: 'async' | 'sync';
    rawValues?: boolean;
}) => <TFieldValues extends FieldValues, TContext>(values: TFieldValues, context: TContext | undefined, options: ResolverOptions<TFieldValues>) => Promise<ResolverResult<TFieldValues>>;
export {};
