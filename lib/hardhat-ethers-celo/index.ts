import { CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import {
  getContractAt,
  getContractFactory,
} from "@nomiclabs/hardhat-ethers/dist/src/helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import ethers from "ethers";
import { HDNode } from "ethers/lib/utils";
import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";
import { getProvider, ICeloNetwork } from "../celoProvider";

const makePath = (index: number): string => `m/44'/52752'/0'/0/${index}`;

extendEnvironment((hre) => {
  hre.ethers = lazyObject(() => {
    const { networks } = hre.config;
    const currentNetwork = networks[hre.network.name];
    const provider = getProvider(hre.network.name as ICeloNetwork);

    return {
      ...ethers,
      provider,

      getSigners: async () => {
        const accountsCfg = currentNetwork?.accounts as HardhatNetworkHDAccountsConfig;
        return Array(accountsCfg.count)
          .fill(null)
          .map((_, i) => {
            const privateKey = HDNode.fromMnemonic(
              accountsCfg.mnemonic
            ).derivePath(makePath(i));
            const wallet = (new CeloWallet(
              {
                privateKey: privateKey.privateKey,
                address: privateKey.address,
              },
              provider
            ) as unknown) as SignerWithAddress;
            wallet.toJSON = () => `<CeloWallet ${wallet.address}>`;
            return wallet;
          });
      },
      // We cast to any here as we hit a limitation of Function#bind and
      // overloads. See: https://github.com/microsoft/TypeScript/issues/28582
      getContractFactory: getContractFactory.bind(null, hre) as any,
      getContractAt: getContractAt.bind(null, hre),
    };
  });
});
