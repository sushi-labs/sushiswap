import { VerifyForm } from './_common/ui/verify-form/verify-form'

export default function Page() {
  return (
    <div className="flex flex-col space-y-12">
      <h1 className="text-4xl font-bold">Verify E-mail</h1>
      <VerifyForm />
    </div>
  )
}
