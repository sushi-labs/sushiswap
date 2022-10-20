export function getDirectiveFromAstNode(astNode, names) {
    const directives = astNode.directives || [];
    const namesArr = Array.isArray(names) ? names : [names];
    const authDirective = directives.find(d => namesArr.includes(d.name.value));
    return authDirective || null;
}
