import { DocumentAddIcon, DocumentDownloadIcon, ExclamationIcon } from '@heroicons/react-v1/outline'
import { classNames, Typography } from '@sushiswap/ui'
import { FormType } from '../page'
import React, { FC, useCallback } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'

export const UploadImageField: FC = () => {
  const { register, setValue } = useFormContext<FormType>()

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles) => {
      setValue('logoFile', acceptedFiles[0])
    },
    [setValue]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={classNames(
        isDragActive ? 'border border-purple' : 'border-dashed border-slate-600',
        'flex justify-center px-6 pt-5 pb-6 border-2 rounded-md flex-grow cursor-pointer'
      )}
    >
      <input {...register('logoUri')} className="hidden" />

      <div className="flex flex-col items-center space-y-1 text-center">
        {isDragReject ? (
          <ExclamationIcon width={48} />
        ) : isDragActive ? (
          <DocumentDownloadIcon width={48} />
        ) : (
          <DocumentAddIcon width={48} />
        )}
        <div className="flex text-sm text-slate-600">
          <Typography
            as="label"
            variant="sm"
            className={classNames(
              isDragActive ? '' : 'text-purple',
              'outline-none relative cursor-pointer rounded-md font-medium hover:purple focus-within:outline-none'
            )}
          >
            <label htmlFor="file-upload" className="outline-none">
              {isDragReject ? 'File is not supported' : isDragActive ? 'Drop file to upload' : 'Upload a SVG'}
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="outline-none sr-only"
              {...getInputProps()}
            />
          </Typography>
          {!isDragActive && <p className="pl-1">or drag and drop</p>}
        </div>
      </div>
    </div>
  )
}
