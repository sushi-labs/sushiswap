import { Container, LinkExternal, Separator, classNames } from '@sushiswap/ui'
import React from 'react'

// I know this thing is overengineered, but...

type TextBlock = {
  title: string | undefined
  paragraphs: { title: string | undefined; paragraphs: string[] }[]
  type: 'text'
}

type NumberedListBlock = {
  title: string
  index: number
  paragraphs: string[]
  type: 'numbered-list'
}

type Block = TextBlock | NumberedListBlock

const text = [
  {
    title: '',
    paragraphs: [
      {
        paragraphs: [
          `This privacy policy applies to this website and any services provided in the ordinary course of business. Our website is https://www.sushi.com (“The Website”) and is owned and operated by Sushi Labs (“The Company”). This policy governs the privacy of users who choose to use our website or engage with any of our services, both with and without consideration (“Users”).`,
          `The policy sets out the different areas where user privacy is concerned and outlines the obligations and requirements of the users, the website, and The Company. Furthermore, this policy details how this website and company process, store, and protect user data and information.`,
        ],
      },
    ],
    type: 'text',
  },
  {
    title: '1. The Website',
    index: 1,
    paragraphs: [
      `This website and its owners take a proactive approach to user privacy and ensure the necessary steps are taken to protect the privacy of its users throughout their visiting experience.`,
      `The website and all company data are hosted, stored, and maintained within the European Union to avoid doubt. As such, European Union law applies to the storage of Data.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '2. Use of Cookies',
    index: 2,
    paragraphs: [
      `This website uses cookies to improve the user's experience. Where applicable, this website uses a cookie control system that allows the user to allow or disallow cookies on their computer or device on their first visit. This complies with recent legislation requiring websites to obtain explicit user consent before leaving behind or reading files such as cookies on a user's computer or device.`,
      `Cookies are small files saved to the user's computer's hard drive that track, save, and store information about the user's interactions and website usage. This allows the website, through its server, to provide the users with a tailored experience within this website.`,
      `Users are advised that if they wish to deny the use and saving of cookies from this website onto their computer's hard drive, they should take necessary steps within their web browser's security settings to block all cookies from this website and its external serving vendors.`,
      <span key="2.4">
        {`This website uses tracking software to monitor its visitors to
        understand better how they use it. Google Analytics provides this
        software, which uses cookies to track visitor usage. The software will
        save a cookie to your computer's hard drive to track and monitor your
        engagement and usage of the website but will not store, save, or collect
        personal information. You can read Google's privacy policy here for
        further information: `}
        <LinkExternal href="http://www.google.com/privacy.html">
          http://www.google.com/privacy.html
        </LinkExternal>
      </span>,
      `Other cookies may be stored on your computer's hard drive by external vendors when this website uses referral programs, sponsored links, or adverts. Such cookies are used for conversion and referral tracking and typically expire after 30 days, though some may take longer. No personal information is stored, saved, or collected.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '3. Contact & Communication',
    index: 3,
    paragraphs: [
      `Users contacting this website and The Company do so at their discretion and provide any personal details requested at their own risk. Your personal information is kept private and securely stored until it is no longer required or has no use, as detailed in the Data Protection Laws. Every effort has been made to ensure a safe and secure form-to-email submission process, but users should be advised that they use such form-to-email processes at their own risk.`,
      `This website and its owners use any information submitted to provide further information about the products/services they offer or to assist you in answering any questions or queries you may have submitted.`,
      `This includes using your details to subscribe to any email newsletter program the website operates, but only if this was made clear to you and your express permission was granted when submitting any form to the email process. Or whereby you, the consumer, have previously purchased from or inquired about purchasing a product or service from the company that the email newsletter relates to. This is not an entire list of your user rights regarding receiving email marketing material. Your details are not passed on to any third parties.`,
      `By sending your personal information to the company or the website, you grant consent to contact by the company, subject to the above conditions. Any data the company holds relating to individuals will be stored and destroyed once no communication has occurred between the user and the company for 12 months.`,
      `The company will never knowingly or willingly pass information it holds on Users (for clarity, this includes clients, prospects, or website users) onto a third party without the user's consent.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '4. Email',
    index: 4,
    paragraphs: [
      `From time to time, The Company operates various email campaigns (at all times, we refer to these as a Newsletter Program) to inform subscribers about products and services supplied by this website. Users can subscribe through an online automated process should they wish to do so, but they do so at their discretion. Some subscriptions may be manually processed through a prior written agreement with the user.`,
      `Subscriptions are taken in compliance with  Spam Laws detailed in the Privacy and Electronic Communications Regulations 2003. All personal details relating to subscriptions are held securely per the Data Protection Laws. No personal details are passed on to third parties nor shared with companies/people outside of the company that operates this website. Under the Data Protection Laws, you may request a copy of personal information about you through this website's email newsletter program. A small fee will be payable. If you would like a copy of the information held on you, please write to the business address at the bottom of this policy.`,
      `Email marketing campaigns published by this website or its owners may contain tracking facilities within the email. Subscriber activity is tracked and stored in a database for future analysis and evaluation. Such tracked activity may include the opening of emails, forwarding of emails, clicking links within the email content, times, dates, and frequency of activity [this is by no far a comprehensive list].`,
      `This information is used to refine future email campaigns and supply users with more relevant content based on their activity.`,
      `In compliance with EU Spam Laws, the Privacy and Electronic Communications Regulations 2003, and GDPR, subscribers can unsubscribe anytime through an automated system. This process is detailed at the footer of each email campaign. If an automated unsubscription system is unavailable, clear instructions on unsubscribing will be detailed instead.`,
      `Our email campaigns are always run through third-party providers such as Mailchimp. Users are advised to refer to these third-party companies' specific terms and conditions. Users can easily remove themselves from any email communication by “unsubscribing.”`,
      `The Company holds no liability for any damages or losses associated with using any third-party email service provider. In engaging with the company or continuing use of the website, you hereby expressly accept that the Company holds no such liability.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '5. External Links',
    index: 5,
    paragraphs: [
      `While every effort has been made to include quality, safe, and relevant external links within this website, users are advised to exercise caution before clicking any external links mentioned throughout this website (external links are clickable text/banner/image links to other websites).`,
      `Despite their best efforts, the owners of this website and the company cannot guarantee or verify the contents of any externally linked website. Users should, therefore, note that they click on external links at their own risk, and this website and its owners cannot be held liable for any damages or implications caused by visiting any external links mentioned.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '6. Adverts and Sponsored Links',
    index: 6,
    paragraphs: [
      `This website may contain sponsored links and adverts. These will typically be served through our advertising partners, who may have detailed privacy policies relating directly to the adverts they serve.`,
      `Clicking on any such adverts will send you to the advertiser's website through a referral program, which may use cookies to track the number of referrals sent from this website. This may include the use of cookies, which may, in turn, be saved on your computer's hard drive. Users should note that they click on sponsored external links at their own risk. This website and its owners cannot be held liable for any damages or implications caused by visiting any external links mentioned.`,
      `Despite their best efforts, the owners of this website and the company cannot guarantee or verify the contents of any externally linked website. Users should, therefore, note that they click on external links at their own risk, and this website and its owners cannot be held liable for any damages or implications caused by visiting any external links mentioned.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '7. Social Media Platforms',
    index: 7,
    paragraphs: [
      `Communication, engagement, and actions taken through external social media platforms that this website, the company, and its owners participate in are custom to the terms and conditions and privacy policies held with each social media platform.`,
      `Users are advised to use social media platforms wisely and communicate/engage with them with due care and caution regarding their privacy and personal details. Neither this website nor its owners will ever ask for personal or sensitive information through social media platforms, and users wishing to discuss sensitive details should be encouraged to contact them through primary communication channels such as telephone or email.`,
      `This website may use social sharing buttons that help share content directly from web pages to the social media platform. Before using such social sharing buttons, users are advised to do so at their discretion and note that the social media platform may track and save your request to share a web page through your social media platform account.`,
      `The Company holds responsibility for all comments, posts, or any other action taken on social media belonging to the company. Social media can easily be identified as belonging to the company by the account's name on the relevant social media platform. All comments and actions made on social media are not intended to cause offense or serve as a defamatory action. Every posting will be checked for accuracy.`,
      `If you believe your intellectual property rights, personal rights, or any other rights have been infringed by any action on social media, you must notify the company as soon as possible so that the company can rectify and remove the post.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '8. Shortened Links in Social Media',
    index: 8,
    paragraphs: [
      `This website and its owners may share links to relevant web pages through their social media platform accounts. Some social media platforms shorten lengthy domains and URLs to third-party pages by default.`,
      `Users are advised to exercise caution and good judgment before clicking any shortened URLs published by this website and its owners on social media platforms. Despite the best efforts to ensure only genuine URLs are published, many social media platforms are prone to spam and hacking. Therefore, this website and its owners cannot be held liable for any damages or implications caused by visiting shortened links.`,
    ],
    type: 'numbered-list',
  },
  {
    title: '9. Governing Law and Jurisdiction',
    index: 9,
    paragraphs: [
      `This privacy policy and all items posted on behalf of the company are strictly subject to the laws of the United Kingdom (England and Wales). Any disagreement arising from the use of personal information shall be resolved through the Courts of England and Wales.`,
      `The User expressly agrees that by using the company's website or engaging in social media, they are accepting the terms of this privacy policy.`,
      `Any disagreement and all notices are to be delivered to the company registered office.`,
      `If any part of this policy is found to be defective, the remaining elements of the policy shall remain in place.`,
      `The Company's registered office and address for service can be found on the website.`,
    ],
    type: 'numbered-list',
  },
  {
    title: 'Special GDPR Notice',
    paragraphs: [
      {
        paragraphs: [
          'Under the GDPR, which came into force in 2018, citizens of the European Union have the right to track their data. By using the company website, you hereby agree to the following terms and consent for such data to be stored as contained per this GDPR notice.',
        ],
      },
      {
        title: 'Data Control Officer',
        paragraphs: [
          'The data control officer is based at the company headquarters, which can be found in our Terms and Conditions document. You can reach the Data controller by emailing the company at contact@sushi.com, located on the company website, or using the methods contained within the company website to contact us.',
          `The company does not collect personal information or store any information about you. Communications are held and retained on third-party servers for reference purposes. The company will never email you marketing communications.`,
        ],
      },
      {
        title: 'Purpose of the processing',
        paragraphs: [
          `The information is collected in the interest of Know Your Client and Anti Money Laundering regulations. The company is allowing individuals to participate in a crowdfunding exercise. Some jurisdictions do not allow citizens and residents to participate in such activities. We, therefore, are required to collect basic information on those who participate to demonstrate, when necessary, that citizens and residents of that jurisdiction did not participate in the crowdfunding. The legal basis for this processing of data is found in international law (different laws from different countries), including but not limited to The UK Financial Services Act, The US Securities Legislation, European Monetary statutes and regulations (including those of its member states), Chinese Financial Code, anti-money laundering laws, and antiterrorism laws.`,
        ],
      },
      {
        title: `Third Parties`,
        paragraphs: [
          `Data may occasionally be shared with third parties to conduct a Know Your Client assessment so that participants can prove their location, residence, and citizenship. All parties accessing your data will be members of the necessary data-controlling bodies of their respective countries, such as the Information Commissioners Office of the United Kingdom.`,
        ],
      },
      {
        title: `Recipients of the Data`,
        paragraphs: [
          `Gresham International’s compliance team will always have access to the data. The Information Commissioner Office regulates them and will not share that data with any third party.`,
        ],
      },
      {
        title: `Safeguards`,
        paragraphs: [
          `Your data will never be shared with any third party without your consent or court order provided by a court of competent jurisdiction within the country making the request.`,
        ],
      },
      {
        title: `Retention Period`,
        paragraphs: [
          `All data will be stored for at least six months and a maximum of two years.`,
        ],
      },
      {
        title: `The Existence of Your Rights`,
        paragraphs: [
          `Nothing within this agreement or the company’s process impacts your rights under the GDPR.`,
        ],
      },
      {
        title: `The right to withdraw consent`,
        paragraphs: [
          `You may request the right to know the company's information about you. This request can only be made once, as data is only captured once during registration and participation. We must keep all information relating to you as anti-money laundering and antiterrorism laws require.`,
        ],
      },
      {
        title: `The right to lodge a complaint`,
        paragraphs: [
          `Citizens of the EU may file a complaint with the relevant data controller within their country. Complaints should first be made to the company so that we can investigate any issues relating to the storage or use of your data.`,
        ],
      },
      {
        title: `Source of Data`,
        paragraphs: [
          `All data collected on you will be done so by your submission of the information and collection of information from the machine you access the website with. Data collection is limited to what is contained in our registration method, and the information your computer automatically transmits to our company when accessing our site, such as cookies and IP data, is limited to that contained in our registration method.`,
        ],
      },
    ],
    type: 'text',
  },
] as Block[]

function numberedBlock(block: NumberedListBlock) {
  return (
    <div key={block.title}>
      <h2 className="text-lg font-semibold">{block.title}</h2>
      <div className="ml-6 mt-4 space-y-4">
        {block.paragraphs.map((paragraph, i) => {
          return (
            <div
              className="flex flex-row gap-4 text-sm"
              key={`${block.index}.${i}`}
            >
              <span>
                {block.index}.{i + 1}
              </span>
              <p className="text-justify">{paragraph}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function textBlock(block: TextBlock) {
  const subtitle = (title: string | undefined) => {
    if (title) {
      return <h3 className="font-semibold text-base">{title}</h3>
    }
  }

  return (
    <div key={block.title}>
      <h2 className="text-lg font-semibold">{block.title}</h2>
      <div className={classNames('mt-4 space-y-4', block.title && 'ml-6')}>
        {block.paragraphs.map((paragraph) => {
          return (
            <div className="flex flex-col" key={paragraph.title}>
              {subtitle(paragraph.title)}
              <span className="text-justify text-sm space-y-2">
                {paragraph.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function contentBlock(block: (typeof text)[number]) {
  switch (block.type) {
    case 'text':
      return textBlock(block)
    case 'numbered-list':
      return numberedBlock(block)
  }
}

export default function Page() {
  return (
    <Container maxWidth="4xl" className="px-4 mt-20 pb-40 space-y-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-semibold">Sushi Labs - Privacy Policy</h1>
        <p className="text-sm text-neutral-800 dark:text-neutral-400">
          Last modified: March 26, 2024
        </p>
      </div>
      <Separator />
      <div className="w-full space-y-8">
        {text.map((block) => contentBlock(block))}
      </div>
    </Container>
  )
}
