# TypeScript Bindings for Sushi Stellar Smart Contracts

## Overview

This directory contains the TypeScript bindings for Stellar Smart Contracts.

The aim is type safety and improved developer ergonomics in error handling and validating data passed to and from Stellar Smart Contracts.

## Usage

### Generating Bindings

The following command can be used in this directory to generate bindings in this directory for deployed Stellar Smart Contracts.

```
stellar contract bindings typescript \
    --network testnet \
    --id <contract_address_from_deploy_step> \
    --output-dir ./<name_for_new_contract_binding_sub_directory> \
    --overwrite
```

Then, in the newly generated `<name_for_new_contract_binding_sub_directory>` directory, run `pnpm install`, `pnpm run build`, and update the package name in the `package.json` file (the current convention is to use `@sushiswap/stellar-contract-binding-<name_for_new_contract_binding_sub_directory>` as the name).

If the above succeeds, proceed to the "Consuming Bindings" section below; otherwise, read the rest of the notes in this section.

The exact contract deployment for which a binding was generated against can be seen in `./<name_for_new_contract_binding_sub_directory>/README.md` as part of the text showing the sample command that generated the directory.

For contracts such as the pools and tokens with multiple deployed instances that share an interface, any of the deployed instances with the desired interface can be used as the canonical example from which to generate the bindings.

#### Troubleshooting

| Issue                                                     | Solution                                    |
| --------------------------------------------------------- | ------------------------------------------- |
| `pnpm run build` failed due to duplicate definitions      | Manually refactor rename the symbol name collisions in `./<name_for_new_contract_binding_sub_directory>/src/index.ts` |
| `pnpm run build` failed due to missing type definitions   | Manually define the types in `./<name_for_new_contract_binding_sub_directory>/src/index.ts` referencing the contract source code as needed (e.g., the type for `sqrt_price_x96` in the pool contract binding had to be manually in-lined to `u256` as per the [contract source code](https://github.com/hyplabs/sushi-stellar/blob/76266ca948d83381ba92e2e0c5bc0b15b7820a0b/contracts/amm-math/src/tick_math.rs#L14)) |
| Stellart Smart Contract not yet deployed                  | Follow the steps to install the compiled contract and deploy from the [Stellar documentation](https://developers.stellar.org/docs/build/apps/guestbook/bindings) |

#### Limitations

- A binding can only be generated for a deployed contract with this method though there are likely other tools to generate it directly from a WASM file.
- The TypeScript binding includes `export const networks` by default which we do not use as we prefer using the `contractAddresses` and `NETWORK_CONFIG` from `apps/web/src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/contracts/index.ts` so we can delete this exported const from `./<name_for_new_contract_binding_sub_directory>/src/index.ts` to reduce confusion.
- We can also delete unused imports generated in `./<name_for_new_contract_binding_sub_directory>/src/index.ts` to reduce clutter.

### Consuming Bindings

The following steps should be followed to use the TypeScript bindings in `../../../apps/web/src/app/(networks)/(non-evm)/stellar`.

1. Add `"@sushiswap/stellar-contract-binding-factory": "workspace:*"` to the dependencies of `../../../apps/web/package.json`
1. Run `pnpm install` in the project root at `../../..`
1. Import the new contract client in `../../../apps/web/src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/client.ts` with something like `import { Client as ${name_for_new_contract_binding_sub_directory}ContractClient } from '@sushiswap/stellar-contract-binding-${name_for_new_contract_binding_sub_directory}'`
1. Export a function to get an instantiated client with the same options as the Soroban client and the TypeScript binding in `../../../apps/web/src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/client.ts` like the following where the `contractId` is a `contractAddresses` entry from `../../../apps/web/src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/contracts/index.ts` if the contract is a singleton
    ```typescript
    type ContractClientParams = {
      contractId: string
      publicKey?: string
    }
    export const get${name_for_new_contract_binding_sub_directory}ContractClient = ({
      contractId,
      publicKey,
    }: ContractClientParams) =>
      new ${name_for_new_contract_binding_sub_directory}ContractClient({
        contractId: contractId,
        networkPassphrase: NETWORK_CONFIG.PASSPHRASE,
        rpcUrl: RPC_URL,
        allowHttp: true,
        publicKey: publicKey,
      })
    ```
1. The contract client can be used by calling the async smart contract functions (exact same name as the functions in the original smart contract) on the contract client while enjoying the benefits of types with parameters passed as object key-values as the first argument and an options object (for things like `timeoutInSeconds` and `fee`) as the second argument
    - The call will automatically simulate the transaction and return an object with the simulated result
    - The returned object has the validated result in the `result` property and will throw if there is an error
    - If the transaction needs to actually execute (not just be simulated) to make a state change on-chain, either get the `XDR` to sign by calling `toXDR` on the returned object and following existing signing and broadcasting logic or call `signAndSend` on the returned object
