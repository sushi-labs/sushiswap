import type CJSImportProcessor from "../CJSImportProcessor";
import type { Options } from "../index";
import type NameManager from "../NameManager";
import type TokenProcessor from "../TokenProcessor";
import { JSXPragmaInfo } from "../util/getJSXPragmaInfo";
import type RootTransformer from "./RootTransformer";
import Transformer from "./Transformer";
export default class JSXTransformer extends Transformer {
    readonly rootTransformer: RootTransformer;
    readonly tokens: TokenProcessor;
    readonly importProcessor: CJSImportProcessor | null;
    readonly nameManager: NameManager;
    readonly options: Options;
    lastLineNumber: number;
    lastIndex: number;
    filenameVarName: string | null;
    readonly jsxPragmaInfo: JSXPragmaInfo;
    constructor(rootTransformer: RootTransformer, tokens: TokenProcessor, importProcessor: CJSImportProcessor | null, nameManager: NameManager, options: Options);
    process(): boolean;
    getPrefixCode(): string;
    /**
     * Lazily calculate line numbers to avoid unneeded work. We assume this is always called in
     * increasing order by index.
     */
    getLineNumberForIndex(index: number): number;
    getFilenameVarName(): string;
    processProps(firstTokenStart: number): void;
    processPropKeyName(): void;
    processStringPropValue(): void;
    /**
     * Process the first part of a tag, before any props.
     */
    processTagIntro(): void;
    processChildren(): void;
    processChildTextElement(): void;
    processJSXTag(): void;
}
/**
 * Spec for identifiers: https://tc39.github.io/ecma262/#prod-IdentifierStart.
 *
 * Really only treat anything starting with a-z as tag names.  `_`, `$`, `é`
 * should be treated as copmonent names
 */
export declare function startsWithLowerCase(s: string): boolean;
