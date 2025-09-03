import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback } from 'react'

const CONTACTS_KEY = 'sushi.contact-list'

export interface Contact {
  address: string
  name: string
  ensName?: string
}

type ContactMap = Record<string, Contact>

export function useContacts() {
  const [contacts, setContacts] = useLocalStorage<ContactMap>(CONTACTS_KEY, {})

  const addContact = useCallback(
    (contact: Contact) => {
      setContacts((prev) => ({
        ...prev,
        [contact.address]: contact,
      }))
    },
    [setContacts],
  )

  const updateContact = useCallback(
    (address: string, name: string, ensName?: string) => {
      setContacts((prev) => {
        if (!prev[address]) return prev
        return {
          ...prev,
          [address]: { ...prev[address], name, ensName },
        }
      })
    },
    [setContacts],
  )

  const deleteContact = useCallback(
    (address: string) => {
      setContacts((prev) => {
        const updated = { ...prev }
        delete updated[address]
        return updated
      })
    },
    [setContacts],
  )

  const hasContact = useCallback(
    (address: string) => {
      return !!contacts[address]
    },
    [contacts],
  )

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    hasContact,
  }
}
