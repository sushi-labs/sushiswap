import { Separator } from '@sushiswap/ui'
import Link from 'next/link'
import { OAuthButton } from '../../../_common/ui/oauth/oauth-button'
import { OAuthProvider } from '../../../_common/ui/oauth/oauth-config'
import { RegisterForm } from './_common/ui/register-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold">Register</h1>
      <span className="flex flex-col space-y-8">
        <RegisterForm />
        <div className="flex space-x-1 w-full justify-center text-sm">
          <span>{`Already have an account?`}</span>
          <Link
            href="/portal"
            prefetch={true}
            className="text-blue font-medium hover:text-blue-600"
          >
            <span>{`Sign In`}</span>
          </Link>
        </div>
        <Separator />
        <div className="flex flex-col space-y-4">
          <OAuthButton
            provider={OAuthProvider.Google}
            text="Register with Google"
            config={{ type: 'login' }}
          />
          <OAuthButton
            provider={OAuthProvider.Github}
            text="Register with Github"
            config={{ type: 'login' }}
          />
        </div>
      </span>
    </div>
  )
}
