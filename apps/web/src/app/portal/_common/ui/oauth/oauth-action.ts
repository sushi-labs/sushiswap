'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  getIdpIntentSchema,
  getNewIdpIntent,
} from '../../lib/get-new-idp-intent'

const oauthFormSchema = z.object({
  idpId: z.string(),
  config: getIdpIntentSchema,
})

export async function oauthAction(data: z.infer<typeof oauthFormSchema>) {
  const parsed = oauthFormSchema.parse(data)

  const idpIntent = await getNewIdpIntent({
    idpId: parsed.idpId,
    config: parsed.config,
  })

  // Remove :443 from the redirect URL
  redirect(idpIntent.nextStep.value.replace('%3A443', ''))
}
