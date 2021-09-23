const { normalizeHardhatNetworkAccountsConfig } = require("hardhat/internal/core/providers/util")

const { BN, bufferToHex, privateToAddress, toBuffer } = require("ethereumjs-util")

module.exports = async function (taskArguments, hre, runSuper) {
  const networkConfig = hre.config.networks[hre.network.name]

  const accounts = normalizeHardhatNetworkAccountsConfig(networkConfig.accounts)

  console.log("Accounts")
  console.log("========")

  for (const [index, privkey] of accounts.entries()) {
    const address = bufferToHex(privateToAddress(toBuffer(privkey)))
    const privateKey = bufferToHex(toBuffer(privkey))
    const balance = new BN(await hre.ethers.provider.getBalance(address).toString())
      .toString()
    console.log(`Account #${index}: ${address} (${balance} WEI)
Private Key: ${privateKey}
`)
  }
}
