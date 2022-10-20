"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodejsLambda = void 0;
const lambda_1 = require("./lambda");
class NodejsLambda extends lambda_1.Lambda {
    constructor({ shouldAddHelpers, shouldAddSourcemapSupport, awsLambdaHandler, ...opts }) {
        super(opts);
        this.launcherType = 'Nodejs';
        this.shouldAddHelpers = shouldAddHelpers;
        this.shouldAddSourcemapSupport = shouldAddSourcemapSupport;
        this.awsLambdaHandler = awsLambdaHandler;
    }
}
exports.NodejsLambda = NodejsLambda;
