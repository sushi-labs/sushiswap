import React from 'react'

import { Overview } from './components'

export default function GovernanceDashboard() {
  /* @ts-expect-error Async Server Component */
  return <Overview />

  // return (
  //   <TabGroup>
  //     <Hero />
  //     <Container maxWidth="6xl" className="mx-auto py-14 px-4">
  //       <TabPanels>
  //         <TabPanel>

  //           <Overview />
  //         </TabPanel>
  //         <TabPanel>
  //           <Finance />
  //         </TabPanel>
  //         <TabPanel>
  //           <Governance />
  //         </TabPanel>
  //         <TabPanel>
  //           <TokenHolders />
  //         </TabPanel>
  //       </TabPanels>
  //     </Container>
  //   </TabGroup>
  // )
}
