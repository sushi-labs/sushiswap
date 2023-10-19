import { routeProcessor2Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { http, Address, createPublicClient } from 'viem'
import { Chain, mainnet } from 'viem/chains'

import { RP3Address } from './Extractor.test'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

interface RouteParams {
  name: string
  tokenOut: Address
  routeCode: string
}

async function volatilityCheck(args: {
  providerURL: string
  chain: Chain
  RP3Address: Address
  account?: Address
  rpParams: RouteParams[]
}) {
  const transport = http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })

  let startBlockNumber: bigint
  let startTime: number
  const startOutput = new Array(args.rpParams.length)
  let inProgress = false

  client.watchBlockNumber({
    onBlockNumber: async (n) => {
      startBlockNumber = startBlockNumber ?? n
      startTime = startTime ?? Date.now()
      console.log(`block: +${n - startBlockNumber}`)
      if (inProgress === false) {
        inProgress = true
        try {
          for (let i = 0; i < args.rpParams.length; ++i) {
            const params = args.rpParams[i]
            const amountOut = await client
              .simulateContract({
                address: args.RP3Address,
                abi: routeProcessor2Abi,
                functionName: 'processRoute',
                args: [
                  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                  BigInt(1e18),
                  params.tokenOut,
                  0n,
                  args.RP3Address, // use RP3 at to
                  params.routeCode as Address, // !!!!
                ],
                value: BigInt(1e18),
                account: args.account,
              })
              .then((r) => r.result)
            startOutput[i] = startOutput[i] ?? Number(amountOut)
            const diff = Number(amountOut) / startOutput[i] - 1
            const sdiff = diff > 0 ? `+${diff}` : diff
            console.log(
              `    ${params.name} time: +${Math.round(
                (Date.now() - startTime) / 1000,
              )}s diff: ${sdiff}`,
            )
          }
        } catch (e) {
          console.log('Routing failed. No connection ?')
        }
        inProgress = false
      }
    },
  })

  await delay(1000 * 3600 * 24)
}

it.skip('Ethereum volatility check for UniV2 WETH-USDC pool', async () => {
  await volatilityCheck({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    RP3Address: RP3Address[ChainId.ETHEREUM] as Address,
    rpParams: [
      {
        name: 'UniV2 ETH => USDC',
        tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        routeCode:
          '0x0301ffff0201B4e16d0168e52d35CaCD2c6185b44281Ec28C9DcC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc200B4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc00827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV2 ETH => USDT',
        tokenOut: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        routeCode:
          '0x0301ffff02010d4a11d5EEaaC28EC3F61d100daF4d40471f1852C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2000d4a11d5EEaaC28EC3F61d100daF4d40471f185201827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV2 ETH => FRAX 2 pools',
        tokenOut: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
        routeCode:
          '0x0301ffff0201B4e16d0168e52d35CaCD2c6185b44281Ec28C9DcC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc200B4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc0097C4adc5d28A86f9470C70DD91Dc6CC2f20d2d4D04A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB480097C4adc5d28A86f9470C70DD91Dc6CC2f20d2d4D00827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV2 ETH => OHM 3 pools',
        tokenOut: '0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5',
        routeCode:
          '0x0301ffff0201B4e16d0168e52d35CaCD2c6185b44281Ec28C9DcC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc200B4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc0097C4adc5d28A86f9470C70DD91Dc6CC2f20d2d4D04A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB480097C4adc5d28A86f9470C70DD91Dc6CC2f20d2d4D00B612c37688861f1f90761DC7F382C2aF3a50Cc3904853d955aCEf822Db058eb8505911ED77F175b99e00B612c37688861f1f90761DC7F382C2aF3a50Cc3900827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV2 ETH => SUSHI',
        tokenOut: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
        routeCode:
          '0x0301ffff0201CE84867c3c02B05dc570d0135103d3fB9CC19433C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc200CE84867c3c02B05dc570d0135103d3fB9CC1943300827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV2 ETH => APE',
        tokenOut: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
        routeCode:
          '0x0301ffff0201b011EEaab8bF0c6DE75510128dA95498E4b7e67FC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc200b011EEaab8bF0c6DE75510128dA95498E4b7e67F00827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV3 ETH => DAI',
        tokenOut: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        routeCode:
          '0x0301ffff0201827179dD56d07A7eeA32e3873493835da2866976C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201ffff0160594a405d53811d3BC4766596EFD80fd545A27000827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV3 ETH => MIM 2 pools',
        tokenOut: '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
        routeCode:
          '0x0301ffff0201827179dD56d07A7eeA32e3873493835da2866976C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201ffff0188e6A0c2dDD26FEEb64F039a2c41296FcB3f564000827179dD56d07A7eeA32e3873493835da286697601A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB4801ffff01298b7c5e0770D151e4C5CF6cCA4Dae3A3FFc8E2700827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'UniV3 ETH => AAVE',
        tokenOut: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        routeCode:
          '0x0301ffff0201827179dD56d07A7eeA32e3873493835da2866976C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201ffff015aB53EE1d50eeF2C1DD3d5402789cd27bB52c1bB00827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'SushiV2 ETH => FRAX 3 pools',
        tokenOut: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
        routeCode:
          '0x0301ffff0201827179dD56d07A7eeA32e3873493835da2866976C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc202800000eC8C342bc3E07F05B9a782bc34e7f04fB9B4450200827179dD56d07A7eeA32e3873493835da2866976ffff00795065dCc9f64b5614C407a6EFDC400DA6221FB000e06F8d30AC334c857Fc8c380C85969C150f38A6A046B3595068778DD592e39A122f4f5a5cF09C90fE200e06F8d30AC334c857Fc8c380C85969C150f38A6A01827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'SushiV2 ETH => CRV',
        tokenOut: '0xD533a949740bb3306d119CC777fa900bA034cd52',
        routeCode:
          '0x0301ffff020158Dc5a51fE44589BEb22E8CE67720B5BC5378009C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc20058Dc5a51fE44589BEb22E8CE67720B5BC537800901827179dD56d07A7eeA32e3873493835da2866976',
      },
      {
        name: 'SushiV2 ETH => STG',
        tokenOut: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6',
        routeCode:
          '0x0301ffff020109e0f59C53a29EF813ab6de2D4308c13070709cBC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc20009e0f59C53a29EF813ab6de2D4308c13070709cB00827179dD56d07A7eeA32e3873493835da2866976',
      },
    ],
  })
})
