# Safe Apps SDK

[![Logo](https://raw.githubusercontent.com/gnosis/safe-apps-sdk/master/assets/logo.png)](https://gnosis-safe.io)
[![npm](https://img.shields.io/npm/v/@gnosis.pm/safe-apps-sdk)](https://www.npmjs.com/package/@gnosis.pm/safe-apps-sdk)
[![Build Status](https://travis-ci.org/gnosis/safe-apps-sdk.svg?branch=master)](https://travis-ci.org/gnosis/pm-contracts)

Software development kit to integrate third-party applications (Safe Apps) with Safe (https://gnosis-safe.io/app/).

## Install

### Install the package with yarn or npm:

```bash
yarn add @gnosis.pm/safe-apps-sdk

npm install @gnosis.pm/safe-apps-sdk
```

## Build

```bash
yarn install
yarn build

npm install
npm build
```

There are differences in arguments for `sed` unix utility on MacOS and Linux:
For MacOS it should be:

```
  "format-dist": "sed -i '' 's/\"files\":/\"_files\":/' dist/package.json"
```

And for Linux:

```
  "format-dist": "sed -i 's/\"files\":/\"_files\":/' dist/package.json",
```

## Documentation

Apps built with the Safe Apps SDK are meant to be run in an iframe inside the Safe Web UI.
This library exposes a class as a default export. It accepts an optional options object:  
`allowedDomains` - Array of regular expressions for origins to accept messages from. If not passed, accepts 
messages from all domains  
`debug` - Boolean. If enabled, it will log outgoing/incoming messages.

```ts
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk';

type Opts = {
  allowedDomains?: RegExp[];
  debug?: boolean;
};

const opts: Opts = {
  allowedDomains: [/gnosis-safe.io/],
  debug: false
};

const appsSdk = new SafeAppsSDK(opts);
```

The instance allows you to interact with the Safe application.

## Safe

### Getting Safe information

Safe information can be obtained by calling `.safe.getInfo()`

```js
const safe = await appsSdk.safe.getInfo();
// {
//   "safeAddress": "0x2fC97b3c7324EFc0BeC094bf75d5dCdFEb082C53",
//   "chainId": 4
// }
```

### Getting Chain information

Chain information can be obtained by calling `.safe.getChainInfo()`

```js
const chain = await appsSdk.safe.getChainInfo();
// {
//   chainName: "Rinkeby",
//   chainId: "4",
//   shortName: "rin",
//   nativeCurrency: {
//     name: "Ether",
//     symbol: "ETH",
//     decimals: 18,
//     logoUri:
//       "https://safe-transaction-assets.gnosis-safe.io/chains/4/currency_logo.png",
//   },
//   blockExplorerUriTemplate: {
//     address: "https://rinkeby.etherscan.io/address/{{address}}",
//     txHash: "https://rinkeby.etherscan.io/tx/{{txHash}}",
//     api: "https://api-rinkeby.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}",
//   },
// }
```

### Getting Safe Balances

Safe Balances can be obtained by calling `.safe.experimental_getBalances()`. This method is experimental and may be changed to return paginated results.

It accepts an optional object argument with `currency` property.
`currency` - [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code as string

```js
const safe = await appsSdk.safe.experimental_getBalances({ currency: 'rub' });
// {
//   "fiatTotal": "0",
//   "items": [
//     {
//     "tokenInfo": {
//       "type": "ETHER",
//       "address": "0x0000000000000000000000000000000000000000",
//       "decimals": 18,
//       "symbol": "ETH",
//       "name": "Ether",
//       "logoUri": null
//     },
//     "balance": "0",
//     "fiatBalance": "0",
//     "fiatConversion": "222297.29"
//     }
//   ]
// }
```

For detailed returned data types, please check our [type declaration file](/packages/safe-apps-sdk/src/types.ts#L203-L227)

### Sending TXs

Sending a TX through the Safe is as simple as invoking `.txs.send()`

```js
// Create a web3 instance
const web3 = new Web3('https://rinkeby.infura.io/v3/token');
const contract = new web3.eth.Contract(abi, contractAddress);

const txs = [
  {
    to: someAddress,
    value: 0,
    data: contract.methods.someMethod().encodeABI(),
  },
  {
    to: someAddress2,
    value: 0,
    data: contract.methods.someOtherMethod().encodeABI(),
  },
];

const params = {
  safeTxGas: 500000,
};

try {
  const txs = await appsSdk.txs.send({ txs, params });
  // { safeTxHash: '0x...' }
} catch (err) {
  console.error(err.message);
}
```

> Note: `value` accepts a number or a string as a decimal or hex number.

### Signing messages

Because the Safe is a smart contract wallet, it doesn't have a private key that the wallet can use to sign messages. Instead, we have a library to sign messages, and the validation logic follows [EIP-1271 - Standard Signature Validation Method for Contracts](https://eips.ethereum.org/EIPS/eip-1271). Signing a message with the Safe requires sending a Safe transaction that needs to be approved by Safe owners. To dive into the smart contract implementation, you can start with [library tests](https://github.com/gnosis/safe-contracts/blob/main/test/libraries/SignMessageLib.spec.ts) in the safe-contracts repo.

To trigger the transaction to sign a message, you can use `sdk.txs.signMessage()` or `sdk.txs.signTypedMessage()`.

```js
const message = "I'm the owner of wallet 0x000000";
const tx = await sdk.txs.signMessage(message);
// { safeTxHash: '0x...' }

const typedMessage = {
    ...
}
const typedTx = await sdk.txs.signTypedMessage(typedMessage);
// { safeTxHash: '0x...' }
```

The non-typed message will be hashed using [EIP-191](https://eips.ethereum.org/EIPS/eip-191). To calculate the hash, you can use `sdk.safe.calculateMessageHash()`.  
In case of a typed message, it will be hashed according to [EIP-712](https://eips.ethereum.org/EIPS/eip-712) standard. To calculate message hash, you can use `sdk.safe.calculateTypedMessageHash()`:

```js
const messageHash = sdk.safe.calculateMessageHash(message);

const typedMessageHash = sdk.safe.calculateTypedMessageHash(typedMessage);
```

To validate if the message is signed, use `sdk.safe.isMessageSigned()`

```js
const message = "I'm the owner of wallet 0x000000";
const messageIsSigned = await sdk.safe.isMessageSigned(message);
```

### Retrieving transaction's status

Once you received safe transaction hash, you might want to get the status of the transaction (was it executed? how many confirmations does it have?):

```js
const tx = await sdk.txs.getBySafeTxHash(safeTxHash);
```

It will return a [GatewayTransactionDetails](src/types/gateway.ts#L222-L230) structure or throw an error if the backend hasn't synced the transaction yet

### Requesting the Address Book

The Address Book can be obtained by calling `.safe.requestAddressBook()`. This method is restricted so it needs to be approved by the current connected Safe owner if the caller doesn't have granted permissions.

All the flow for making the request is handled by the SDK so developers only need to use this method and the rest will be handled by the SDK and the Web UI.

```js
const addressBook = await appsSdk.safe.requestAddressBook();
// [
//   {
//     address: '0x0',
//     chainId: '4',
//     name: 'Entry 1',
//   },
//   {
//     address: '0x1',
//     chainId: '4',
//     name: 'Entry 2',
//   },
// ];
```

Returns an array of [AddressBookItem](src/types/sdk.ts#L55-L59)

### Managing permissions

Usually you are not going to use these methods because restricted methods as `requestAddressBook` handle all the logic for you.

However as part of the internal implementation for the [EIP-2255](https://eips.ethereum.org/EIPS/eip-2255) you now have accessible 2 more methods under the `wallet` section in the SDK.

**Get permissions**

```js
await appsSdk.wallet.getPermissions();
// [
//   {
//     parentCapability: "requestAddressBook",
//     invoker: "https://invoker-dapp.eth",
//     date: 1658499292741,
//     caveats: [],
//   }
// ]
```

Returns an array of [permissions](src/types/permissions.ts#L1-L6) granted to the dapp.

**Request Permissions**

For requesting permissions you should call the `requestPermissions` method that accepts a parameter with an array of [requested permissions](src/types/permissions.ts#L8-L10).

```js
await appsSdk.wallet.requestPermissions([{ requestAddressBook: {} }]);
// [
//   {
//     parentCapability: "requestAddressBook",
//     invoker: "https://invoker-dapp.eth",
//     date: 1658499292741,
//     caveats: [],
//   }
// ]
```

Returns an array of [permissions](src/types/permissions.ts#L1-L6) granted to the dapp. If the permissions are not currently granted then the user will be prompted from the Web UI (only first time) about granting the corresponding permissions.

## RPC Calls

The SDK exposes some of Ethereum's [JSON-RPC API](https://eth.wiki/json-rpc/API), namely the read methods.

### The default block parameter

The following methods have an extra default block parameter:

- getBalance
- getCode
- getStorageAt
- call

When requests are made that act on the state of ethereum, the last default block parameter determines the height of the block.

The following options are possible for the defaultBlock parameter:

`HEX String` - an integer block number  
`String "earliest"` for the earliest/genesis block  
`String "latest"` - for the latest mined block (default)  
`String "pending"` - for the pending state/transactions

### getBalance

Returns the balance of the account of given address.

```js
const balance = await appsSdk.eth.getBalance(['0x...']);
```

### getCode

Returns code at a given address.

```js
const code = await appsSdk.eth.getCode(['0x...']);
```

### getStorageAt

Returns the value from a storage position at a given address.

```js
const value = await appsSdk.eth.getStorageAt(['0x...', 0]);
```

### call

Executes a new message call immediately without creating a transaction on the block chain.

```js
const config = {
  from: '0x0000000000000000000000000000000000000000',
  to: '0x0000000000000000000000000000000000000000',
};

const result = await appsSdk.eth.call([config]);
```

The transaction call object:  
`from` - (optional) The address the transaction is sent from.  
`to` 20 Bytes - The address the transaction is directed to.  
`gas` - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.  
`gasPrice` - (optional) Integer of the gasPrice used for each paid gas  
`value` - (optional) Integer of the value sent with this transaction  
`data` - (optional) Hash of the method signature and encoded parameters. For details see [Ethereum Contract ABI in the Solidity documentation](https://docs.soliditylang.org/en/latest/abi-spec.html)

### getPastLogs

Returns an array of all logs matching a given filter object.

```js
const params = [
  {
    fromBlock: 11054275,
    toBlock: 'latest',
  },
];

const logs = await appsSdk.eth.getPastLogs([params]);
```

The filter options:  
`fromBlock` - Integer block number, or "latest" for the last mined block or "pending", "earliest" for not yet mined transactions.  
`toBlock` - Integer block number, or "latest" for the last mined block or "pending", "earliest" for not yet mined transactions.  
`address` - (optional) Contract address or a list of addresses from which logs should originate.  
`topics` - (optional) Array of 32 Bytes DATA topics. Topics are order-dependent. Each topic can also be an array of DATA with “or” options.

### getBlockByHash

Returns information about a block by hash.

```js
const hash = '0x1955a9f306903669e295196752b11bc0dee33b48cabdf44b1103b7cea086cae7';

const block = await appsSdk.eth.getBlockByHash([hash, true]);
```

Parameters  
`DATA` - Hash of a block.  
`Boolean` (default: false) - If true it returns the full transaction objects, if false only the hashes of the transactions.

### getBlockByNumber

Returns information about a block by block number.

```js
const number = 11054275;

const block = await appsSdk.eth.getBlockByNumber([number]);
```

Parameters  
`QUANTITY|TAG` - integer of a block number, or the string "earliest", "latest" or "pending", as in the default block parameter.
`Boolean` (default: false) - If true it returns the full transaction objects, if false only the hashes of the transactions.

### getTransactionByHash

Returns the information about a transaction requested by transaction hash.

```js
const tx = await appsSdk.eth.getTransactionByHash([
  '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
]);
```

### getTransactionReceipt

Returns the receipt of a transaction by transaction hash.

> Note: That the receipt is not available for pending transactions.

```js
const tx = await appsSdk.eth.getTransactionReceipt([
  '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
]);
```

## Testing in the Safe application

### Manifest

It is mandatory that your app exposes a `manifest.json` file in the root dir with this structure:

```json
{
  "name": "YourAppName",
  "description": "A description of what your app do",
  "icons": [
    {
      "src": "/myAppIcon.svg",
      "type": "image/svg+xml",
      "sizes": "any"
    }
  ]
}
```

> Note: icons[n].src it's the public relative path where the Safe will try to load your app icon. For this example, it should be https://yourAppUrl/myAppIcon.svg.

We are following the [Manifest spec](https://developer.mozilla.org/en-US/docs/Web/Manifest) so you can find more info about how to fill the `icons` field there.

### CORS

As the Safe app is included into the Safe application via an iframe it is required to enable **Cross Site Requests** by setting the **CORS** headers when serving the Safe app.

The required headers are:

```
"Access-Control-Allow-Origin": "\*",
"Access-Control-Allow-Methods": "GET",
"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
```

### React development

It is possible to use the local React development server. For this you need to set the **CORS** headers and make sure to use the same protocol (http or https) as the Safe interface.

#### CORS

For this we recommend to use [react-app-rewired](https://www.npmjs.com/package/react-app-rewired). To enable the library update the `scripts` section in the `package.json`:

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test"
},
```

Additionally, you need to create the `config-overrides.js` file in the root of the project to confirgure the **CORS** headers. The content of the file should be:

```js
/* config-overrides.js */

module.exports = {
  // The function to use to create a webpack dev server configuration when running the development
  // server with 'npm run start' or 'yarn start'.
  // Example: set the dev server to use a specific certificate in https.
  devServer: function (configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      };

      // Return your customised Webpack Development Server config.
      return config;
    };
  },
};
```

#### SSL

To enable SSL with `react-scripts` it is necessary to set the `HTTPS` environment variable to `true`. This can be done in the `package.json` file by adjusting the `scripts` section to:

```json

"scripts": {
  "start": "HTTPS=true react-app-rewired start",
},
```

As in most cases the SSL certificate provided by `react-scripts` is not valid it is required to mark it as trusted in your browser. For this open the Safe App in a separate tab (not in the Safe interface) and accept the certificate/ ignore the warning.

### Loading the Safe App

While developing your Safe App you can directly use [our production interface](https://gnosis-safe.io/app) for testing it. Some testnets like Rinkeby are also available there.
Once your app is live, even if you are running it locally, you can import it to the Safe application as a custom app. To do so, you should select the "Apps" tab:

![Apps section button][safeappstab]

[safeappstab]: https://raw.githubusercontent.com/gnosis/safe-apps-sdk/master/assets/safe-tab-apps.png 'Safe: Apps tab'

Use the `Add custom app` button and add your app using a link:

![Add custom Safe App form][safeaddapp]

[safeaddapp]: https://raw.githubusercontent.com/gnosis/safe-apps-sdk/master/assets/third-pary-app-modal.png 'Safe: Add Safe App'

## Deploy to IPFS

This requires that you have `ipfs` installed ([Instructions](https://gist.github.com/MiguelBel/b3b5f711aa8d9362afa5f16e4e972461))

```bash
yarn build
ipfs add -r build
```

## Examples of applications built with this SDK

- https://github.com/gnosis/safe-react-apps
- https://github.com/Uxio0/safe-react-collectibles
- https://docs.gnosis-safe.io/build/sdks/safe-apps#existing-safe-apps

## License

This library is released under MIT.

## Contributors

- Nicolás Domínguez ([nicosampler](https://github.com/nicosampler))
- Richard Meissner ([rmeissner](https://github.com/rmeissner))
