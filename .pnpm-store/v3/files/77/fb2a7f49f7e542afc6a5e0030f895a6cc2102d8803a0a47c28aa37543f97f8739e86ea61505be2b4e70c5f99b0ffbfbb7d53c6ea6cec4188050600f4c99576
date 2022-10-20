export declare type DecodedDataRequest = {
    data: string;
};
declare type ParamValue = string | ParamValue[];
export declare type DecodedDataBasicParameter = {
    name: string;
    type: string;
    value: ParamValue;
};
export declare type DecodedDataParameterValue = {
    operation: 0 | 1;
    to: string;
    value: string;
    data: string;
    dataDecoded?: {
        method: string;
        parameters: DecodedDataBasicParameter[];
    };
};
export declare type DecodedDataParameter = {
    valueDecoded?: DecodedDataParameterValue[];
} & DecodedDataBasicParameter;
export declare type DecodedDataResponse = {
    method: string;
    parameters: DecodedDataParameter[];
};
export {};
