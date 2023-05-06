import React from 'react'

import {
  Container,
  Finance,
  Governance,
  Hero,
  Overview,
  TabGroup,
  TabPanel,
  TabPanels,
  TokenHolders,
} from './components'

export default function GovernanceDashboard() {
  return (
    <TabGroup>
      <Hero />
      <Container maxWidth="6xl" className="mx-auto py-14 px-4">
        <TabPanels>
          <TabPanel>
            <Overview />
          </TabPanel>
          <TabPanel>
            <Finance />
          </TabPanel>
          <TabPanel>
            <Governance />
          </TabPanel>
          <TabPanel>
            <TokenHolders />
          </TabPanel>
        </TabPanels>
      </Container>
    </TabGroup>
  )
}
