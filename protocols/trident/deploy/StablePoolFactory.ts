import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

// Defining bytecode and abi from original contract on mainnet to ensure bytecode matches and it produces the same pair code hash
import { abi, bytecode } from '../deployments/ethereum/StablePoolFactory.json'

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  ethers,
  run,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  // async function deployToken(decimals: number, num: number) {
  //   const tokenName = `Token${num}-${decimals}`;
  //   const { address } = await deploy(tokenName, {
  //     contract: "ERC20Mock",
  //     from: deployer,
  //     args: [tokenName, tokenName, ethers.constants.MaxUint256],
  //   });
  //   const token = await ethers.getContract<ERC20Mock>(tokenName);
  //   token.setDecimals(decimals);
  //   return token;
  // }

  const masterDeployer = await ethers.getContract('MasterDeployer')

  const { address, newlyDeployed } = await deploy('StablePoolFactory', {
    contract: {
      abi,
      bytecode,
    },
    from: deployer,
    deterministicDeployment: false,
    args: [masterDeployer.address],
    waitConfirmations: process.env.VERIFY_ON_DEPLOY === 'true' ? 10 : undefined,
  })

  if (!(await masterDeployer.whitelistedFactories(address))) {
    //console.debug("Add StablePoolFactory to MasterDeployer whitelist");
    await (await masterDeployer.addToWhitelist(address)).wait()
  }

  // await deployToken(18, 0);
  // await deployToken(18, 1);
  // await deployToken(6, 0);
  // await deployToken(6, 1);
  // await deployToken(13, 0); // for devil test
  // await deployToken(13, 1);

  if (newlyDeployed && process.env.VERIFY_ON_DEPLOY === 'true') {
    try {
      await run('verify:verify', {
        address,
        constructorArguments: [masterDeployer.address],
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default deployFunction

// deployFunction.dependencies = ["MasterDeployer"];

deployFunction.tags = ['StablePoolFactory']
