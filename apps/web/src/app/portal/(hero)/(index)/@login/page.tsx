import { Separator } from '@sushiswap/ui'
import Link from 'next/link'
import { OAuthButton } from '../../../_common/ui/oauth/oauth-button'
import { OAuthProvider } from '../../../_common/ui/oauth/oauth-config'
import { LoginForm } from './_common/ui/login-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold">Sign In</h1>
      <span className="flex flex-col space-y-8">
        <div className="flex w-full flex-col space-y-6">
          <LoginForm />
          <div className="flex flex-col space-y-1 items-center text-sm">
            <Link
              href="/portal/forgot-password"
              prefetch={true}
              className="text-blue font-medium hover:text-blue-600"
            >
              <span>{`Forgot password?`}</span>
            </Link>
            <div className="flex space-x-1 w-full justify-center">
              <span>{`Don't have an account yet?`}</span>
              <Link
                href="/portal/register"
                prefetch={true}
                className="text-blue font-medium hover:text-blue-600"
              >
                <span>{`Sign Up`}</span>
              </Link>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col space-y-4">
          <OAuthButton
            provider={OAuthProvider.Google}
            text="Sign in with Google"
            config={{ type: 'login' }}
          />
          <OAuthButton
            provider={OAuthProvider.Github}
            text="Sign In with Github"
            config={{ type: 'login' }}
          />
        </div>
      </span>
    </div>
  )
}
