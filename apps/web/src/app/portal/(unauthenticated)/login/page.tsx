import { Separator } from '@sushiswap/ui'
import Link from 'next/link'
import { GithubButton } from '../_common/ui/github-button'
import { GoogleButton } from '../_common/ui/google-button'
import { LoginForm } from './_common/ui/login-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-12">
      <h1 className="text-4xl font-bold">Sign In</h1>
      <span className="flex flex-col space-y-8">
        <div className="flex w-full flex-col space-y-6">
          <LoginForm />
          <div className="text-sm flex space-x-1 w-full justify-center">
            <span>{`Don't have an account yet?`}</span>
            <Link
              href="/portal/register"
              prefetch={true}
              className="flex items-center text-blue font-medium hover:text-blue-600"
            >
              <span>{`Sign Up`}</span>
            </Link>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col space-y-4">
          <GoogleButton text="Sign in with Google" type="login" />
          <GithubButton text="Sign In with Github" type="login" />
        </div>
      </span>
    </div>
  )
}
