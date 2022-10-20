![npm (tag)](https://img.shields.io/npm/v/@tenderly/hardhat-tenderly/latest?color=23C197&labelColor=060e18&style=for-the-badge)

# hardhat-tenderly

[Hardhat](http://hardhat.org) plugin for integration with [Tenderly](https://tenderly.co). 

## What

This plugin will help you verify your Solidity contracts, as well as allow you to 
privately push contracts to [Tenderly](https://tenderly.co).

## Installation

```bash
npm install --save-dev @tenderly/hardhat-tenderly
```

And add the following statement to your `hardhat.config.js` or `hardhat.config.ts`:

```js
const tdly = require("@tenderly/hardhat-tenderly");
tdly.setup();
```

Or, if you are using typescript:

```ts
import * as tdly from "@tenderly/hardhat-tenderly";
tdly.setup();
```

# Verification options

## Automatic verification

Contract verification works out-of-the box if contracts is deployed via ethers provided in HRE object.

## Manual contract verification - Environment extensions

This plugin extends the Hardhat Runtime Environment by adding a `tenderly` field
whose type is `Tenderly`.

This field has the `verify` and `push` methods, and you can use to trigger manual contract verification.

This is an example on how you can call it from your scripts (using ethers to deploy a contract):
```ts
const Greeter = await ethers.getContractFactory("Greeter");
const greeter = await Greeter.deploy("Hello, Hardhat!");

await greeter.deployed()

// public contract verification
await hre.tenderly.verify({
    name: "Greeter",
    address: greeter.address,
})
```

Both functions accept variadic parameters:
```ts
const contracts = [
{
    name: "Greeter",
    address: "123"
},
{
    name: "Greeter2",
    address: "456"
}]

// private contract verification
await hre.tenderly.push(...contracts)
```

## Manual contract verification - HRE Tasks

This plugin adds the _`tenderly:verify`_ task to Hardhat:
```
Usage: hardhat [GLOBAL OPTIONS] tenderly:verify ...contracts

POSITIONAL ARGUMENTS:

  contracts     Addresses and names of contracts that will be verified formatted ContractName=Address 

tenderly-verify: Verifies contracts on Tenderly
```

And the `tenderly:push` task:
```
Usage: hardhat [GLOBAL OPTIONS] tenderly:push ...contracts

POSITIONAL ARGUMENTS:

  contracts     Addresses and names of contracts that will be verified formatted ContractName=Address 

tenderly-push: Privately pushes contracts to Tenderly
```

## Manual contract verification - Source & compiler config manually provided

In order to offer the most flexibility we have exposed our internal API interface in the plugin interface.

There are `verifyAPI` and `pushAPI` functions with all necessary data for verification.

Here is the types example that are needed in order for verification to be successful.
```typescript
export interface TenderlyContractConfig {
  compiler_version?: string;
  optimizations_used?: boolean;
  optimizations_count?: number;
  evm_version?: string;
  debug?: CompilerDebugInput;
}

export interface TenderlyContract {
    contractName: string;
    source: string;
    sourcePath: string;
    compiler?: ContractCompiler;
    networks?: Record<string, ContractNetwork>;
}

export interface TenderlyContractUploadRequest {
    config: TenderlyContractConfig;
    contracts: TenderlyContract[];
    tag?: string;
}

public async verifyAPI(request: TenderlyContractUploadRequest)
```

## Configuration

This plugin extends the `HardhatConfig` object with
`project`, `username`, `forkNetwork` and `privateVerification` fields.

This is an example of how to set it:

```js
module.exports = {
    tenderly: {
        project: "",
        username: "",
        forkNetwork: "",
        // privateVerification: false,
        // deploymentsDir: "deployments"
    }
};
```

## Usage

For this plugin to function you need to create a `config.yaml` file at
`$HOME/.tenderly/config.yaml` or `%HOMEPATH%\.tenderly\config.yaml` and add an `access_key` field to it:
```yaml
access_key: super_secret_access_key
```

In order to connect with Tenderly you will need an access token which you can get by going to
your [Tenderly dashboard](https://dashboard.tenderly.co) and in the top right corner click on **Settings**, and then go to
the **Authorization** tab where you will generate a new access token.

*Alternatively*, this step can be skipped by doing `tenderly login` on the `tenderly-cli`

After this you can access [Tenderly](https://tenderly.co) through the Hardhat Runtime Environment anywhere 
you need it (tasks, scripts, tests, etc.).
