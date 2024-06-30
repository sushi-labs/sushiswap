import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui';
import React, { useState } from 'react';
import { PortfolioWallet } from './WalletTable/PortfolioWallet';
  
        

const ITEMS: { id: string; value: string; children: React.ReactNode }[] = [
    {
      id: 'wallet',
      value: 'wallet',
      children: (
        <div className="flex items-center gap-2">
          <span>
            Wallet
          </span>
        </div>
      ),
    },
    {
      id: 'positions',
      value: 'Positions',
      children: (
        <div className="flex items-center gap-2">
          <span>
            Positions
          </span>
        </div>
      ),
    },
    {
      id: 'activity',
      value: 'Activity',
      children: (
        <div className="flex items-center gap-2">
          <span>Activity</span>
        </div>
      ),
    },
  ]
  
  export const PortfolioTab = () => {
    const [tab, setTab] = useState('v3')
  
    return (
      <div className="flex flex-col gap-4">
        <Tabs value={tab} onValueChange={setTab} defaultValue="wallet">
          <div className="flex justify-between mb-4">
            <div className="block sm:hidden">
              <Select value={tab} onValueChange={setTab}>
                <SelectTrigger>
                  <SelectValue placeholder="Portfolio list" />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.children}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsList className="hidden sm:inline-flex">
              {ITEMS.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  testdata-id={item.id}
                >
                  {item.children}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="wallet">
            <PortfolioWallet/>

          </TabsContent>
          <TabsContent value="positions">
          </TabsContent>
          <TabsContent value="activity">
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  