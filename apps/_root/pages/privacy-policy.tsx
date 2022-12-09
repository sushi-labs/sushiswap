import { Typography } from '@sushiswap/ui'
import React from 'react'

import { Layout } from '../components'

const PrivacyPolicy = () => {
  return (
    <Layout maxWidth="7xl">
      <div className="flex flex-col justify-center gap-5 py-10">
        <Typography variant="hero" weight={700} className="text-center">
          Privacy Policy
        </Typography>
      </div>
      <div className="prose mx-auto h-px bg-neutral-800 w-full my-3" />
      <div className="text-neutral-200 leading-6 prose prose-dark mx-auto">
        <p>
          [insert Sushi Project] is a [insert description] (“Protocol”) that is designed to enable users to [insert
          description]. The Protocol does not process payments, and the Protocol does not provide access to any digital
          assets or funds. <b>Your use of the Protocol is entirely at your own risk.</b>
        </p>
        <p>
          <b>
            You assume all risks associated with using the Protocol, and digital assets and decentralized systems
            generally, including but not limited to, that: (a) digital assets are highly volatile; (b) using digital
            assets is inherently risky due to both features of such assets and the potential unauthorized acts of third
            parties; (c) you may not have ready access to assets; and (d) you may lose some or all of your tokens or
            other assets. You agree that you will have no recourse against anyone else for any losses due to the use of
            the Protocol. For example, these losses may arise from or relate to: (i) incorrect information; (ii)
            software or network failures; (iii) corrupted cryptocurrency wallet files; (iv) unauthorized access; (v)
            errors, mistakes, or inaccuracies; or (vi) third-party activities.
          </b>
        </p>
        <p>
          The Protocol does not collect any personal data, and your interaction with the Protocol will solely be through
          your public digital wallet address. Any personal or other data that you may make available in connection with
          the Protocol may not be private or secure
        </p>
      </div>
    </Layout>
  )
}

export default PrivacyPolicy
