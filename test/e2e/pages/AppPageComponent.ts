import { Page } from 'puppeteer'

export abstract class AppPageComponent {
  protected Page: Page

  private ci: string = process.env.CI || 'false'

  constructor(page: Page) {
    this.Page = page
  }

  // @ts-ignore TYPE NEEDS FIXING
  public async blockingWait(seconds, checkCi: boolean = false): Promise<void> {
    let waitSeconds = seconds

    if (checkCi && this.ci === 'true') {
      waitSeconds = seconds * 2
    }

    var waitTill = new Date(new Date().getTime() + waitSeconds * 1000)
    while (waitTill > new Date()) {}
  }
}
