const { task } = require("hardhat/config")

task("accounts", "Prints the list of accounts", require("./accounts"))

task("bytecode", "Prints bytecode").setAction(async function({ address }, { ethers }) {
  console.log("Bytecode", await ethers.provider.getCode(address))
})

task("bigbang", "Big bang").setAction(async function(taskArguments, hre) {
  
})

task("erc20:approve", "MasterChef deposit")
.setAction(async function ({ token, spender }, { ethers: { getNamedSigner, constants: { MaxUint256 } } }, runSuper) {
  const erc20 = await ethers.getContractFactory("UniswapV2ERC20")
  
  const slp = erc20.attach(token)   
  
  await (await slp.connect(await getNamedSigner("dev")).approve(spender, MaxUint256)).wait()    
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

