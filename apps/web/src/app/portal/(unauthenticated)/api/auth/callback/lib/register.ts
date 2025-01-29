import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import type { IdpIntent } from '../../../../../_common/lib/get-idp-intent'

export async function register(idpIntent: IdpIntent) {
  const userServiceClient = getUserServiceClient()
  const result = await userServiceClient.addHumanUser({
    profile: {
      $typeName: 'zitadel.user.v2.SetHumanProfile',
      givenName: idpIntent.idpInformation.rawInformation.givenName,
      familyName: idpIntent.idpInformation.rawInformation.familyName,
    },
    email: {
      $typeName: 'zitadel.user.v2.SetHumanEmail',
      email: idpIntent.idpInformation.rawInformation.email,
      verification: {
        case: 'isVerified',
        value: true,
      },
    },
    idpLinks: [
      {
        $typeName: 'zitadel.user.v2.IDPLink',
        idpId: idpIntent.idpInformation.idpId,
        userId: idpIntent.idpInformation.userId,
        userName: idpIntent.idpInformation.rawInformation.email,
      },
    ],
    passwordType: {
      case: undefined,
    },
  })

  return result
}
