'use client'

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAppVersion } from './use-app-version'

export const NewAppVersionDialog = () => {
  const [open, setOpen] = useState<null | boolean>(null)

  const { data } = useAppVersion()

  useEffect(() => {
    if (open === null && data?.client !== data?.server) {
      setOpen(true)
    }
  }, [open, data?.client, data?.server])

  return (
    <Dialog open={!!open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="py-2.5">
          <DialogTitle className="text-xl !text-left">
            New Version Available!
          </DialogTitle>
        </DialogHeader>
        <Card>
          <div className="p-4 flex flex-col gap-4">
            <div className="relative w-full">
              <Image
                loader={cloudinaryFetchLoader}
                src="https://cdn.sushi.com/image/upload/v1733481287/new-version-banner.jpg"
                width={400}
                height={250}
                alt="New Version Available"
                className="rounded-xl"
                layout="responsive"
              />
            </div>
            <span>
              A new version of Sushi is now available, featuring improvements
              and updates to enhance your experience.
            </span>
          </div>
        </Card>
        <DialogFooter>
          <Button fullWidth size="xl" onClick={() => window.location.reload()}>
            Refresh App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
