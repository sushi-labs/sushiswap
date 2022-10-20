import { FieldValues, InternalFieldName, Ref } from './fields';
import { LiteralUnion, Merge } from './utils';
import { RegisterOptions, ValidateResult } from './validator';
export declare type Message = string;
export declare type MultipleFieldErrors = {
    [K in keyof RegisterOptions]?: ValidateResult;
} & {
    [key: string]: ValidateResult;
};
export declare type FieldError = {
    type: LiteralUnion<keyof RegisterOptions, string>;
    ref?: Ref;
    types?: MultipleFieldErrors;
    message?: Message;
};
export declare type ErrorOption = {
    message?: Message;
    type?: LiteralUnion<keyof RegisterOptions, string>;
    types?: MultipleFieldErrors;
};
export declare type DeepRequired<T> = {
    [K in keyof T]-?: DeepRequired<T[K]>;
};
export declare type FieldErrorsImpl<T extends FieldValues = FieldValues> = {
    [K in keyof T]?: T[K] extends object ? Merge<FieldError, FieldErrorsImpl<T[K]>> : FieldError;
};
export declare type FieldErrors<T extends FieldValues = FieldValues> = FieldErrorsImpl<DeepRequired<T>>;
export declare type InternalFieldErrors = Partial<Record<InternalFieldName, FieldError>>;
//# sourceMappingURL=errors.d.ts.map