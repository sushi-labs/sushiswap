import { Lambda, LambdaOptionsWithFiles } from './lambda';
interface NodejsLambdaOptions extends LambdaOptionsWithFiles {
    shouldAddHelpers: boolean;
    shouldAddSourcemapSupport: boolean;
    awsLambdaHandler?: string;
}
export declare class NodejsLambda extends Lambda {
    launcherType: 'Nodejs';
    shouldAddHelpers: boolean;
    shouldAddSourcemapSupport: boolean;
    awsLambdaHandler?: string;
    constructor({ shouldAddHelpers, shouldAddSourcemapSupport, awsLambdaHandler, ...opts }: NodejsLambdaOptions);
}
export {};
