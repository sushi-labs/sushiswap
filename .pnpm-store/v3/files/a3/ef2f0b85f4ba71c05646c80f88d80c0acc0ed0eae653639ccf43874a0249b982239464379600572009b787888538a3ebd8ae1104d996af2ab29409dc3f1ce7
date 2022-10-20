import { createUnsupportedError } from "../utils/unsupportedError.js";
/**
 * Returns the action's model
 */
export function actionToJson() {
    const actionModelIsNotEmpty = this._actionModel && Object.keys(this._actionModel).length;
    if (actionModelIsNotEmpty) {
        return this._actionModel;
    }
    return { error: createUnsupportedError(`unsupported action ${this.constructor.name}`) };
}
