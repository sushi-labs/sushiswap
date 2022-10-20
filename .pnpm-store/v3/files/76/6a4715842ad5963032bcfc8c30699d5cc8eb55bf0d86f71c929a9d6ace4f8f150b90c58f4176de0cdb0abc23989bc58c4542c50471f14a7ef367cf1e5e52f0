# WalletConnect Ethereum Provider

Ethereum Provider for WalletConnect

For more details, read the [documentation](https://docs.walletconnect.org)

## Setup

```typescript
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
});

//  Enable session (triggers QR Code modal)
await provider.enable();

//  Create Web3
const web3 = new Web3(provider);
```

## Events (EIP-1193)

```typescript
// Subscribe to accounts change
provider.on("accountsChanged", (accounts: string[]) => {
  console.log(accounts);
});

// Subscribe to chainId change
provider.on("chainChanged", (chainId: number) => {
  console.log(chainId);
});

// Subscribe to session connection
provider.on("connect", () => {
  console.log("connect");
});

// Subscribe to session disconnection
provider.on("disconnect", (code: number, reason: string) => {
  console.log(code, reason);
});
```

## Provider Methods

```typescript
interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

// Send JSON RPC requests
const result = await provider.request(payload: RequestArguments);

// Close provider session
await provider.disconnect()
```

## Web3 Methods

```typescript
//  Get Accounts
const accounts = await web3.eth.getAccounts();

//  Get Chain Id
const chainId = await web3.eth.chainId();

//  Get Network Id
const networkId = await web3.eth.net.getId();

// Send Transaction
const txHash = await web3.eth.sendTransaction(tx);

// Sign Transaction
const signedTx = await web3.eth.signTransaction(tx);

// Sign Message
const signedMessage = await web3.eth.sign(msg);

// Sign Typed Data
const signedTypedData = await web3.eth.signTypedData(msg);
```

## Provider Options

### Required

In order to resolve non-signing requests you need to provide one of the following:

#### Infura ID

The infuraId will support the following chainId's: Mainnet (1), Ropsten (3), Rinkeby(4), Goerli (5) and Kovan (42)

```typescript
const provider = new WalletConnectProvider({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
});
```

#### RPC URL Mapping

The RPC URL mapping should indexed by chainId and it requires at least one value.

```typescript
const provider = new WalletConnectProvider({
  rpc: {
    1: "https://mainnet.mycustomnode.com",
    3: "https://ropsten.mycustomnode.com",
    100: "https://dai.poa.network",
    // ...
  },
});
```

### Optional

You can also customize the connector through the provider using the following options

#### Bridge URL

Use your own hosted bridge by providing the url

```typescript
const provider = new WalletConnectProvider({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
  bridge: "https://bridge.myhostedserver.com",
});
```

#### Disable QR Code Modal

Use your own custom qrcode modal and disable the built-in one

```typescript
const provider = new WalletConnectProvider({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
  qrcode: false,
});

provider.connector.on("display_uri", (err, payload) => {
  const uri = payload.params[0];
  CustomQRCodeModal.display(uri);
});
```

#### Filter Linking Options

If you would like to reduce the number of linking options or customize its order, you can provide an array of wallet names.
Providing empty whitelist disables linking.

```typescript
const provider = new WalletConnectProvider({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
  qrcodeModalOptions: {
    mobileLinks: [
      "rainbow",
      "metamask",
      "argent",
      "trust",
      "imtoken",
      "pillar",
    ],
    desktopLinks: [
      "encrypted ink",
    ]
  }
});
```
