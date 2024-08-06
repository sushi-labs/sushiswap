import { Container, Separator } from '@sushiswap/ui'
import React from 'react'

type NumberedListBlock = {
  title: string
  index: number
  paragraphs: string[]
  type: 'numbered-list'
}

type Block = NumberedListBlock

const text = [
  {
    title: 'Article 1: Acceptance of Terms',
    index: 1,
    paragraphs: [
      <span key="1.1">
        {`The following Terms of Service ("Terms"), including any documents, policies, and guidelines incorporated herein by reference, collectively govern the access to and use of the "Interface" provided by `}
        <b>Sushi Labs</b>
        {` (hereinafter referred to as "`}
        <b>Sushi</b>
        {`," "we," "us," or "our") by any individual, entity, group, x or association (hereinafter referred to as "User," "you," or "your").`}
      </span>,
      `By accessing, browsing, or otherwise using the Interface, or by acknowledging acceptance of these Terms through the Interface, you affirm that you have read, understood, and consent to be bound by these Terms, including, but not limited to, our Privacy Policy and any Disclosures referenced herein, along with any limitations, waivers, and restrictions applicable to any claims you may assert, which may limit your rights.`,
      `Your use or access to the Interface constitutes acceptance of a binding arbitration agreement, waiver of the right to participate in a class action, and any other clauses contained within. Some of which significantly affect your rights to resolve disputes.`,
      `Sushi reserves the right to modify, amend, or revise these Terms without prior notice or consent. Following such changes, continued access or use of the Interface constitutes acceptance of the revised Terms. If you disagree with the revised Terms, you must cease using the Interface. You should review the terms each time you access the Website. `,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 2: Definition of Interface',
    index: 2,
    paragraphs: [
      `For these Terms, "Interface" refers to any platform, software, feature, or functionality developed, administered, or contributed to by Sushi, including but not limited to Sushi Swap, and encompasses the services described herein.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 3: Dispute Resolution; Arbitration Agreement',
    index: 3,
    paragraphs: [
      <span key="3.1">
        {`Any dispute or claim arising out of or related to the Interface or use
        thereof (including these terms) shall be subject to an informal
        negotiation process initiated by email to `}
        <a
          href="mailto:tos@sushiswap.com"
          className="text-blue hover:text-blue-600"
        >
          tos@sushiswap.com
        </a>
        {`. Upon
        receipt of a complaint, Sushi shall have sixty (60) days to respond.
        Only after a response, if no resolution is achieved, may you file an
        Arbitration Claim with the London International Court of Arbitration.
        Your time to file such a claim is 30 (thirty) days from the response
        from Sushi. ANY AND ALL CLAIMS SHALL BE SUBJECT TO ARBITRATION, WHICH
        HEREIN, INCORPORATED FOR REFERENCE AND BINDING ON THE PARTIES. BOTH
        PARTIES AGREE TO BE BOUND BY THE DECISION OF ARBITRATION. Any disputes
        shall be conclusively resolved by arbitration under the London Court of
        International Arbitration (LCIA) Rules in force at the time, one single
        arbitrator shall be appointed, the initiating party shall pay all fees,
        and processes shall be conducted in English and confidentially. This
        clause survives the termination of these Terms.`}
      </span>,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 4: Disputes and Waivers',
    index: 4,
    paragraphs: [
      `You waive the right to bring disputes as a plaintiff or class member in any class or representative action and waive any right to a jury trial. This waiver applies globally, irrespective of the laws of any country.`,
      `YOU HEREBY WAIVE ANY RIGHT TO BE PART OF A JURY TRIAL AND ANY RIGHT TO TAKE PART IN, ORCHESTRATE, OR OTHERWISE ENGAGE IN ANY CLASS ACTION OR GROUP LAWSUIT.`,
      `You and Sushi agree that any losses you sustain shall be limited to a maximum claim of $10,000 - TEN THOUSAND US DOLLARS.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 5: Governing Law',
    index: 5,
    paragraphs: [
      `These Terms and any disputes arising under or related thereto shall be governed by the laws of the Republic of Seychelles, disregarding conflict of law principles.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 6: The Interface',
    index: 6,
    paragraphs: [
      `The Interface is a conduit for aggregating and publishing information on digital asset swapping, staking, and bonding technologies. It facilitates interactions for intended transactions without providing financial services or advice.`,
      `Sushi does not provide financial services, financial advice, tax services, or any other services or advice linked to any financial instrument. In using the interface, you warrant and undertake that you have the requisite knowledge and understanding of Blockchain Technology.`,
      `The Interface is provided on an ‘as is’ basis with no guarantees of performance, success, or any certification that functions will work 100% of the time. You use the Interface at your own risk.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 7: Access and Use',
    index: 7,
    paragraphs: [
      `By using the Interface, you represent that you are of legal age, possess the necessary technical knowledge, comply with all applicable laws, are not located in restricted territories, and do not intend to use the Interface for illegal activities or transactions prohibited by law.`,
      `If using the Interface is illegal or contrary to the laws of the country where you are based or a citizen, you should NOT use it.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 8: Prohibited and Acceptable Uses',
    index: 8,
    paragraphs: [
      `Users must not misuse the Interface in ways that are illegal, fraudulent, or harmful to others. Acceptable uses of the Interface are limited to informational purposes for those with the requisite technical sophistication.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 9: Risks and Limitations',
    index: 9,
    paragraphs: [
      `Users acknowledge and accept the inherent risks associated with using the Interface, including the lack of a business model for Sushi, the volatility and legal uncertainties of blockchain technology and digital assets, and the absence of any warranties or guarantees regarding the Interface or the Middleware.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 10: Waiver and Indemnification',
    index: 10,
    paragraphs: [
      `Users agree to indemnify and hold harmless Sushi and its affiliates from any claims, damages, or expenses arising from their use of the Interface, violation of these Terms, or infringement of any third-party rights.`,
      `Users waive any claims and agree to hold harmless Sushi, including any director, shareholder, member, consultant, accountant, lawyer, agent, or any party acting on behalf of Sushi, for any losses actual or anticipated, including those losses known or unknown at the time the User used the interface.`,
      `The user waives any right to claim alter-ego status within the United States of America. The User does not believe that, when using the interface, they are working with or engaging with any US-based firm or person.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Article 11: Miscellaneous',
    index: 11,
    paragraphs: [
      `These Terms, including the Privacy Policy and any disclosures incorporated by reference, constitute the entire agreement between you and Sushi regarding the Interface and supersede all prior agreements and understandings, whether written or oral, related to the subject matter.`,
      `These terms and any dispute shall be governed by the laws of the Republic of Seychelles, with the courts of England and Wales having exclusive jurisdiction over the relationship and any disputes arising therefrom.`,
      `The User may not assign these Terms at any time. Sushi may assign these terms to any new or other entity undertaking work on its behalf and assuming responsibility for the interface.`,
    ],
    type: 'numbered-list',
  },
] as Block[]

function numberedBlock(block: NumberedListBlock, index: number) {
  return (
    <div key={block.title}>
      <h2 className="text-lg font-semibold">{block.title}</h2>
      <div className="ml-8 mt-4 space-y-4">
        {block.paragraphs.map((paragraph, i) => {
          return (
            <div className="flex flex-row gap-4 text-sm" key={`${index}.${i}`}>
              <span>
                {index + 1}.{i + 1}
              </span>
              <p className="text-justify">{paragraph}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function contentBlock(block: (typeof text)[number], index: number) {
  switch (block.type) {
    case 'numbered-list':
      return numberedBlock(block, index)
  }
}

export default function Page() {
  return (
    <Container maxWidth="4xl" className="px-6 mt-20 pb-40 space-y-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-semibold">
          Sushi Labs - Terms of Service
        </h1>
        <p className="text-sm text-neutral-800 dark:text-neutral-400">
          Last modified: March 26, 2024
        </p>
      </div>
      <Separator />
      <div className="w-full space-y-8">
        {text.map((block, i) => contentBlock(block, i))}
      </div>
    </Container>
  )
}
