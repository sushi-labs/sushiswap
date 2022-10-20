import type NameManager from "./NameManager";
declare const HELPERS: {
    [name: string]: string;
};
export declare class HelperManager {
    readonly nameManager: NameManager;
    helperNames: {
        [baseName in keyof typeof HELPERS]?: string;
    };
    constructor(nameManager: NameManager);
    getHelperName(baseName: keyof typeof HELPERS): string;
    emitHelpers(): string;
}
export {};
