import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Checkbox from 'app/components/Checkbox'
import ListLogo from 'app/components/ListLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { classNames, listVersionLabel } from 'app/functions'
import { useFetchListCallback } from 'app/hooks/useFetchListCallback'
import { useCurrencyModalContext } from 'app/modals/SearchModal/CurrencySearchModal'
import { useAppDispatch } from 'app/state/hooks'
import { enableList, removeList } from 'app/state/lists/actions'
import { useAllLists } from 'app/state/lists/hooks'
import React, { FC, useCallback, useState } from 'react'

import CurrencyModalView from './CurrencyModalView'

const ImportList: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { setView, onDismiss, listUrl, importList } = useCurrencyModalContext()
  const [confirmed, setConfirmed] = useState(false)
  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [addError, setAddError] = useState<string>()
  const adding = Boolean(listUrl && lists[listUrl]?.loadingRequestId)
  const handleAddList = useCallback(() => {
    if (adding || !listUrl) return
    setAddError(undefined)
    fetchList(listUrl)
      .then(() => {
        gtag('event', 'Add List', {
          event_category: 'Lists',
          event_label: listUrl,
        })
        dispatch(enableList(listUrl))
        setView(CurrencyModalView.manage)
      })
      .catch((error) => {
        gtag('event', 'Add List Failed', {
          event_category: 'Lists',
          event_label: listUrl,
        })

        setAddError(error.message)
        dispatch(removeList(listUrl))
      })
  }, [adding, dispatch, fetchList, listUrl, setView])

  return (
    <>
      <HeadlessUiModal.Header
        onClose={onDismiss}
        header={i18n._(t`Import List`)}
        onBack={() => setView(CurrencyModalView.manage)}
      />
      <HeadlessUiModal.BorderedContent className="bg-[rgba(0,0,0,0.2)]">
        <div className="flex gap-3">
          {importList?.logoURI && (
            <ListLogo size="40px" logoURI={importList.logoURI} alt={`${importList.name} list logo`} />
          )}
          <div className="flex flex-col">
            <Typography weight={700} className={classNames('text-primary overflow-hidden overflow-ellipsis')}>
              {importList?.name}{' '}
              {importList && (
                <Typography variant="xs" weight={700} component="span">
                  {listVersionLabel(importList.version)}
                </Typography>
              )}
            </Typography>
            <div className="flex items-center gap-1">
              <Typography variant="xs" className="text-white">
                {i18n._(t`${importList?.tokens.length} tokens`)}
              </Typography>
            </div>
          </div>
        </div>
      </HeadlessUiModal.BorderedContent>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 !border-yellow/30">
        <Typography variant="xs" className="text-yellow" weight={700}>
          {i18n._(t`Import at your own risk`)}
        </Typography>
        <Typography variant="sm" className="text-yellow" weight={700}>
          {i18n._(t`By adding this list you are implicitly trusting that the data is correct. Anyone can create a list,
              including creating fake versions of existing lists and lists that claim to represent projects that do not
              have one.`)}
        </Typography>
        <Typography variant="sm" className="text-yellow" weight={700}>
          {i18n._(t`If you purchase a token from this list, you may not be able to sell it back.`)}
        </Typography>
        <div className="flex flex-row items-center gap-3 cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            className="h-5 m-0"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Typography weight={700}>{i18n._(t`I understand`)}</Typography>
        </div>
      </HeadlessUiModal.BorderedContent>
      <div className="flex flex-grow" />
      <Button color="blue" disabled={!confirmed} onClick={handleAddList}>
        {i18n._(t`Import`)}
      </Button>
      {addError ? (
        <Typography variant="sm" weight={700} className="overflow-hidden text-center text-ellipsis text-red">
          {addError}
        </Typography>
      ) : null}
    </>
  )
}

export default ImportList
