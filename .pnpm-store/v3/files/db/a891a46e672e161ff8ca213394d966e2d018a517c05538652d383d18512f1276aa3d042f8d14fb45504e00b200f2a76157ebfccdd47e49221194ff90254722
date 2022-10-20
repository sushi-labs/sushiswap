import { Plugin, ResultProcessor, ResultProcessorInput } from './types.js';
export interface ResultProcessorPluginOptions {
    processResult: ResultProcessor;
    match?(request: Request, result: ResultProcessorInput): boolean;
}
export declare function useResultProcessor(options: ResultProcessorPluginOptions): Plugin;
