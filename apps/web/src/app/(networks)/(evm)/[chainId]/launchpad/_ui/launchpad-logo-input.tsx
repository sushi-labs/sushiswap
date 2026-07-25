'use client'

import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'
import {
  type PreparedLaunchpadLogoFile,
  prepareLaunchpadLogoFile,
} from '../_lib/launchpad-logo'

interface LaunchpadLogoInputProps {
  id: string
  prompt: string
  value: PreparedLaunchpadLogoFile | null
  onChange: (selection: PreparedLaunchpadLogoFile | null) => void
  onProcessingChange?: (isProcessing: boolean) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function selectionDetails(selection: PreparedLaunchpadLogoFile): string {
  const result = `${selection.width}×${selection.height} · ${formatFileSize(
    selection.file.size,
  )}`
  if (!selection.wasOptimized) return result

  return `Optimized from ${selection.originalWidth}×${selection.originalHeight} · ${formatFileSize(selection.originalBytes)} to ${result}`
}

export function LaunchpadLogoInput({
  id,
  prompt,
  value,
  onChange,
  onProcessingChange,
}: LaunchpadLogoInputProps) {
  const requestId = useRef(0)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  async function selectLogo(file: File | undefined): Promise<void> {
    if (!file) return

    const currentRequestId = ++requestId.current
    setError(null)

    setIsProcessing(true)
    onProcessingChange?.(true)

    try {
      const prepared = await prepareLaunchpadLogoFile(file)
      if (requestId.current !== currentRequestId) return

      onChange(prepared)
    } catch (selectionError) {
      if (requestId.current !== currentRequestId) return

      setError(
        selectionError instanceof Error
          ? selectionError.message
          : 'The image could not be processed',
      )
    } finally {
      if (requestId.current === currentRequestId) {
        setIsProcessing(false)
        onProcessingChange?.(false)
      }
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="flex min-h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.03] p-5 text-center transition hover:border-perps-blue/40 hover:bg-perps-blue/5"
      >
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            const input = event.currentTarget
            void selectLogo(file).finally(() => {
              if (input.files?.[0] === file) input.value = ''
            })
          }}
        />
        <span>
          <CloudArrowUpIcon className="mx-auto h-6 w-6 text-perps-blue" />
          <span className="mt-2 block text-sm font-medium">
            {isProcessing
              ? 'Checking and optimizing image…'
              : (value?.file.name ?? prompt)}
          </span>
          <span className="mt-1 block text-xs text-perps-muted-50">
            {value
              ? selectionDetails(value)
              : 'PNG, JPEG, or WebP. Images over 512×512 or 1 MB are resized automatically.'}
          </span>
        </span>
      </label>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
