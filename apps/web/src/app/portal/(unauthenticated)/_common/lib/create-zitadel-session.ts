import ms from 'ms'
import { getSessionServiceClient } from 'src/app/portal/_common/lib/zitadel-client'

type CreateZitadelSession =
  | {
      type: 'password'
      email: string
      password: string
    }
  | {
      type: 'idp'
      userId: string
      idpIntentId: string
      idpIntentToken: string
    }

export async function createZitadelSession(body: CreateZitadelSession) {
  const sessionServiceClient = getSessionServiceClient()

  if (body.type === 'idp') {
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
            case: 'userId',
            value: body.userId,
          },
        },
        idpIntent: {
          $typeName: 'zitadel.session.v2.CheckIDPIntent',
          idpIntentId: body.idpIntentId,
          idpIntentToken: body.idpIntentToken,
        },
      },
    })
  }

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
