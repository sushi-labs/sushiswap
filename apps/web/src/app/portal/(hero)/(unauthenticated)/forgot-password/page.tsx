import { ForgotPasswordForm } from './_common/ui/forgot-password-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold">Forgot your password?</h1>
      <ForgotPasswordForm />
    </div>
  )
}
