import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react'
import { FieldErrors, FieldValues } from 'react-hook-form'

interface State<T extends FieldValues> {
  errors: FieldErrors<T>
  setErrors: Dispatch<SetStateAction<FieldErrors<T>>>
}

interface ImportErrorContextProps {
  children: ReactNode
}

const ImportErrorContext = createContext<FieldValues>({})

export const ImportErrorProvider = <T extends FieldValues>({ children }: ImportErrorContextProps) => {
  const [errors, setErrors] = useState<FieldErrors<T>>({})

  return (
    <ImportErrorContext.Provider value={useMemo(() => ({ errors, setErrors }), [errors])}>
      {children}
    </ImportErrorContext.Provider>
  )
}

export const useImportErrorContext = <T extends FieldValues>() => {
  const context = useContext<State<T>>(ImportErrorContext as unknown as React.Context<State<T>>)
  if (!context) {
    throw new Error('Hook can only be used inside Import Error Context')
  }

  return context
}
