import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { ManageDialogHeader } from './manage-dialog-header'

//@DEV @TODO - typed as any until real type is known
export const ManageDialog = ({
  data,
  isOpen,
  setIsOpen,
}: {
  data: any
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="networks" className="w-full !rounded-full">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent
        // hideClose={true}
        aria-describedby={undefined}
        className="!px-1 border-t !max-w-full md:!max-w-[520px] border-[#EBEBEB] rounded-t-none md:rounded-t-2xl !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800 w-full  max-h-[100dvh] overflow-y-auto hide-scrollbar"
      >
        <DialogTitle className="!font-medium px-3">
          <ManageDialogHeader data={data} />
        </DialogTitle>

        <div className="md:px-4">{'content'}</div>
      </DialogContent>
    </Dialog>
  )
}
