"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const currency_1 = require("@sushiswap/currency");
const deployFunction = function ({ deployments, ethers, getChainId, getNamedAccounts, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deploy } = deployments;
        const chainId = parseInt(yield getChainId());
        const { deployer } = yield getNamedAccounts();
        // const weth9 = await ethers.getContractOrNull('WETH9Mock')
        if (!(chainId in currency_1.WNATIVE_ADDRESS)) {
            throw Error(`No WNATIVE_ADDRESS for chain #${chainId}!`);
        }
        yield deploy('BentoBoxV1', {
            from: deployer,
            args: [currency_1.WNATIVE_ADDRESS[chainId]],
            log: true,
            deterministicDeployment: false,
        });
    });
};
exports.default = deployFunction;
// deployFunction.dependencies = ['WETH9']
deployFunction.tags = ['BentoBoxV1'];
