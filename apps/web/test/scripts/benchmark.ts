import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'

type Sample = {
  workers: number
  repetition: number
  durationMs: number
  passed: boolean
}

function median(values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b)
  return (sorted[4] + sorted[5]) / 2
}

const samples: Sample[] = []
// Alternate configurations to reduce warm-up/order bias. Build separately once.
for (let repetition = 0; repetition < 10; repetition++) {
  for (const workers of repetition % 2 === 0 ? [1, 2] : [2, 1]) {
    const started = performance.now()
    const result = spawnSync(
      'pnpm',
      [
        'exec',
        'playwright',
        'test',
        '-c',
        'test/playwright.config.ts',
        '--retries=0',
        `--workers=${workers}`,
      ],
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          CI: '1',
          E2E_REPORT_SUITE: `benchmark/${workers}-${repetition}`,
        },
      },
    )
    samples.push({
      workers,
      repetition,
      durationMs: performance.now() - started,
      passed: result.status === 0,
    })
    await mkdir('test-results/benchmark', { recursive: true })
    await writeFile(
      'test-results/benchmark/samples.json',
      JSON.stringify(samples, null, 2),
    )
    if (result.signal) process.exit(1)
  }
}
const one = samples.filter((sample) => sample.workers === 1)
const two = samples.filter((sample) => sample.workers === 2)
const summary = {
  revision: process.env.GITHUB_SHA,
  oneWorkerMedianMs: median(one.map((sample) => sample.durationMs)),
  twoWorkerMedianMs: median(two.map((sample) => sample.durationMs)),
  oneWorkerFailures: one.filter((sample) => !sample.passed).length,
  twoWorkerFailures: two.filter((sample) => !sample.passed).length,
}
await writeFile(
  'test-results/benchmark/summary.json',
  JSON.stringify(summary, null, 2),
)
console.log(summary)
if (samples.some((sample) => !sample.passed)) process.exitCode = 1
