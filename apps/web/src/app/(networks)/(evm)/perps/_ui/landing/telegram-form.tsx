'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useSubmitTelegram } from 'src/lib/perps-landing'
import { useAccount } from 'src/lib/wallet'
import { z } from 'zod'

const telegramHandleSchema = z
  .string()
  .transform((v) => v.replace(/^@/, '').trim())
  .refine(
    (v) => /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v),
    'Use 5-32 characters, start with a letter, and only include letters, numbers, or underscores',
  )

export const TelegramForm = () => {
  const [handle, setHandle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const address = useAccount('evm')
  const { mutate, isPending, isSuccess } = useSubmitTelegram()

  const validate = useCallback((value: string) => {
    const cleaned = value.replace(/^@/, '').trim()
    if (cleaned.length === 0) {
      setError(null)
      return
    }

    const result = telegramHandleSchema.safeParse(cleaned)

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid handle')
      return
    }

    setError(null)
    return
  }, [])

  const onChange = useCallback(
    (value: string) => {
      setHandle(value)
      validate(value)
    },
    [validate],
  )

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const cleaned = handle.replace(/^@/, '').trim()

      const result = telegramHandleSchema.safeParse(cleaned)

      if (!result.success) {
        setError(result.error.issues[0]?.message ?? 'Invalid handle')
        return
      }

      mutate({ telegramHandle: cleaned, address })
    },
    [handle, address, mutate],
  )

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence initial={false} mode="wait" key={'thanks'}>
        {isSuccess ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-lufga text-lg md:text-2xl lg:text-3xl text-center"
          >
            Thanks for joining!
          </motion.p>
        ) : null}
      </AnimatePresence>
      {isSuccess ? null : (
        <>
          <form
            onSubmit={onSubmit}
            className="rounded-full z-10 w-full border bg-white border-accent px-2 py-1 relative dark:bg-slate-800"
          >
            <div className="flex items-center pl-2 w-full gap-1 pr-[136px]">
              <p className="text-muted-foreground pb-0.5 shrink-0">@</p>
              <input
                type="text"
                placeholder="Enter your Telegram handle"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent outline-none border-none pl-0 pr-4 py-2 focus:ring-0"
                value={handle}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>

            <div className="absolute right-1.5 top-1.5 bottom-1.5">
              <button
                type="submit"
                disabled={!!error || isPending}
                className="bg-black dark:bg-slate-100 transition-colors disabled:opacity-50 w-[130px] h-full text-white dark:text-black px-4 rounded-full"
              >
                {isPending ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>

          <AnimatePresence initial={false} mode="wait" key={'error'}>
            {error ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                id="telegram-handle-error"
                className="mt-2 px-3 text-xs text-red-500"
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
