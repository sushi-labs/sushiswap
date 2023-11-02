import {
  // NextFixture,
  // expect,
  test,
} from 'next/experimental/testmode/playwright'
import { SupportedChainId } from 'src/config'
import { prepareERC20Balance } from 'test/erc20'

if (typeof process.env.NEXT_PUBLIC_CHAIN_ID !== 'string') {
  new Error('NEXT_PUBLIC_CHAIN_ID not set')
}

const CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID as string,
) as SupportedChainId


test.beforeAll(async () => {
  try {
    await prepareERC20Balance({ chainId: CHAIN_ID })
  } catch (error) {
    console.error(
      'Couldn\'t prepare ERC20 balance',
      error,
    )
  }
})

test('Create and remove position', async ({ page }) => {
  // TODO:
})
