"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VM = void 0;
const vm_1 = require("vm");
const require_1 = require("./require");
const temp_file_1 = require("./temp-file");
/**
 * A raw VM with a context that can be extended on instantiation. Implements
 * a realm-like interface where one can evaluate code or require CommonJS
 * modules in multiple ways.
 */
class VM {
    constructor(options = {}) {
        var _a, _b, _c, _d;
        const context = (0, vm_1.createContext)({}, {
            name: 'Edge Runtime',
            codeGeneration: (_a = options.codeGeneration) !== null && _a !== void 0 ? _a : {
                strings: false,
                wasm: false,
            },
        });
        this.requireCache = (_b = options.requireCache) !== null && _b !== void 0 ? _b : new Map();
        this.context = (_d = (_c = options.extend) === null || _c === void 0 ? void 0 : _c.call(options, context)) !== null && _d !== void 0 ? _d : context;
        this.requireFn = (0, require_1.createRequire)(this.context, this.requireCache);
    }
    /**
     * Allows to run arbitrary code within the VM.
     */
    evaluate(code) {
        return (0, vm_1.runInContext)(code, this.context);
    }
    /**
     * Allows to require a CommonJS module referenced in the provided file
     * path within the VM context. It will return its exports.
     */
    require(filepath) {
        return this.requireFn(filepath, filepath);
    }
    /**
     * Same as `require` but it will copy each of the exports in the context
     * of the vm. Then exports can be used inside of the vm with an
     * evaluated script.
     */
    requireInContext(filepath) {
        const moduleLoaded = this.require(filepath);
        for (const [key, value] of Object.entries(moduleLoaded)) {
            this.context[key] = value;
        }
    }
    /**
     * Same as `requireInContext` but allows to pass the code instead of a
     * reference to a file. It will create a temporary file and then load
     * it in the VM Context.
     */
    requireInlineInContext(code) {
        const file = (0, temp_file_1.tempFile)(code);
        this.requireInContext(file.path);
        file.remove();
    }
}
exports.VM = VM;
//# sourceMappingURL=vm.js.map