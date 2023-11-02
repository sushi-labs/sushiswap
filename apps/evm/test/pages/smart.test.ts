import {
  // NextFixture,
  // expect,
  test,
} from 'next/experimental/testmode/playwright'
import { SupportedChainId } from 'src/config'
import { ChainId } from 'sushi/chain'
import { impersonateAccount } from 'test/erc20'

if (typeof process.env.NEXT_PUBLIC_CHAIN_ID !== 'string') {
  new Error('NEXT_PUBLIC_CHAIN_ID not set')
}
const BASE_URL = 'http://localhost:3000/pool'

const CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID as string,
) as SupportedChainId

test.beforeAll(async () => {
  test.skip(CHAIN_ID !== ChainId.POLYGON)
  const address = '0x23DefC2Ca207e7FBD84AE43B00048Fb5Cb4DB5B2'
  try {
    await impersonateAccount({
      chainId: CHAIN_ID,
      address,
    })
  } catch (error) {
    console.error(`Couldn't impersonate account, ${address}`, error)
  }
})

test('Create and remove position', async ({ page }) => {
  // TODO:
  await page.goto(BASE_URL)
  await page.locator('[testdata-id=my-positions-button]').click()

})
