import { createStyroClient } from '@sushiswap/styro-client'
import { authEnv } from '../auth-env'
import { STYRO_BASE_PATH } from './config'

export function getUnauthenticatedStyroClient() {
  return createStyroClient({
    basePath: STYRO_BASE_PATH,
    accessToken: {
      sessionId: '',
      sessionToken: '',
    },
  })
}

export function getAdminStyroClient() {
  return createStyroClient({
    basePath: STYRO_BASE_PATH,
    accessToken: {
      pat: authEnv.ZITADEL_SA_TOKEN,
    },
  })
}

export async function getUserStyroClient() {
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
