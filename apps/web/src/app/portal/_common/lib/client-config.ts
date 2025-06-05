import {
  type IronSession,
  type SessionOptions,
  getIronSession,
} from 'iron-session'
import { cookies } from 'next/headers'
import { authEnv } from './auth-env'

export type ActiveSession = {
  isLoggedIn: true
  session: {
    id: string
    token: string
  }
  user: {
    id: string
    email: {
      email: string
      isVerified: boolean
    }
  }
}

export type Session = ActiveSession | { isLoggedIn: false }

export const defaultSession: Session = { isLoggedIn: false }

export const sessionOptions: SessionOptions = {
  password: authEnv.AUTH_SESSION_SECRET,
  cookieName: 'portal-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  },
  ttl: 60 * 60 * 24 * 7,
}

export async function createSession(data: Omit<ActiveSession, 'isLoggedIn'>) {
  const session = await getIronSession<ActiveSession>(
    await cookies(),
    sessionOptions,
  )

  session.isLoggedIn = true
  session.session = data.session
  session.user = data.user

  await session.save()
}

export async function getSession<
  T extends Partial<Session> = Session,
>(): Promise<IronSession<T>> {
  const cookiez = await cookies()
  const session = await getIronSession<T>(cookiez, sessionOptions)

  if (!session.isLoggedIn) {
    session.isLoggedIn = false
  }

  return session
}

// Does not include functions and is thus serializable
export async function getSessionData<
  T extends Partial<Session> = Session,
>(): Promise<T> {
  const session = await getSession<T>()

  return JSON.parse(JSON.stringify(session))
}

export async function getLoggedInSessionData() {
  const session = await getSessionData()

  if (!session.isLoggedIn) {
    throw new Error('User not logged in')
  }

  return session
}
