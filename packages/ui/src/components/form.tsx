'use client'

import type * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'

import classNames from 'classnames'
import { CardDescription, CardHeader, CardTitle } from './card'
import { Label } from './label'

const Form = FormProvider

const FormSection = ({
  title,
  description,
  children,
}: {
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) => {
  return (
    <div className="grid grid-cols-3 gap-x-10 lg:gap-x-[56px] py-2">
      <div className="col-span-3 md:col-span-1 py-4">
        <CardHeader className="!p-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </div>
      <div className="col-span-3 md:col-span-2 space-y-6 py-4">{children}</div>
    </div>
  )
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={classNames('space-y-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <div className="flex w-full justify-between space-x-4 items-center">
      <Label
        ref={ref}
        className={classNames(error && 'text-destructive', className)}
        htmlFor={formItemId}
        {...props}
      />
      <span className="text-sm text-red-500 text-end leading-none">
        {error ? error.message : ''}
      </span>
    </div>
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={classNames('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  if (error)
    return (
      <FormError id={formMessageId} ref={ref} {...props}>
        {body}
      </FormError>
    )

  return (
    <FormDescription id={formMessageId} ref={ref} {...props}>
      {body}
    </FormDescription>
  )
})
FormMessage.displayName = 'FormMessage'

const FormError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={classNames('text-sm font-medium text-red', className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormError.displayName = 'FormError'

function formClassnames(
  {
    isDirty = false,
    isError = false,
  }: { isDirty?: boolean; isError?: boolean },
  ...rest: classNames.ArgumentArray
) {
  return classNames(
    ...rest,
    '!border border-transparent',
    isDirty && '!border-blue-500 border-opacity-40',
    isError && '!border-red-500 border-opacity-40',
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
  useForm,
  useFormField,
  formClassnames,
}
