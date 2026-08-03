import {
  Button,
  Checkbox,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
} from '@sushiswap/ui'

export function LegalAcknowledgementDialog({
  open,
  accepted,
  onOpenChange,
  onAcceptedChange,
  onSubmit,
}: {
  open: boolean
  accepted: boolean
  onOpenChange: (open: boolean) => void
  onAcceptedChange: (accepted: boolean) => void
  onSubmit: () => void
}) {
  return (
    <PerpsDialog open={open} onOpenChange={onOpenChange}>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Legal Acknowledgment</PerpsDialogTitle>
          <PerpsDialogDescription className="sr-only">
            Review and accept the token creation terms.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="space-y-5 text-sm leading-6 text-perps-muted-50">
            <div className="space-y-3">
              <p className="font-medium text-perps-muted">I accept that:</p>
              <ul className="list-disc space-y-3 pl-5">
                <li>The token is not being offered as an investment.</li>
                <li>
                  The token does not represent equity, debt, profit-sharing, or
                  other ownership rights.
                </li>
                <li>
                  The creator is responsible for compliance with all applicable
                  laws and regulations, including securities laws.
                </li>
                <li>
                  The creator will not market the token using promises of
                  appreciation or investment returns.
                </li>
              </ul>
            </div>

            <label
              htmlFor="launch-legal-acceptance"
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 text-perps-muted"
            >
              <Checkbox
                id="launch-legal-acceptance"
                checked={accepted}
                onCheckedChange={(checked) =>
                  onAcceptedChange(checked === true)
                }
                className='mt-0.5 !rounded-md !border-perps-muted-50 text-black data-[state="checked"]:!border-perps-muted data-[state="checked"]:!bg-perps-muted'
              />
              <span>I have read and accept the statements above.</span>
            </label>

            <Button
              type="button"
              fullWidth
              size="xl"
              variant="perps-default"
              disabled={!accepted}
              onClick={onSubmit}
            >
              Agree &amp; Create token
            </Button>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
