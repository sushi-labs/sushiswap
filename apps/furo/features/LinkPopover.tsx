import { Popover } from '@headlessui/react'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { LinkIcon } from '@heroicons/react/solid'
import { Stream, Vesting } from 'features/context'
import { getExplorerLink } from 'functions/explorer'
import { usePopover } from 'hooks/usePopover'
import { FC, useState } from 'react'
import { ArrowFlatLinesUp, CheckIcon, Typography, Link, classNames } from '@sushiswap/ui'
import { useNetwork } from 'wagmi'

interface Props {
  furo?: Stream | Vesting
}

const LinkPopover: FC<Props> = ({ furo }) => {
  const [senderCopied, setSenderCopied] = useState(false)
  const [recipentCopied, setRecipentCopied] = useState(false)
  const { styles, attributes, setReferenceElement, setPopperElement } = usePopover()
  const { activeChain } = useNetwork()

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button ref={setReferenceElement}>
            <div
              className={classNames(
                open ? 'border-slate-700 bg-slate-800' : 'border-slate-800',
                'flex items-center gap-2 px-5 border shadow-md cursor-pointer hover:border-slate-700 active:border-slate-600 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 rounded-xl h-11',
              )}
            >
              <LinkIcon width={18} height={18} />
              <Typography variant="sm" weight={700} className="text-slate-200">
                Links
              </Typography>
            </div>
          </Popover.Button>

          <Popover.Panel
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="overflow-hidden z-10 bg-slate-900 shadow-depth-1 p-4 rounded-xl border border-slate-800 flex gap-4 max-w-[530px]"
          >
            <button
              onClick={() => {
                if (!senderCopied && furo) {
                  navigator.clipboard.writeText(furo.createdBy.id)
                  setTimeout(() => setSenderCopied(false), 1000)
                  setSenderCopied((previous) => !previous)
                }
              }}
              className="flex flex-col items-center gap-2 p-4 border cursor-pointer rounded-xl shadow-depth-1 border-slate-800 hover:border-slate-700 active:border-slate-600"
            >
              <div className="p-4 border rounded-full border-slate-700 bg-slate-800">
                {!senderCopied ? (
                  <ArrowFlatLinesUp width={48} height={48} className="transform rotate-180 text-blue" />
                ) : (
                  <CheckIcon width={48} height={48} className="text-blue" />
                )}
              </div>
              <Typography variant="xs" className="text-slate-200 whitespace-nowrap" weight={700}>
                Copy Sender Link
              </Typography>
            </button>
            <button
              onClick={() => {
                if (!recipentCopied && furo) {
                  navigator.clipboard.writeText(furo.recipient.id)
                  setTimeout(() => setRecipentCopied(false), 1000)
                  setRecipentCopied((previous) => !previous)
                }
              }}
              className="flex flex-col items-center gap-2 p-4 border cursor-pointer rounded-xl shadow-depth-1 border-slate-800 hover:border-slate-700 active:border-slate-600"
            >
              <div className="p-4 border rounded-full border-slate-700 bg-slate-800">
                {!recipentCopied ? (
                  <ArrowFlatLinesUp width={48} height={48} className="text-pink" />
                ) : (
                  <CheckIcon width={48} height={48} className="text-pink" />
                )}
              </div>
              <Typography variant="xs" className="text-slate-200 whitespace-nowrap" weight={700}>
                Copy Recipient Link
              </Typography>
            </button>
            {furo && (
              <Link.External
                className="flex flex-col items-center gap-2 p-4 border cursor-pointer rounded-xl shadow-depth-1 border-slate-800 hover:border-slate-700 active:border-slate-600"
                href={getExplorerLink(activeChain?.id, furo.txHash, 'transaction')}
                target="_blank"
                rel="noreferrer"
              >
                <div className="p-4 border rounded-full border-slate-700 bg-slate-800">
                  <ExternalLinkIcon width={48} height={48} className="text-primary" />
                </div>
                <Typography variant="xs" className="text-slate-200 whitespace-nowrap" weight={700}>
                  View on Etherscan
                </Typography>
              </Link.External>
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}

export default LinkPopover
