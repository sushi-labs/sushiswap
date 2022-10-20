export class Interpolator {
    constructor(options?: {
        delimiter: string[];
    });
    options: {
        delimiter: string[];
    };
    modifiers: any[];
    aliases: any[];
    registerBuiltInModifiers(): Interpolator;
    get delimiter(): string[];
    delimiterStart(): string;
    delimiterEnd(): string;
    registerModifier(key: any, transform: any): Error | Interpolator;
    parseRules(str: any): any;
    extractRules(matches: any): any;
    getKeyFromMatch(match: any): any;
    removeDelimiter(val: any): any;
    removeAfter(str: any, val: any): any;
    extractAfter(str: any, val: any): any;
    getAlternativeText(str: any): any;
    getModifiers(str: any): any;
    parse(str?: string, data?: {}): any;
    parseFromRules(str: any, data: any, rules: any): any;
    applyRule(str: any, rule: any, data?: {}): any;
    getFromAlias(key: any): any;
    applyData(key: any, data: any): any;
    getModifier(key: any): any;
    applyModifiers(modifiers: any, str: any, rawData: any): any;
    addAlias(key: any, ref: any): Interpolator;
    removeAlias(key: any): Interpolator;
}
