"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapHHDeployments = void 0;
function wrapHHDeployments(deployments, tenderly) {
    deployments.deploy = wrapDeploy(deployments.deploy, tenderly);
    return deployments;
}
exports.wrapHHDeployments = wrapHHDeployments;
function wrapDeploy(deployFunc, tenderly) {
    return async function (name, options) {
        const depResult = await deployFunc(name, options);
        await tenderly.verify({
            name,
            address: depResult.address
        });
        return depResult;
    };
}
//# sourceMappingURL=hardhat-deploy.js.map