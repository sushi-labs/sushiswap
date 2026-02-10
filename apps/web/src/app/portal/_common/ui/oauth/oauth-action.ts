'use server'

import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as z from 'zod'
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

  if (parsed.config.type === 'connect') {
    const cookiez = await cookies()
    const csrfToken = randomUUID()
    cookiez.set('csrf', csrfToken, {
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    parsed.config.csrf = csrfToken
  }

  const idpIntent = await getNewIdpIntent({
    idpId: parsed.idpId,
    config: parsed.config,
  })

  // Remove :443 from the redirect URL
  redirect(idpIntent.nextStep.value.replace('%3A443', ''))
}
