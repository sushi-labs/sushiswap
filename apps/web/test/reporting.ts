import path from 'node:path'
import type { PlaywrightTestConfig } from '@playwright/test'

export function reporting(
  suite: string,
): Pick<PlaywrightTestConfig, 'outputDir' | 'reporter'> {
  const directory = path.resolve(
    'test-results',
    suite === 'fork' ? (process.env.E2E_REPORT_SUITE ?? suite) : suite,
  )
  return {
    outputDir: path.join(directory, 'artifacts'),
    reporter: [
      [process.env.CI ? 'github' : 'list'],
      ['html', { outputFolder: path.join(directory, 'html'), open: 'never' }],
      ['json', { outputFile: path.join(directory, 'results.json') }],
    ],
  }
}
