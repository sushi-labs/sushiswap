import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { expect, test } from '@playwright/test'

test('Playwright retries on a new fork and records both attempts', async () => {
  const server = createServer()
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string')
    throw new Error('Expected a TCP port')
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )
  const result = await new Promise<{ code: number | null; output: string }>(
    (resolve, reject) => {
      const child = spawn(
        'pnpm',
        [
          'exec',
          'playwright',
          'test',
          '-c',
          'test/harness/retry-playwright.config.ts',
        ],
        {
          env: { ...process.env, ANVIL_PORT: String(address.port) },
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      )
      let output = ''
      child.stdout.on('data', (chunk: Buffer) => {
        output += chunk.toString()
      })
      child.stderr.on('data', (chunk: Buffer) => {
        output += chunk.toString()
      })
      child.on('error', reject)
      child.on('exit', (code) => resolve({ code, output }))
    },
  )
  expect(result.code, result.output).toBe(0)
  const report: { stats: { flaky: number; unexpected: number } } = JSON.parse(
    await readFile('test-results/retry-probe/results.json', 'utf8'),
  )
  expect(report.stats).toMatchObject({ flaky: 1, unexpected: 0 })
})
