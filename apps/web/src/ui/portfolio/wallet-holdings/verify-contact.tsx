import { PlusCircleIcon } from '@heroicons/react-v1/solid'
import { Button } from '@sushiswap/ui'

export const VerifyContact = () => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-muted-foreground">
        This address is not in your contact. Please review carefully.
      </span>
      <Button variant="ghost" size="default" className="!text-blue !gap-1">
        <PlusCircleIcon className="w-4 h-4" />
        <span>Add Contact</span>
      </Button>
    </div>
  )
}
