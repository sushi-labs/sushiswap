const { task } = require("hardhat/config")

const { ethers: { constants: { MaxUint256 }}} = require("ethers")

task("accounts", "Prints the list of accounts", require("./accounts"))
task("gas-price", "Prints gas price").setAction(async function({ address }, { ethers }) {
  console.log("Gas price", (await ethers.provider.getGasPrice()).toString())
})

task("bytecode", "Prints bytecode").setAction(async function({ address }, { ethers }) {
  console.log("Bytecode", await ethers.provider.getCode(address))
})

task("feeder:feed", "Feed").setAction(async function({ amount }, { getNamedAccounts, ethers: { BigNumber }, getChainId }) {
  const { deployer, dev } = await getNamedAccounts()

  const feeder = new ethers.Wallet(process.env.FEEDER_PRIVATE_KEY, ethers.provider)

  await (await feeder.sendTransaction({
    to: deployer,
    value: BigNumber.from(1).mul(BigNumber.from(10).pow(17))
  })).wait();
})

task("feeder:return", "Return funds to feeder").setAction(async function({ address }, { ethers: { getNamedSigners } }) {
  const { deployer, dev } = await getNamedSigners()

  await (await deployer.sendTransaction({
    to: process.env.FEEDER_PUBLIC_KEY,
    value: await deployer.getBalance()
  })).wait();

  await (await dev.sendTransaction({
    to: process.env.FEEDER_PUBLIC_KEY,
    value: await dev.getBalance()
  })).wait();
})

task("erc20:approve", "ERC20 approve")
.addParam("token", "Token")
.addParam("spender", "Spender")
.addOptionalParam("deadline", MaxUint256)
.setAction(async function ({ token, spender, deadline }, { ethers: { getNamedSigner } }, runSuper) {
  const erc20 = await ethers.getContractFactory("UniswapV2ERC20")
  
  const slp = erc20.attach(token)   
  
  await (await slp.connect(await getNamedSigner("dev")).approve(spender, deadline)).wait()    
});

task("factory:set-fee-to", "Factory set fee to")
.addParam("feeTo", "Fee To")
.setAction(async function ({ feeTo }, { ethers: { getNamedSigner } }, runSuper) {
  const factory = await ethers.getContract("UniswapV2Factory")
  console.log(`Setting factory feeTo to ${feeTo} address`)
  await (await factory.connect(await getNamedSigner('dev')).setFeeTo(feeTo)).wait() 
});

// TODO: Swap?

// TODO: Test
task("router:add-liquidity", "Router add liquidity")
.addParam("tokenA", "Token A")
.addParam("tokenB", "Token B")
.addParam("tokenADesired", "Token A Desired")
.addParam("tokenBDesired", "Token B Desired")
.addParam("tokenAMinimum", "Token A Minimum")
.addParam("tokenBMinimum", "Token B Minimum")
.addParam("to", "To")
.addOptionalParam("deadline", MaxUint256)
.setAction(async function ({ tokenA, tokenB, tokenADesired, tokenBDesired, tokenAMinimum, tokenBMinimum, to, deadline }, { ethers: { getNamedSigner } }, runSuper) {
  const router = await ethers.getContract("UniswapV2Router")
  await run("erc20:approve", { token: tokenA, spender: router.address })
  await run("erc20:approve", { token: tokenB, spender: router.address })
  await (await router.connect(await getNamedSigner("dev")).addLiquidity(tokenA, tokenB, tokenADesired, tokenBDesired, tokenAMinimum, tokenBMinimum, to, deadline)).wait()    
});

// TODO: Test
task("router:add-liquidity-eth", "Router add liquidity eth")
.addParam("token", "Token")
.addParam("tokenDesired", "Token Desired")
.addParam("tokenMinimum", "Token Minimum")
.addParam("ethMinimum", "ETH Minimum")
.addParam("to", "To")
.addOptionalParam("deadline", MaxUint256)
.setAction(async function ({ token, tokenDesired, tokenMinimum, ethMinimum, to, deadline }, { ethers: { getNamedSigner } }, runSuper) {
  const router = await ethers.getContract("UniswapV2Router")
  await run("erc20:approve", { token, spender: router.address })
  await (await router.connect(await getNamedSigner("dev")).addLiquidityETH(token, tokenDesired, tokenMinimum, ethMinimum, to, deadline)).wait()    
});

task("migrate", "Migrates liquidity from Uniswap to SushiSwap")
  .addOptionalParam("a", "Token A", "0xaD6D458402F60fD3Bd25163575031ACDce07538D")
  .addOptionalParam("b", "Token B", "0xc778417E063141139Fce010982780140Aa0cD5Ab")
  .setAction(require("./migrate"))

task("masterchef:add", "Add pool to masterchef")
.setAction(async function (taskArguments, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  await (await masterChef.connect(await getNamedSigner("dev")).add(1000, '0x3e78a806b127c02b54419191571d9379819e989c', true)).wait()
});

task("masterchef:deposit", "MasterChef deposit")
.addParam("pid", "Pool ID")
.addParam("amount", "Amount")
.setAction(async function ({ pid, amount }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const { lpToken } = await masterChef.poolInfo(pid)

  await run("erc20:approve", { token: lpToken, spender: masterChef.address })

  await (await masterChef.connect(await getNamedSigner("dev")).deposit(pid, amount)).wait()
});

task("masterchef:withdraw", "MasterChef withdraw")
.addParam("pid", "Pool ID")
.addParam("amount", "Amount")
.setAction(async function ({ pid, amount }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const { lpToken } = await masterChef.poolInfo(pid)

  await run("erc20:approve", { token: lpToken, spender: masterChef.address })

  await (await masterChef.connect(await getNamedSigner("dev")).withdraw(pid, amount)).wait()
});

task("bar:enter", "SushiBar enter")
.addParam("amount", "Amount")
.setAction(async function ({ amount }, { ethers: { getNamedSigner } }, runSuper) {
  const sushi = await ethers.getContract("SushiToken")

  const bar = await ethers.getContract("SushiBar")

  await run("erc20:approve", { token: sushi.address, spender: bar.address })
  
  await (await bar.connect(await getNamedSigner("dev")).enter(amount)).wait()
});

task("bar:leave", "SushiBar leave")
.addParam("amount", "Amount")
.setAction(async function ({ amount }, { ethers: { getNamedSigner } }, runSuper) {
  const sushi = await ethers.getContract("SushiToken")

  const bar = await ethers.getContract("SushiBar")

  await run("erc20:approve", { token: sushi.address, spender: bar.address })
  
  await (await bar.connect(await getNamedSigner("dev")).leave(amount)).wait()
});

task("maker:serve", "SushiBar serve")
.addParam("a", "Token A")
.addParam("b", "Token B")
.setAction(async function ({ a, b }, { ethers: { getNamedSigner } }, runSuper) {
  const maker = await ethers.getContract("SushiMaker")

  await (await maker.connect(await getNamedSigner("dev")).convert(a, b, { gasLimitgasLimit: 5198000 })).wait()
});

