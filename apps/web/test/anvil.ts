import { execFileSync } from 'node:child_process'

export function assertAnvilVersion(): void {
  const output = execFileSync('anvil', ['--version'], {
    encoding: 'utf8',
    timeout: 10_000,
  })
  const version = output.match(/Version: (\d+\.\d+\.\d+)/)?.[1]
  // Keep this aligned with the E2E workflow and the recorded fork baseline.
  if (version !== '1.8.1') {
    throw new Error(
      `E2E requires Anvil 1.8.1 (matching CI); found ${output.split('\n')[0]}`,
    )
  }
}
