import { createServerTransport } from '@zitadel/client/node'
import {
  createSessionServiceClient,
  createUserServiceClient,
} from '@zitadel/client/v2'
import { authEnv } from 'src/app/portal/_common/lib/auth-env'

let serverTransport: ReturnType<typeof createServerTransport> | undefined

export function getServerTransport() {
  if (!serverTransport) {
    serverTransport = createServerTransport(authEnv.ZITADEL_SA_TOKEN, {
      baseUrl: authEnv.ZITADEL_ISSUER,
    })
  }

  return serverTransport
}

let userServiceClient: ReturnType<typeof createUserServiceClient> | undefined

export function getUserServiceClient() {
  if (!userServiceClient) {
    userServiceClient = createUserServiceClient(getServerTransport())
  }

  return userServiceClient
}

let sessionServiceClient:
  | ReturnType<typeof createSessionServiceClient>
  | undefined

export function getSessionServiceClient() {
  if (!sessionServiceClient) {
    sessionServiceClient = createSessionServiceClient(getServerTransport())
  }

  return sessionServiceClient
}
