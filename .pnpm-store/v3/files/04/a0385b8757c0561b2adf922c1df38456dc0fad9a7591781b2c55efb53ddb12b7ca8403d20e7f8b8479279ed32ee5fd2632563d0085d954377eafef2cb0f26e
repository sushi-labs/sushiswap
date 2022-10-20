"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.BaseFunctionConfigSchema = void 0;
const ts_morph_1 = require("ts-morph");
const validation_1 = require("./validation");
exports.BaseFunctionConfigSchema = {
    type: 'object',
    properties: {
        runtime: { type: 'string' },
        memory: { type: 'number' },
        maxDuration: { type: 'number' },
        regions: {
            type: 'array',
            items: { type: 'string' },
        },
    },
};
function getConfig(project, sourcePath, schema) {
    const sourceFile = project.addSourceFileAtPath(sourcePath);
    const configNode = getConfigNode(sourceFile);
    if (!configNode)
        return null;
    const config = getValue(configNode);
    // @ts-ignore
    return (0, validation_1.validate)(schema || exports.BaseFunctionConfigSchema, config);
}
exports.getConfig = getConfig;
function getConfigNode(sourceFile) {
    return sourceFile
        .getDescendantsOfKind(ts_morph_1.SyntaxKind.ObjectLiteralExpression)
        .find(objectLiteral => {
        // Make sure the object is assigned to "config"
        const varDec = objectLiteral.getParentIfKind(ts_morph_1.SyntaxKind.VariableDeclaration);
        if (varDec?.getName() !== 'config')
            return false;
        // Make sure assigned with `const`
        const varDecList = varDec.getParentIfKind(ts_morph_1.SyntaxKind.VariableDeclarationList);
        const isConst = (varDecList?.getFlags() ?? 0) & ts_morph_1.NodeFlags.Const;
        if (!isConst)
            return false;
        // Make sure it is exported
        const exp = varDecList?.getParentIfKind(ts_morph_1.SyntaxKind.VariableStatement);
        if (!exp?.isExported())
            return false;
        return true;
    });
}
function getValue(valueNode) {
    if (ts_morph_1.Node.isStringLiteral(valueNode)) {
        return eval(valueNode.getText());
    }
    else if (ts_morph_1.Node.isNumericLiteral(valueNode)) {
        return Number(valueNode.getText());
    }
    else if (ts_morph_1.Node.isTrueLiteral(valueNode)) {
        return true;
    }
    else if (ts_morph_1.Node.isFalseLiteral(valueNode)) {
        return false;
    }
    else if (ts_morph_1.Node.isNullLiteral(valueNode)) {
        return null;
    }
    else if (ts_morph_1.Node.isArrayLiteralExpression(valueNode)) {
        return getArray(valueNode);
    }
    else if (ts_morph_1.Node.isObjectLiteralExpression(valueNode)) {
        return getObject(valueNode);
    }
    else if (ts_morph_1.Node.isIdentifier(valueNode) &&
        valueNode.getText() === 'undefined') {
        return undefined;
    }
    throw new Error(`Unhandled type: "${valueNode.getKindName()}" ${valueNode.getText()}`);
}
function getObject(obj) {
    const rtn = {};
    for (const prop of obj.getProperties()) {
        if (!ts_morph_1.Node.isPropertyAssignment(prop))
            continue;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [nameNode, _colon, valueNode] = prop.getChildren();
        const name = nameNode.getText();
        rtn[name] = getValue(valueNode);
    }
    return rtn;
}
function getArray(arr) {
    const elementNodes = arr.getElements();
    const rtn = new Array(elementNodes.length);
    for (let i = 0; i < elementNodes.length; i++) {
        rtn[i] = getValue(elementNodes[i]);
    }
    return rtn;
}
//# sourceMappingURL=index.js.map