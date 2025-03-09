import { createStyroClient } from '@sushiswap/styro-client'
import { STYRO_BASE_PATH } from './config'

export async function getStyroClient() {
  const { getSessionData } = await import('../client-config')
  const session = await getSessionData()

  if (!session.isLoggedIn) {
    throw new Error('User is not logged in')
  }

  return createStyroClient({
    basePath: STYRO_BASE_PATH,
    accessToken: {
      sessionId: session.session.id,
      sessionToken: session.session.token,
    },
  })
}
