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

class CeloWalletWithAddress extends CeloWallet {
  public toJSON() {
    return `<CeloWalletWithAddress ${this.address}>`;
  }
}

const makePath = (index: number): string => `m/44'/52752'/0'/0/${index}`;

extendEnvironment((hre) => {
  hre.ethers = lazyObject(() => {
    const { networks } = hre.config;
    const currentNetwork = networks[hre.network.name];
    const provider = getProvider(hre.network.name as ICeloNetwork);

    console.log(currentNetwork);
    return {
      ...ethers,
      provider,

      getSigners: async () =>
        Array(10)
          .fill(null)
          .map((_, i) => {
            const privateKey = HDNode.fromMnemonic(
              (currentNetwork?.accounts as HardhatNetworkHDAccountsConfig)
                .mnemonic,
              makePath(i)
            );
            return (new CeloWalletWithAddress(
              privateKey,
              provider
            ) as unknown) as SignerWithAddress;
          }),
      // We cast to any here as we hit a limitation of Function#bind and
      // overloads. See: https://github.com/microsoft/TypeScript/issues/28582
      getContractFactory: getContractFactory.bind(null, hre) as any,
      getContractAt: getContractAt.bind(null, hre),
    };
  });
});
