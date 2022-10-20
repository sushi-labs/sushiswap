"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeVM = void 0;
const primitives_1 = require("@edge-runtime/primitives");
const vm_1 = require("./vm");
/**
 * An implementation of a VM that pre-loads on its context Edge Primitives.
 * The context can be extended from its constructor.
 */
class EdgeVM extends vm_1.VM {
    constructor(options = {}) {
        super({
            ...options,
            extend: (context) => {
                return options.extend
                    ? options.extend((0, primitives_1.addPrimitives)(context))
                    : (0, primitives_1.addPrimitives)(context);
            },
        });
    }
}
exports.EdgeVM = EdgeVM;
//# sourceMappingURL=edge-vm.js.map