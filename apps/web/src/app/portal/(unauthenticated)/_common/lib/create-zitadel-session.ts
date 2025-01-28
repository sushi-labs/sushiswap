import ms from 'ms'
import { getSessionServiceClient } from 'src/app/portal/(unauthenticated)/_common/lib/zitadel-client'

export async function createZitadelSession(body: {
  email: string
  password: string
}) {
  const sessionServiceClient = getSessionServiceClient()

  return sessionServiceClient.createSession({
    $typeName: 'zitadel.session.v2.CreateSessionRequest',
    lifetime: {
      $typeName: 'google.protobuf.Duration',
      seconds: BigInt(ms('7d')) / 1000n,
      nanos: 0,
    },
    metadata: {},
    checks: {
      $typeName: 'zitadel.session.v2.Checks',
      user: {
        $typeName: 'zitadel.session.v2.CheckUser',
        search: {
          case: 'loginName', // e-mail,
          value: body.email,
        },
      },
      password: {
        $typeName: 'zitadel.session.v2.CheckPassword',
        password: body.password,
      },
    },
  })
}
