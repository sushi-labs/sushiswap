import { Separator } from '@sushiswap/ui'
import { GithubButton } from '../_common/ui/github-button'
import { GoogleButton } from '../_common/ui/google-button'
import { RegisterForm } from './_common/ui/register-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-12">
      <h1 className="text-4xl font-bold">Register</h1>
      <span className="flex flex-col space-y-8">
        <RegisterForm />
        <Separator />
        <div className="flex flex-col space-y-4">
          <GoogleButton text="Register with Google" type="login" />
          <GithubButton text="Register with Github" type="login" />
        </div>
      </span>
    </div>
  )
}
