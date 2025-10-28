'use server'

import { verifyTurnstileJwt } from './jwt'

export async function proxySwapAction(url: string, jwt: string) {
  try {
    verifyTurnstileJwt(jwt)
  } catch {
    console.error('Invalid Turnstile JWT')
    // throw new Error('Invalid Turnstile JWT')
  }

  const response = await fetch(url, {
    // headers: {
    //   'Bearer': "-",
    // }
  })

  const data = await response.json()
  return data
}
