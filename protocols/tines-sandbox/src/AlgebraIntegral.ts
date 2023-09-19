import AlgebraFactory from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraFactory.sol/AlgebraFactory.json'
import AlgebraPoolDeployer from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraPoolDeployer.sol/AlgebraPoolDeployer.json'
import NonfungiblePositionManager from '@cryptoalgebra/integral-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import NonfungibleTokenPositionDescriptor from '@cryptoalgebra/integral-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json'
import { ChainId } from '@sushiswap/chain'
import { Token, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { Abi, Address, getContractAddress, Hex, PublicClient, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'

const getDeploymentAddress = async (client: WalletClient, promise: Promise<Hex>) =>
  waitForTransactionReceipt(client, { hash: await promise }).then((receipt) => receipt.contractAddress as Address)

export interface AlgebraIntegralPeriphery {
  deployer: Address
  factoryAddress: Address
  factoryABI: typeof AlgebraFactory.abi
  poolDeployerAddress: Address
  poolDeployerABI: typeof AlgebraPoolDeployer.abi
  NonfungibleTokenPositionDescriptorAddress: Address
  NonfungibleTokenPositionDescriptorABI: typeof NonfungibleTokenPositionDescriptor.abi
  NonfungiblePositionManagerAddress: Address
  NonfungiblePositionManagerABI: typeof NonfungiblePositionManager.abi
}

export async function createAlgebraIntegralPeriphery(
  client: PublicClient & WalletClient,
  deployer?: Address
): Promise<AlgebraIntegralPeriphery> {
  const [addr] = await client.getAddresses()
  deployer = deployer ?? addr

  const nextTransactionNonce = await client.getTransactionCount({ address: deployer })
  const poolDeployerAddress = getContractAddress({ from: deployer, nonce: BigInt(nextTransactionNonce) + 1n })

  async function deploy(contract: { abi: unknown; bytecode: string }, args?: unknown[]): Promise<Address> {
    return getDeploymentAddress(
      client,
      client.deployContract({
        chain: null,
        abi: contract.abi as Abi,
        bytecode: contract.bytecode as Hex,
        account: deployer as Address,
        args,
      })
    )
  }

  // Algebra Factory
  const factoryAddress = await deploy(AlgebraFactory, [poolDeployerAddress])
  // const factoryAddress = await getDeploymentAddress(
  //   client,
  //   client.deployContract({
  //     chain: null,
  //     abi: AlgebraFactory.abi,
  //     bytecode: AlgebraFactory.bytecode as Hex,
  //     account: deployer,
  //     args: [poolDeployerAddress],
  //   })
  // )

  // Algebra Vault
  const vaultAddress = (await client.readContract({
    address: factoryAddress,
    abi: AlgebraFactory.abi,
    functionName: 'communityVault',
  })) as Address

  // Algebra PoolDeployer
  const poolDeployerAddressReal = await deploy(AlgebraPoolDeployer, [factoryAddress, vaultAddress])
  // const poolDeployerAddressReal = await getDeploymentAddress(
  //   client,
  //   client.deployContract({
  //     chain: null,
  //     abi: AlgebraPoolDeployer.abi,
  //     bytecode: AlgebraPoolDeployer.bytecode as Hex,
  //     account: deployer,
  //     args: [factoryAddress, vaultAddress],
  //   })
  // )
  console.assert(poolDeployerAddress == poolDeployerAddressReal, 'Unexpected deploy behaviour!')

  // Algebra NFTDescriptor
  //const NFTDescriptorAddress = await deploy(NFTDescriptor)
  // const NFTDescriptorAddress = await getDeploymentAddress(
  //   client,
  //   client.deployContract({
  //     chain: null,
  //     abi: NFTDescriptor.abi,
  //     bytecode: NFTDescriptor.bytecode as Hex,
  //     account: deployer,
  //   })
  // )

  // Algebra NonfungibleTokenPositionDescriptor
  // How deploy with library ?
  const WNativeAddress = WNATIVE_ADDRESS[client.chain?.id as ChainId]
  const NonfungibleTokenPositionDescriptorAddress = await deploy(NonfungibleTokenPositionDescriptor, [
    WNativeAddress,
    'AA',
    [],
  ])
  // const NonfungibleTokenPositionDescriptorAddress = await getDeploymentAddress(
  //   client,
  //   client.deployContract({
  //     chain: null,
  //     abi: NonfungibleTokenPositionDescriptor.abi,
  //     bytecode: NonfungibleTokenPositionDescriptor.bytecode as Hex,
  //     account: deployer,
  //     args: [WNATIVE_ADDRESS[client.chain?.id as ChainId], 'AA', []],
  //   })
  // )

  const NonfungiblePositionManagerAddress = await deploy(NonfungiblePositionManager, [
    factoryAddress,
    WNativeAddress,
    NonfungibleTokenPositionDescriptorAddress,
    poolDeployerAddress,
  ])

  return {
    deployer,
    factoryAddress,
    factoryABI: AlgebraFactory.abi,
    poolDeployerAddress,
    poolDeployerABI: AlgebraPoolDeployer.abi,
    NonfungibleTokenPositionDescriptorAddress,
    NonfungibleTokenPositionDescriptorABI: NonfungibleTokenPositionDescriptor.abi,
    NonfungiblePositionManagerAddress,
    NonfungiblePositionManagerABI: NonfungiblePositionManager.abi,
  }
}

const Two96 = Math.pow(2, 96)
function encodePriceSqrt(reserve1: number, reserve0: number) {
  return BigInt(Math.round(Math.sqrt(reserve1 / reserve0) * Two96))
}

export async function deployPool(
  client: PublicClient & WalletClient,
  env: AlgebraIntegralPeriphery,
  token0: Token,
  token1: Token
): Promise<Address> {
  await client.writeContract({
    chain: null,
    abi: env.NonfungiblePositionManagerABI,
    address: env.NonfungiblePositionManagerAddress,
    account: env.deployer,
    functionName: 'createAndInitializePoolIfNecessary',
    args: [token0.address, token1.address, encodePriceSqrt(1, 1)],
  })
  return (await client.readContract({
    abi: env.factoryABI,
    address: env.factoryAddress,
    functionName: 'poolByPair',
    args: [token0.address, token1.address],
  })) as Address
}
