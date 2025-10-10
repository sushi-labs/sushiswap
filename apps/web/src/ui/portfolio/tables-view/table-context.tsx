'use client'
import { createContext, useContext, useState } from 'react'

type TablesContextType = {
  tableView: PORTFOLIO_TABLE_VIEW
  setTableView: (view: PORTFOLIO_TABLE_VIEW) => void
}

export enum PORTFOLIO_TABLE_VIEW {
  ALL = 'All',
  LP_POSITIONS = 'LP Positions',
  OPEN_ORDERS = 'Open Orders',
}

const Context = createContext<TablesContextType>({} as TablesContextType)

const Content = ({ children }: { children: React.ReactNode }) => {
  const [tableView, setTableView] = useState<PORTFOLIO_TABLE_VIEW>(
    PORTFOLIO_TABLE_VIEW.ALL,
  )

  return (
    <Context.Provider
      value={{
        tableView,
        setTableView,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const TablesProvider = ({ children }: { children: React.ReactNode }) => {
  return <Content>{children}</Content>
}

export const useTablesContext = () => {
  return useContext(Context)
}
