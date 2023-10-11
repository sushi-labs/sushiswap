import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Terms Of Use',
}

export default async function TermsOfUsePage() {
  return (
    <>
      <div className="flex flex-col justify-center gap-5 py-10">
        <p className="text-5xl font-semibold text-center">
          Sushi Website Terms Of Use
        </p>
        <p className="text-xl text-center text-neutral-400">
          Legal Information & Notices
        </p>
      </div>
      <div className="w-full h-px mx-auto my-3 prose bg-neutral-800" />
      <div className="mx-auto prose prose-dark">
        <p className="leading-6 text-neutral-400">
          Information provided on this Site is for general educational purposes
          only and is not intended to constitute investment or other advice on
          financial products. Such information is not, and should not be read
          as, an offer or recommendation to buy or sell or a solicitation of an
          offer or recommendation to buy or sell any particular digital asset or
          to use any particular investment strategy.
        </p>
        <p className="leading-6 text-neutral-400">
          Sushi makes no representations as to the accuracy, completeness,
          timeliness, suitability, or validity of any information on this Site
          and will not be liable for any errors, omissions, or delays in this
          information or any losses, injuries, or damages arising from its
          display or use. Unless otherwise noted, all images are the property of
          Sushi. Links provided to third-party sites are for informational
          purposes. Such sites are not under the control of Sushi, and Sushi is
          not responsible for the accuracy of the content on such third-party
          sites.
        </p>
      </div>
    </>
  )
}
