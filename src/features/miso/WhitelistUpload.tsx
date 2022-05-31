import { getAddress } from '@ethersproject/address'
import { DocumentAddIcon, DocumentDownloadIcon, ExclamationIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import WhitelistTable from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/WhitelistTable'
import { WhitelistEntry } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import React, { FC, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface WhitelistUploadProps {
  value: WhitelistEntry[]
  disabled: boolean
  onChange: React.Dispatch<React.SetStateAction<WhitelistEntry[]>>
}

const WhitelistUpload: FC<WhitelistUploadProps> = ({ disabled, onChange, value }) => {
  const { i18n } = useLingui()

  const onDrop = useCallback(
    (acceptedFiles) => {
      // @ts-ignore TYPE NEEDS FIXING
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          const { result } = reader
          if (typeof result === 'string') {
            const arr = result.split('\r\n')
            const points = arr.reduce<WhitelistEntry[]>((acc, cur) => {
              if (cur !== '') {
                const [account, amount] = cur.split(',')
                acc.push({ account: getAddress(account), amount })
              }

              return acc
            }, [])

            onChange((prevState) => [...prevState, ...points])
          }
        }

        reader.readAsText(file)
      })
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept:
      '.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values',
  })

  return (
    <>
      <div
        className={classNames(
          'col-span-6',
          value?.length > 0 ? 'md:col-span-3' : 'md:col-span-6',
          !disabled ? '' : 'pointer-events-none opacity-40 filter saturate-[0.1]'
        )}
      >
        <Typography weight={700}>{i18n._(t`Upload`)}</Typography>
        <Typography className="mt-1 text-secondary">{i18n._(t``)}</Typography>
        <div
          {...getRootProps()}
          className={classNames(
            isDragActive ? 'border border-purple' : 'border-dashed border-dark-800',
            'mt-2 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md'
          )}
        >
          <div className="space-y-1 text-center flex flex-col items-center">
            {isDragReject ? (
              <ExclamationIcon width={48} />
            ) : isDragActive ? (
              <DocumentDownloadIcon width={48} />
            ) : (
              <DocumentAddIcon width={48} />
            )}
            <div className="flex text-sm text-gray-600">
              <Typography
                variant="sm"
                className={classNames(
                  isDragActive ? '' : 'text-purple',
                  'outline-none relative cursor-pointer rounded-md font-medium hover:purple focus-within:outline-none'
                )}
              >
                <label htmlFor="file-upload" className="cursor-pointer outline-none">
                  {isDragReject
                    ? i18n._(t`Files is not supported`)
                    : isDragActive
                    ? i18n._(t`Drop file to upload`)
                    : i18n._(t`Upload a file`)}
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only outline-none"
                  {...getInputProps()}
                />
              </Typography>
              {!isDragActive && <p className="pl-1">{i18n._(t`or drag and drop`)}</p>}
            </div>
            <p className="text-xs text-gray-500">{i18n._(t`CSV up to 10MB`)}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {i18n._(t`CSV's must use a comma delimiter. Amounts should NOT contain commas`)}
        </p>
      </div>
      {value.length > 0 && <WhitelistTable entries={value} />}
    </>
  )
}

export default WhitelistUpload
