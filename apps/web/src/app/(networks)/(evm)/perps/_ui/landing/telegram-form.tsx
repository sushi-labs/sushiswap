'use client'

import { useCallback, useState } from 'react'
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
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const address = useAccount('evm')

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
    async (e: React.FormEvent) => {
      e.preventDefault()

      const cleaned = handle.replace(/^@/, '').trim()

      const result = telegramHandleSchema.safeParse(cleaned)

      if (!result.success) {
        setError(result.error.issues[0]?.message ?? 'Invalid handle')
        return
      }

      try {
        setIsSubmitting(true)

        console.log('Telegram handle:', cleaned)
        console.log('User address:', address)

        // await submit logic
        setSubmitted(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        // console.error('Failed to submit telegram handle:', message)
        setError(message || 'Submission failed. Please try again.')
        return
      } finally {
        setIsSubmitting(false)
      }
    },
    [handle, address],
  )

  return (
    <div className="w-full max-w-lg mx-auto">
      {submitted ? (
        <p className="font-lufga fade-in text-lg md:text-2xl lg:text-3xl text-center">
          Thanks for joining!
        </p>
      ) : (
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
                // disabled={!!error || isSubmitting}
                className="bg-black dark:bg-slate-100 transition-colors disabled:opacity-50 w-[130px] h-full text-white dark:text-black px-4 rounded-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
          {error ? (
            <p
              id="telegram-handle-error"
              className="mt-2 px-3 text-sm text-red-500 fade-in"
            >
              {error}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
