import CustomFunctionAction from "./CustomFunctionAction.js";
class RemoteAction extends CustomFunctionAction {
    constructor(fn) {
        /* istanbul ignore next */
        // Required due to https://github.com/microsoft/TypeScript/issues/13029
        super(fn);
    }
    preprocess() {
        this.pre = 'pre';
        return this;
    }
}
export default RemoteAction;
