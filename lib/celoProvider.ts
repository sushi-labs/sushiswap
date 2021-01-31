import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { CeloContract, newKit } from "@celo/contractkit";

export const fornoURLs = {
  alfajores: "https://alfajores-forno.celo-testnet.org",
  baklava: "https://baklava-forno.celo-testnet.org",
  rc1: "https://forno.celo.org",
  mainnet: "https://forno.celo.org",
} as const;

export type ICeloNetwork = keyof typeof fornoURLs;

export const getProvider = (network: ICeloNetwork): CeloProvider =>
  new CeloProvider(fornoURLs[network]);

export const getKit = async ({
  mnemonic,
  network,
}: {
  mnemonic: string;
  network: ICeloNetwork;
}) => {
  const wallet = CeloWallet.fromMnemonic(mnemonic).connect(
    getProvider(network)
  );

  const kit = newKit(fornoURLs[network]);

  // default from account
  kit.defaultAccount = await wallet.getAddress();

  // add the account private key for tx signing when connecting to a remote node
  kit.connection.addAccount(wallet.privateKey);

  // paid gas in celo dollars
  await kit.setFeeCurrency(CeloContract.StableToken);

  return kit;
};
