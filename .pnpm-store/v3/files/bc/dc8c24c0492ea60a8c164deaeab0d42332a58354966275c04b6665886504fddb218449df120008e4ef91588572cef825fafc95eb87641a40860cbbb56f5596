import * as TSESLint from '../../ts-eslint';
import type { DependencyConstraint } from './dependencyConstraints';
declare const TS_ESLINT_PARSER = "@typescript-eslint/parser";
declare type RuleTesterConfig = Omit<TSESLint.RuleTesterConfig, 'parser'> & {
    parser: typeof TS_ESLINT_PARSER;
};
interface InvalidTestCase<TMessageIds extends string, TOptions extends Readonly<unknown[]>> extends TSESLint.InvalidTestCase<TMessageIds, TOptions> {
    dependencyConstraints?: DependencyConstraint;
}
interface ValidTestCase<TOptions extends Readonly<unknown[]>> extends TSESLint.ValidTestCase<TOptions> {
    dependencyConstraints?: DependencyConstraint;
}
interface RunTests<TMessageIds extends string, TOptions extends Readonly<unknown[]>> {
    readonly valid: readonly (ValidTestCase<TOptions> | string)[];
    readonly invalid: readonly InvalidTestCase<TMessageIds, TOptions>[];
}
declare type AfterAll = (fn: () => void) => void;
declare class RuleTester extends TSESLint.RuleTester {
    #private;
    /**
     * If you supply a value to this property, the rule tester will call this instead of using the version defined on
     * the global namespace.
     */
    static get afterAll(): AfterAll;
    static set afterAll(value: AfterAll);
    constructor(baseOptions: RuleTesterConfig);
    private getFilename;
    run<TMessageIds extends string, TOptions extends Readonly<unknown[]>>(name: string, rule: TSESLint.RuleModule<TMessageIds, TOptions>, testsReadonly: RunTests<TMessageIds, TOptions>): void;
}
/**
 * Simple no-op tag to mark code samples as "should not format with prettier"
 *   for the internal/plugin-test-formatting lint rule
 */
declare function noFormat(strings: TemplateStringsArray, ...keys: string[]): string;
export { noFormat, RuleTester };
export type { InvalidTestCase, ValidTestCase, RunTests };
//# sourceMappingURL=RuleTester.d.ts.map