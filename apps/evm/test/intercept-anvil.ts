import { Page } from '@playwright/test'

export const interceptAnvil = async (page: Page) => {
  await page.route('http://127.0.0.1:8545', async (route, request) => {
    const url = `http://127.0.0.1:8545/${process.env['TEST_WORKER_INDEX']}`
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
}
