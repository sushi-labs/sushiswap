"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeAlphaVariables = removeAlphaVariables;
function removeAlphaVariables(container, toRemove) {
    container.walkDecls((decl)=>{
        if (toRemove.includes(decl.prop)) {
            decl.remove();
            return;
        }
        for (let varName of toRemove){
            if (decl.value.includes(`/ var(${varName})`)) {
                decl.value = decl.value.replace(`/ var(${varName})`, "");
            }
        }
    });
}
