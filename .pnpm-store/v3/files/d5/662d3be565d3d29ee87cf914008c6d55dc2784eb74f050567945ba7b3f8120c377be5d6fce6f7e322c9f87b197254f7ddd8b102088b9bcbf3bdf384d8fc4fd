"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const deploy_1 = require("./deploy");
const link_1 = require("./link");
const matchers_1 = require("./matchers");
require("./type-extensions");
(0, config_1.extendEnvironment)((hre) => {
    // We can't actually implement a MockProvider because of its private
    // properties, so we cast it here 😢
    hre.waffle = (0, plugins_1.lazyObject)(() => {
        const { WaffleMockProviderAdapter } = require("./waffle-provider-adapter");
        const { hardhatCreateFixtureLoader } = require("./fixtures");
        const hardhatWaffleProvider = new WaffleMockProviderAdapter(hre.network);
        return {
            provider: hardhatWaffleProvider,
            deployContract: deploy_1.hardhatDeployContract.bind(undefined, hre),
            deployMockContract: (0, deploy_1.getDeployMockContract)(),
            solidity: require("./waffle-chai").waffleChai,
            createFixtureLoader: hardhatCreateFixtureLoader.bind(undefined, hardhatWaffleProvider),
            loadFixture: hardhatCreateFixtureLoader(hardhatWaffleProvider),
            link: (0, link_1.getLinkFunction)(),
        };
    });
    (0, matchers_1.initializeWaffleMatchers)(hre.config.paths.root);
});
//# sourceMappingURL=index.js.map