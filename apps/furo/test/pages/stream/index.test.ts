import { Page, test, expect } from '@playwright/test'
import { Token, USDC_ADDRESS } from '@sushiswap/currency'
import { createSingleStream, switchNetwork, timeout } from '../../utils'

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const RECIPIENT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const USDC = new Token({
  chainId: CHAIN_ID,
  address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
  decimals: 18,
  symbol: 'USDC',
  name: 'USDC Stablecoin',
})

test('Withdraw', async ({ page }) => {
  await createSingleStream(CHAIN_ID, USDC, '0.0001', RECIPIENT, page) // TODO: create fixture for this

  const STREAM_ID = '1082'
  const url = (process.env.PLAYWRIGHT_URL as string).concat(`/stream/${CHAIN_ID}:${STREAM_ID}`)
  await mockSubgraph(page)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)

  const openWithdrawLocator = page.locator('[testdata-id=stream-withdraw-button]')
  await expect(openWithdrawLocator).toBeVisible({ timeout: 5_000 })
  await expect(openWithdrawLocator).toBeEnabled({ timeout: 5_000 })
  await openWithdrawLocator.click()
})

async function mockSubgraph(page: Page) {
  await page.route('https://api.thegraph.com/subgraphs/name/sushi-subgraphs/furo-polygon', async (route, request) => {
    if (request.method() === 'POST') {
      const response = await route.fetch()
      const postData = JSON.parse(request.postData() as string)
      if (postData.query.includes('_0_stream: stream')) {
        console.log('query stream')
        const resultData = {
          data: {
            _0_stream: {
              id: '1082',
              __typename: 'Stream',
              status: 'ACTIVE',
              startedAt: '1683748800',
              expiresAt: '1683756000',
              extendedAtTimestamp: '0',
              modifiedAtTimestamp: '1683753448',
              initialShares: '100',
              initialAmount: '100',
              extendedShares: '0',
              initialSharesExtended: '0',
              remainingShares: '36',
              withdrawnAmount: '64',
              withdrawnAmountAfterExtension: '0',
              txHash: '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
              recipient: { id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
              createdBy: { id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
              token: {
                id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                name: 'USD Coin',
                symbol: 'USDC',
                decimals: '6',
              },
            },
          },
        }
        return await route.fulfill({
          // contentType: 'application/json',
          response,
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('Transaction_orderBy')) {
        console.log('query transactions')
        const resultData = [
          {
            id: '1082:tx:1',
            type: 'WITHDRAWAL',
            amount: '64',
            toBentoBox: false,
            createdAtBlock: '42548574',
            createdAtTimestamp: '1683753448',
            txHash: '0xc8446a2f2c6b7dfe7ce0b7ad7d1b074357bcce5253b27e209f35207c6d2477c7',
            token: {
              id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
              name: 'USD Coin',
              symbol: 'USDC',
              decimals: '6',
            },
            to: {
              id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            },
          },
          {
            id: '1082:tx:0',
            type: 'DEPOSIT',
            amount: '100',
            toBentoBox: true,
            createdAtBlock: '42545913',
            createdAtTimestamp: '1683747786',
            txHash: '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
            token: {
              id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
              name: 'USD Coin',
              symbol: 'USDC',
              decimals: '6',
            },
            to: {
              id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            },
          },
        ]
        return await route.fulfill({
          response,
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('_0_rebase: rebase')) {
        console.log('query rebase')
        const resultData = {
          data: {
            _0_rebase: {
              id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
              base: '135694444444444444445',
              elastic: '135694444444444444445',
            },
          },
        }

        return await route.fulfill({
          response,
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else {
        // throw new Error('Invalid query')
        return await route.continue()
      }
    } else {
      // throw new Error('Not POST')
      return await route.continue()
    }
  })
}

// async function mockStream(page: Page) {
//   return await page.route('https://gateway.thegraph.com/api/**', async (route, request) => {
//     if (request.method() === 'POST') {
//       const postData = JSON.parse(request.postData() as string)
//       if (postData.query.includes('query stream')) {
//         // console.log('ListMarkets')
//         const resultData = {
//           data: {
//             _0_stream: {
//               id: '1082',
//               __typename: 'Stream',
//               status: 'ACTIVE',
//               startedAt: '1683748800',
//               expiresAt: '1683756000',
//               extendedAtTimestamp: '0',
//               modifiedAtTimestamp: '1683753448',
//               initialShares: '100000000000000000000',
//               initialAmount: '100000000000000000000',
//               extendedShares: '0',
//               initialSharesExtended: '0',
//               remainingShares: '35694444444444444445',
//               withdrawnAmount: '64305555555555555555',
//               withdrawnAmountAfterExtension: '0',
//               txHash: '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
//               recipient: { id: '0x3e4c0e5136c5264c210ce6aa889854d0b8380ca1' },
//               createdBy: { id: '0x3e4c0e5136c5264c210ce6aa889854d0b8380ca1' },
//               token: {
//                 id: '0xa36bc53ee0e2a9d0e331ce68b9870dcec3eba022',
//                 symbol: 'GLITCH',
//                 name: 'GLITCH',
//                 decimals: '18',
//               },
//             },
//           },
//         }
//         return await route.fulfill({
//           contentType: 'application/json',
//           body: JSON.stringify(resultData),
//         })
//       } else if (postData.query.includes('query transactions')) {
//         const resultData = [
//           {
//             id: '1082:tx:1',
//             type: 'WITHDRAWAL',
//             amount: '64305555555555555555',
//             toBentoBox: false,
//             createdAtBlock: '42548574',
//             createdAtTimestamp: '1683753448',
//             txHash: '0xc8446a2f2c6b7dfe7ce0b7ad7d1b074357bcce5253b27e209f35207c6d2477c7',
//             token: {
//               id: '0xa36bc53ee0e2a9d0e331ce68b9870dcec3eba022',
//               name: 'GLITCH',
//               symbol: 'GLITCH',
//               decimals: '18',
//             },
//             to: {
//               id: '0x3e4c0e5136c5264c210ce6aa889854d0b8380ca1',
//             },
//           },
//           {
//             id: '1082:tx:0',
//             type: 'DEPOSIT',
//             amount: '100000000000000000000',
//             toBentoBox: true,
//             createdAtBlock: '42545913',
//             createdAtTimestamp: '1683747786',
//             txHash: '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
//             token: {
//               id: '0xa36bc53ee0e2a9d0e331ce68b9870dcec3eba022',
//               name: 'GLITCH',
//               symbol: 'GLITCH',
//               decimals: '18',
//             },
//             to: {
//               id: '0x3e4c0e5136c5264c210ce6aa889854d0b8380ca1',
//             },
//           },
//         ]
//         return await route.fulfill({
//           contentType: 'application/json',
//           body: JSON.stringify(resultData),
//         })
//       } else if (postData.query.includes('query rebase')) {
//         const resultData = {
//           _0_rebase: {
//             id: '0xa36bc53ee0e2a9d0e331ce68b9870dcec3eba022',
//             base: '135694444444444444445',
//             elastic: '135694444444444444445',
//           },
//         }
//         return await route.fulfill({
//           contentType: 'application/json',
//           body: JSON.stringify(resultData),
//         })
//       } else {
//         throw new Error('Invalid query')
//         // return await route.continue()
//       }
//     }
//      else {
//       throw new Error('Not POST')
//       // return await route.continue()
//     }
//   })
// }
