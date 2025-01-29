import { Separator } from '@sushiswap/ui'
import { OAuthButton, OAuthProvider } from '../../_common/ui/oauth/oauth-button'
import { RegisterForm } from './_common/ui/register-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-12">
      <h1 className="text-4xl font-bold">Register</h1>
      <span className="flex flex-col space-y-8">
        <RegisterForm />
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
