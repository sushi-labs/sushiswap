'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'
import { IconButton } from './iconbutton'

const dialogContentLayout =
  'rounded-b-none md:rounded-b-2xl bottom-0 md:bottom-[unset] fixed left-[50%] md:top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] md:translate-y-[-50%] gap-4 p-6 rounded-2xl md:w-full data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-bottom-[48%] md:data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-bottom-[48%] md:data-[state=open]:slide-in-from-top-[48%]'

const dialogVariants = cva(
  'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  {
    variants: {
      variant: {
        default: [
          dialogContentLayout,
          'bg-gray-100 dark:bg-slate-800 black:bg-secondary shadow-lg',
        ],
        perps: [
          dialogContentLayout,
          'border border-white/[0.07] bg-perps-background/95 text-perps-muted shadow-[inset_1.5px_2px_1px_-2px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_1px_-2px_rgba(255,255,255,0.125)] backdrop-blur-2xl',
        ],
        opaque: 'px-4 fixed z-50 top-4 grid w-full max-w-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const dialogOverlayVariants = cva(
  'fixed inset-0 z-50 transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
  {
    variants: {
      variant: {
        default: 'bg-black/10 backdrop-blur-sm',
        perps: 'bg-black/10 backdrop-blur-sm',
        opaque: 'bg-gray-100 dark:bg-slate-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const dialogCloseVariants = cva('', {
  variants: {
    variant: {
      default: 'absolute top-6 right-6',
      perps: 'absolute top-6 right-6',
      opaque: 'hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

const DialogPortal = ({
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
)
DialogPortal.displayName = DialogPrimitive.Portal.displayName

interface DialogOverlay
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof dialogOverlayVariants> {}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlay
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={dialogOverlayVariants({ variant, className })}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogVariants> {
  hideClose?: boolean
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    { className, hideClose: _hideClose = false, variant, children, ...props },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay variant={variant} />
      <DialogPrimitive.Content
        ref={ref}
        className={dialogVariants({ variant, className })}
        {...props}
      >
        {children}
        {_hideClose ? null : (
          <DialogPrimitive.Close
            asChild
            className={dialogCloseVariants({ variant })}
          >
            <IconButton
              icon={XMarkIcon}
              name="Close"
              variant={variant === 'perps' ? 'perps-secondary' : undefined}
            />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classNames(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classNames(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={classNames(
      'text-lg font-semibold leading-none tracking-tight mr-[64px]',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={classNames('text-sm text-muted-foreground mr-[64px]', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPrimitive,
  DialogTitle,
  DialogTrigger,
}
