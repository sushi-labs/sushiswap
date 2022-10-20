import * as t from 'io-ts';
import { FieldError, FieldValues, ResolverOptions, ResolverResult } from 'react-hook-form';
export declare type Resolver = <T, TFieldValues, TContext>(codec: t.Decoder<FieldValues, T>) => (values: TFieldValues, _context: TContext | undefined, options: ResolverOptions<TFieldValues>) => ResolverResult<TFieldValues>;
export declare type ErrorObject = Record<string, FieldError>;
export declare type FieldErrorWithPath = FieldError & {
    path: string;
};
