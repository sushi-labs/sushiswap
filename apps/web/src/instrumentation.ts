import { installBigintSerializer } from './instrumentation/bigint-json'
installBigintSerializer()

export async function register() {
  if (process.env.NEXT_RUNTIME === 'node') {
    const { register } = await import('./instrumentation/register.server')
    register()
  }
}
