import { createZitadelSession } from 'src/app/portal/(hero)/(unauthenticated)/_common/lib/create-zitadel-session'

interface Login {
  userId: string
  idpIntentId: string
  idpIntentToken: string
}

export async function login(params: Login) {
  const result = await createZitadelSession({
    type: 'idp',
    userId: params.userId,
    idpIntentId: params.idpIntentId,
    idpIntentToken: params.idpIntentToken,
  })

  return result
}
