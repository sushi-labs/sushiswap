import { Page } from '@playwright/test'
import { NextFixture } from 'next/experimental/testmode/playwright'

const url = `http://127.0.0.1:8545/${process.env['TEST_PARALLEL_INDEX']}`

export const interceptAnvil = async (page: Page, next: NextFixture) => {
  await page.route('http://127.0.0.1:8545', async (route, request) => {
    // console.log(
    //   `intercept anvil request url ${request.url()} and re-write to ${url}`,
    // )
    const response = await route.fetch({
      ...request,
      method: request.method(),
      headers: request.headers(),
      url,
    })
    await route.fulfill({ response })
  })

  next.onFetch((request) => {
    if (request.url === 'http://127.0.0.1:8545/') {
      // console.log(
      //   `intercept anvil request url ${request.url} and re-write to ${url}`,
      // )
      return fetch(url, request)
    }
  })
}
