import { ResetPasswordForm } from './_common/ui/reset-password-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <ResetPasswordForm />
    </div>
  )
}
