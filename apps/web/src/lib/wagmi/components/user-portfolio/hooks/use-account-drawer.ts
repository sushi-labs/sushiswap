import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'

export const useAccountDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const isAccountDrawerOpen = searchParams.get('accountDrawer') === 'true'
  const accountTab = searchParams.get('accountTab')
  const subAccountTab = searchParams.get('subAccountTab')
  const { createQuery } = useCreateQuery()

  useEffect(() => {
    if (isAccountDrawerOpen) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [isAccountDrawerOpen])

  const handleAccountDrawer = ({
    state,
    params,
  }: {
    state: boolean
    params?: { name: string; value: string } | { name: string; value: string }[]
  }) => {
    const queryArray = []
    if (params) {
      Array.isArray(params)
        ? queryArray.push(...params)
        : queryArray.push(params)
    }
    queryArray.push({ name: 'accountDrawer', value: state ? 'true' : 'false' })
    createQuery(queryArray)

    setIsOpen(state)
  }

  return {
    isOpen,
    handleAccountDrawer,
    accountTab,
    subAccountTab,
  }
}
