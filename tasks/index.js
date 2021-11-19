const { task } = require("hardhat/config")

const { ethers: { constants: { MaxUint256 }}} = require("ethers")

task("accounts", "Prints the list of accounts", require("./accounts"))
task("gas-price", "Prints gas price").setAction(async function({ address }, { ethers }) {
  console.log("Gas price", (await ethers.provider.getGasPrice()).toString())
})

task("bytecode", "Prints bytecode").setAction(async function({ address }, { ethers }) {
  console.log("Bytecode", await ethers.provider.getCode(address))
})

task("feeder:feed", "Feed")
.setAction(async function({ feedDev }, { getNamedAccounts, ethers: { BigNumber }, getChainId }) {
  const { deployer, dev } = await getNamedAccounts()

  const feeder = new ethers.Wallet(process.env.FEEDER_PRIVATE_KEY, ethers.provider)

  await (await feeder.sendTransaction({
    to: deployer,
    value: BigNumber.from(1).mul(BigNumber.from(10).pow(18))
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
.addParam("address", "Fee To")
.setAction(async function ({ address }, { ethers: { getNamedSigner } }, runSuper) {
  const factory = await ethers.getContract("UniswapV2Factory")
  console.log(`Setting factory feeTo to ${address} address`)
  await (await factory.connect(await getNamedSigner('dev')).setFeeTo(address, {
    gasPrice: 1050000000,
  })).wait()
});

task("factory:get-fee-to", "Factory get fee to")
.setAction(async function ({ address }, { ethers: { getNamedSigner } }, runSuper) {
  const factory = await ethers.getContract("UniswapV2Factory")
  console.log(`factory: ${factory.address} feeTo: ${await (await factory.connect(await getNamedSigner('dev')).feeTo())}`)
});

task("factory:get-pair", "Factory get pair")
.addParam("tokenA", "Token A")
.addParam("tokenB", "Token B")
.setAction(async function ({ tokenA, tokenB }, { ethers: { getNamedSigner } }, runSuper) {
  const factory = await ethers.getContract("UniswapV2Factory")
  if (parseInt(tokenA.substring(2, 8), 16) > parseInt(tokenB.substring(2, 8), 16)) {
    [tokenA, tokenB] = [tokenB, tokenA]
  }
  console.log(`${await (await factory.connect(await getNamedSigner('dev')).getPair(tokenA, tokenB))}`)
});

task("factory:query", "Get pair code hash")
.setAction(async function ({ }, { ethers: { getNamedSigner } }, runSuper) {
  const factory = await ethers.getContract("UniswapV2Factory")
  console.log('address', factory.address)
  console.log('feeTo', await (await factory.connect(await getNamedSigner('dev')).feeTo()))
  console.log('feeToSetter', await (await factory.connect(await getNamedSigner('dev')).feeToSetter()))
  console.log('migrator', await (await factory.connect(await getNamedSigner('dev')).migrator()))
  console.log('pairCodeHash', await factory.pairCodeHash())
  console.log('allPairsLength', (await factory.allPairsLength()).toString())
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

task("erc20:balance", "Look up balance")
.addParam("address", "Token address")
.addParam("account", "Account")
.setAction(async function ({ address, account }, { ethers: { getNamedSigner } }, runSuper) {
  const erc20 = await ethers.getContractFactory("UniswapV2ERC20")

  const token = erc20.attach(address)

  console.log('balance', (await token.balanceOf(account)).toString())
});

task("pair:query", "Look up pair")
.addParam("address", "Token address")
.setAction(async function ({ address }, { ethers: { getNamedSigner } }, runSuper) {
  const erc20 = await ethers.getContractFactory("UniswapV2Pair")
  const pair = erc20.attach(address)
  const [ reserve0, reserve1, blockTimestampLast ] = await pair.getReserves();

  console.log('factory', await pair.factory());
  console.log('token0', await pair.token0());
  console.log('token1', await pair.token1());
  console.log('reserve0', reserve0.toString());
  console.log('reserve1', reserve1.toString());
  console.log('blockTimestampLast', blockTimestampLast);
  console.log('price0CumulativeLast', (await pair.price0CumulativeLast()).toString());
  console.log('price1CumulativeLast', (await pair.price1CumulativeLast()).toString());
  console.log('kLast', (await pair.kLast()).toString());
});

task("timelock:logs", "Get logs from timelock")
.setAction(async function ({ _ }, { ethers: { getNamedSigner } }, runSuper) {
  const timelock = await ethers.getContract("Timelock")

  const logs = await ethers.provider.getLogs({
    fromBlock: 1027525,
    toBlock: 'latest',
    address: timelock.address,
  })

  for (let log of logs) {
    const parsed = timelock.interface.parseLog(log)
    console.log(`${parsed.name}: ${parsed.args['signature']} contract:${parsed.args[1]} eta:${parsed.args['eta'].toString()} (${Number.parseInt(parsed.args['eta'].toString()) - ((+ new Date)/1000|0)} away) data:${parsed.args['data']}`)
  }
})

task("masterchef:massupdate", "update reward variables for all pools")
.setAction(async function ({ _ }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  await (await masterChef.connect(await getNamedSigner("dev")).massUpdatePools({
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()

  console.log('mass updated pools')
})

task("masterchef:add", "Add farm to masterchef")
.addParam("alloc", "Allocation Points")
.addParam("address", "Pair Address")
.setAction(async function ({ alloc, address }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  await (await masterChef.connect(await getNamedSigner("dev")).add(alloc, address, true, {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});

function encodeParameters(types, values) {
  const abi = new ethers.utils.AbiCoder()
  return abi.encode(types, values)
}

task("masterchef:add:queue", "Add farm to masterchef (timelock queue)")
.addParam("alloc", "Allocation Points")
.addParam("address", "Pair Address")
.addParam("eta", "Delay")
.setAction(async function ({ alloc, address, eta }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const timelock = await ethers.getContract("Timelock")
  await (await timelock.connect(await getNamedSigner("dev")).queueTransaction(
    masterChef.address,
    "0",
    "add(uint256,address,bool)",
    encodeParameters(["uint256", "address", "bool"], [alloc, address, false]),
    eta,
  {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});

task("masterchef:add:execute", "Add farm to masterchef (timelock execute)")
.addParam("alloc", "Allocation Points")
.addParam("address", "Pair Address")
.addParam("eta", "Delay")
.setAction(async function ({ alloc, address, eta }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const timelock = await ethers.getContract("Timelock")
  await (await timelock.connect(await getNamedSigner("dev")).executeTransaction(
    masterChef.address,
    "0",
    "add(uint256,address,bool)",
    encodeParameters(["uint256", "address", "bool"], [alloc, address, false]),
    eta,
  {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});

task("masterchef:add:cancel", "Add farm to masterchef (timelock cancel)")
.addParam("alloc", "Allocation Points")
.addParam("address", "Pair Address")
.addParam("eta", "Delay")
.setAction(async function ({ alloc, address, eta }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const timelock = await ethers.getContract("Timelock")
  await (await timelock.connect(await getNamedSigner("dev")).cancelTransaction(
    masterChef.address,
    "0",
    "add(uint256,address,bool)",
    encodeParameters(["uint256", "address", "bool"], [alloc, address, false]),
    eta,
  {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});


task("masterchef:set", "Set farm allocation points")
.addParam("pid", "Pool Id")
.addParam("alloc", "Allocation Points")
.addOptionalParam("massUpdate", false)
.setAction(async function ({ pid, alloc, massUpdate }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  await (await masterChef.connect(await getNamedSigner("dev")).set(pid, alloc, massUpdate, {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});

task("masterchef:set:queue", "Set farm allocation points (timelock queue)")
.addParam("pid", "Pool Id")
.addParam("alloc", "Allocation Points")
.addOptionalParam("massUpdate", false)
.addParam("eta", "Delay")
.setAction(async function ({ pid, alloc, massUpdate, eta }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const timelock = await ethers.getContract("Timelock")
  await (await timelock.connect(await getNamedSigner("dev")).queueTransaction(
    masterChef.address,
    "0",
    "set(uint256,uint256,bool)",
    encodeParameters(["uint256", "uint256", "bool"], [pid, alloc, massUpdate]),
    eta,
  {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});

task("masterchef:set:execute", "Set farm allocation points (timelock execute)")
.addParam("pid", "Pool Id")
.addParam("alloc", "Allocation Points")
.addOptionalParam("massUpdate", false)
.addParam("eta", "Delay")
.setAction(async function ({ pid, alloc, massUpdate, eta }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const timelock = await ethers.getContract("Timelock")
  await (await timelock.connect(await getNamedSigner("dev")).executeTransaction(
    masterChef.address,
    "0",
    "set(uint256,uint256,bool)",
    encodeParameters(["uint256", "uint256", "bool"], [pid, alloc, massUpdate]),
    eta,
  {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});

task("masterchef:set:cancel", "Set farm allocation points (timelock cancel)")
.addParam("pid", "Pool Id")
.addParam("alloc", "Allocation Points")
.addOptionalParam("massUpdate", false)
.addParam("eta", "Delay")
.setAction(async function ({ pid, alloc, massUpdate, eta }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const timelock = await ethers.getContract("Timelock")
  await (await timelock.connect(await getNamedSigner("dev")).cancelTransaction(
    masterChef.address,
    "0",
    "set(uint256,uint256,bool)",
    encodeParameters(["uint256", "uint256", "bool"], [pid, alloc, massUpdate]),
    eta,
  {
    gasPrice: 1050000000,
    gasLimit: 5198000,
  })).wait()
});

task("masterchef:farm", "Query farm of masterchef")
.addParam("pid", "Pool ID")
.setAction(async function ({ pid }, { ethers: { getNamedSigner } }, runSuper) {
  const masterChef = await ethers.getContract("MasterChef")

  const { lpToken, allocPoint, lastRewardBlock, accSushiPerShare } = await masterChef.poolInfo(pid)

  console.log('lpToken', lpToken);
  console.log('allocPoint', allocPoint.toString());
  console.log('lastRewardBlock', lastRewardBlock.toString());
  console.log('accSushiPerShare', accSushiPerShare.toString());

  const erc20 = await ethers.getContractFactory("UniswapV2Pair")

  const mlp = erc20.attach(lpToken)
  const [ reserve0, reserve1, blockTimestampLast ] = await mlp.getReserves();

  console.log('lp factory', await mlp.factory());
  console.log('lp token0', await mlp.token0());
  console.log('lp token1', await mlp.token1());
  console.log('lp reserve0', reserve0.toString());
  console.log('lp reserve1', reserve1.toString());
  console.log('lp blockTimestampLast', blockTimestampLast);
  console.log('lp price0CumulativeLast', (await mlp.price0CumulativeLast()).toString());
  console.log('lp price1CumulativeLast', (await mlp.price1CumulativeLast()).toString());
  console.log('lp kLast', (await mlp.kLast()).toString());
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
.setAction(async function ({ a, b }, { ethers: { getNamedSigner } }, runSuper) {
  const factory = await ethers.getContract("UniswapV2Factory")
  const maker = await ethers.getContract("SushiMaker")
  const allPairsLength = Number.parseInt((await factory.allPairsLength()).toString());

  const erc20 = await ethers.getContractFactory("UniswapV2Pair")
  let servedCount = 0;
  for (let i=0; i<allPairsLength; ++i) {
    console.log(`processing pair ${i+1}/${allPairsLength+1}`)
    try {
      const pairAddress = await factory.allPairs(i)
      console.log(`pair: ${pairAddress}`)
      const pair = erc20.attach(pairAddress)

      const balance = await pair.balanceOf(maker.address)
      if (balance.eq(0)) {
          console.log('0 balance')
          continue
      }

      const totalSupply = await pair.totalSupply();

      if (totalSupply.div(balance).eq(1)) {
          console.log(`balance is entirety of LP`)
          continue
      }

      if (totalSupply.div(balance).gt(10000)) {
          console.log(`${totalSupply.div(balance)} less than 1/10000th of LP`)
          continue
      }


      const a = await pair.token0()
      const b = await pair.token1()
      console.log('tokens: ', a, b)

      const served = await (await maker.connect(await getNamedSigner("dev")).convert(a, b, { gasPrice: 1050000000, gasLimit: 5198000 })).wait()
      console.log('served', served.transactionHash)
      ++servedCount
    } catch (e) {
      console.log(`error encountered: ${JSON.stringify(e)}`)
    }
  }
  console.log(`served ${servedCount} of ${allPairsLength}`)
});

