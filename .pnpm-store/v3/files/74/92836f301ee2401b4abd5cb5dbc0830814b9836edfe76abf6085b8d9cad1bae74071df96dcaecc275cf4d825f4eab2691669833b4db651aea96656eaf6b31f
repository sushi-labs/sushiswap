"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectiveFromAstNode = void 0;
function getDirectiveFromAstNode(astNode, names) {
    const directives = astNode.directives || [];
    const namesArr = Array.isArray(names) ? names : [names];
    const authDirective = directives.find(d => namesArr.includes(d.name.value));
    return authDirective || null;
}
exports.getDirectiveFromAstNode = getDirectiveFromAstNode;
