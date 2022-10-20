"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParamNames = exports.generateDecodeFunctionResultOverload = exports.generateEncodeFunctionDataOverload = exports.generateGetFunction = exports.generateFunctionNameOrSignature = exports.generateInterfaceFunctionDescription = exports.codegenForOverloadedFunctions = exports.codegenFunctions = void 0;
const typechain_1 = require("typechain");
const types_1 = require("./types");
function codegenFunctions(options, fns) {
    if (fns.length === 1) {
        if (options.codegenConfig.alwaysGenerateOverloads) {
            return generateFunction(options, fns[0]) + codegenForOverloadedFunctions(options, fns);
        }
        else {
            return generateFunction(options, fns[0]);
        }
    }
    return codegenForOverloadedFunctions(options, fns);
}
exports.codegenFunctions = codegenFunctions;
function codegenForOverloadedFunctions(options, fns) {
    return fns.map((fn) => generateFunction(options, fn, `"${(0, typechain_1.getSignatureForFn)(fn)}"`)).join('\n');
}
exports.codegenForOverloadedFunctions = codegenForOverloadedFunctions;
function isPayable(fn) {
    return fn.stateMutability === 'payable';
}
function generateFunction(options, fn, overloadedName) {
    var _a;
    return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName !== null && overloadedName !== void 0 ? overloadedName : fn.name}(${(0, types_1.generateInputTypes)(fn.inputs, { useStructs: true })}${!options.isStaticCall && !(0, typechain_1.isConstant)(fn) && !(0, typechain_1.isConstantFn)(fn)
        ? `overrides?: ${isPayable(fn)
            ? 'PayableOverrides & { from?: PromiseOrValue<string> }'
            : 'Overrides & { from?: PromiseOrValue<string> }'}`
        : 'overrides?: CallOverrides'}): ${(_a = options.overrideOutput) !== null && _a !== void 0 ? _a : `Promise<${options.isStaticCall || fn.stateMutability === 'pure' || fn.stateMutability === 'view'
        ? (0, types_1.generateOutputTypes)({ returnResultObject: !!options.returnResultObject, useStructs: true }, fn.outputs)
        : 'ContractTransaction'}>`};
`;
}
function generateFunctionDocumentation(doc) {
    if (!doc)
        return '';
    let docString = '/**';
    if (doc.details)
        docString += `\n * ${doc.details}`;
    if (doc.notice)
        docString += `\n * ${doc.notice}`;
    const params = Object.entries(doc.params || {});
    if (params.length) {
        params.forEach(([key, value]) => {
            docString += `\n * @param ${key} ${value}`;
        });
    }
    if (doc.return)
        docString += `\n * @returns ${doc.return}`;
    docString += '\n */';
    return docString;
}
function generateInterfaceFunctionDescription(fn) {
    return `'${(0, typechain_1.getSignatureForFn)(fn)}': FunctionFragment;`;
}
exports.generateInterfaceFunctionDescription = generateInterfaceFunctionDescription;
function generateFunctionNameOrSignature(fn, useSignature) {
    return useSignature ? (0, typechain_1.getSignatureForFn)(fn) : fn.name;
}
exports.generateFunctionNameOrSignature = generateFunctionNameOrSignature;
function generateGetFunction(args) {
    if (args.length === 0)
        return '';
    return `getFunction(nameOrSignatureOrTopic: ${args.map((s) => `"${s}"`).join(' | ')}): FunctionFragment;`;
}
exports.generateGetFunction = generateGetFunction;
function generateEncodeFunctionDataOverload(fn, useSignature) {
    const methodInputs = [`functionFragment: '${useSignature ? (0, typechain_1.getSignatureForFn)(fn) : fn.name}'`];
    if (fn.inputs.length) {
        methodInputs.push(`values: [${fn.inputs.map((input) => (0, types_1.generateInputType)({ useStructs: true }, input.type)).join(', ')}]`);
    }
    else {
        methodInputs.push('values?: undefined');
    }
    return `encodeFunctionData(${methodInputs.join(', ')}): string;`;
}
exports.generateEncodeFunctionDataOverload = generateEncodeFunctionDataOverload;
function generateDecodeFunctionResultOverload(fn, useSignature) {
    return `decodeFunctionResult(functionFragment: '${useSignature ? (0, typechain_1.getSignatureForFn)(fn) : fn.name}', data: BytesLike): Result;`;
}
exports.generateDecodeFunctionResultOverload = generateDecodeFunctionResultOverload;
function generateParamNames(params) {
    return params.map((param, index) => (param.name ? (0, typechain_1.createPositionalIdentifier)(param.name) : `arg${index}`)).join(', ');
}
exports.generateParamNames = generateParamNames;
//# sourceMappingURL=functions.js.map