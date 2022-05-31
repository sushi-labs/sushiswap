import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import Typography from 'app/components/Typography'
import AuctionAdminFormWhitelistSection from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection'
import BannedCountries from 'app/features/miso/AuctionAdminForm/BannedCountries'
import AuctionCard from 'app/features/miso/AuctionCard'
import { Auction } from 'app/features/miso/context/Auction'
import { DocumentInput } from 'app/features/miso/context/hooks/useAuctionDocuments'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import { AuctionCategory, AuctionDocument, AuctionStatus } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import { enumToArray } from 'app/functions/array/enumToArray'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface AuctionAdminFormProps {
  auction: Auction
}

interface IFormInputs extends AuctionDocument {}

const schema = yup.object({
  icon: yup.string().url(),
  description: yup.string().max(300),
  website: yup.string().url(),
  whitepaper: yup.string().url(),
  tokenomics: yup.string().url(),
  github: yup.string().url(),
  telegram: yup.string().url(),
  wechat: yup.string().url(),
  discord: yup.string().url(),
  medium: yup.string().url(),
  reddit: yup.string().url(),
  twitter: yup.string().url(),
  docs: yup.string().url(),
  desktopBanner: yup.string().url(),
  mobileBanner: yup.string().url(),
  bannedCountries: yup.string(),
  bannedWarning: yup.string().max(300),
  category: yup.string(),
})

const AuctionAdminForm: FC<AuctionAdminFormProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const methods = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: auction.auctionDocuments,
  })

  const { watch } = methods
  const [exampleAuction, setExampleAuction] = useState<Auction>(auction)
  const { editDocuments, cancelAuction } = useAuctionEdit(
    auction.auctionInfo.addr,
    auction.launcherInfo?.address,
    auction.template
  )

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    const subscription = watch((data: IFormInputs) => {
      setExampleAuction(
        (prevAuction) =>
          new Auction({
            template: prevAuction.template,
            auctionToken: prevAuction.auctionToken,
            paymentToken: prevAuction.paymentToken,
            auctionInfo: prevAuction.auctionInfo,
            marketInfo: prevAuction.marketInfo,
            auctionDocuments: {
              ...prevAuction.auctionDocuments,
              ...data,
            },
            pointListAddress: prevAuction.pointListAddress,
            status: prevAuction.status,
          })
      )
    })
    // @ts-ignore TYPE NEEDS FIXING
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = useCallback(
    (data: IFormInputs) => {
      const currentDocs = { ...auction.auctionDocuments }
      const newDocs = { ...data }
      const diff = Object.entries(newDocs).reduce<DocumentInput[]>((acc, [k, v]) => {
        // @ts-ignore TYPE NEEDS FIXING
        const _ = currentDocs[k] === undefined ? '' : currentDocs[k]
        // @ts-ignore TYPE NEEDS FIXING
        if (_ !== newDocs[k]) {
          acc.push({ name: k, data: v })
        }

        return acc
      }, [])

      editDocuments(diff)
    },
    [auction.auctionDocuments, editDocuments]
  )

  const socials = [
    {
      key: 'twitter',
      label: i18n._(t`Twitter`),
      placeholder: 'https://twitter.com',
      helperText: i18n._(t`Link to your Twitter profile`),
    },
    {
      key: 'github',
      label: i18n._(t`GitHub`),
      placeholder: 'https://github.com',
      helperText: i18n._(t`Link to your GitHub repository`),
    },
    {
      key: 'telegram',
      label: i18n._(t`Telegram`),
      placeholder: 'https://telegram.com',
      helperText: i18n._(t`Link to your Telegram group chat`),
    },
    {
      key: 'wechat',
      label: i18n._(t`WeChat`),
      placeholder: 'https://wechat.com',
      helperText: i18n._(t`Link to your WeChat group chat`),
    },
    {
      key: 'discord',
      label: i18n._(t`Discord`),
      placeholder: 'https://discord.gg',
      helperText: i18n._(t`Your Discord invite link`),
    },
    {
      key: 'reddit',
      label: i18n._(t`Reddit`),
      placeholder: 'https://reddit.com',
      helperText: i18n._(t`Link to your Reddit board`),
    },
    {
      key: 'medium',
      label: i18n._(t`Medium`),
      placeholder: 'https://medium.com',
      helperText: i18n._(t`Link to your Medium board`),
    },
  ]

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <div className="flex flex-col gap-10">
        <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Form.Card>
            <Form.Section
              header={
                <Form.Section.Header
                  header={i18n._(t`Project Details`)}
                  subheader={i18n._(
                    t`Only the Auction admin and approved operators for this auction are able to edit any of the details below. Do not waste your gas.`
                  )}
                />
              }
            >
              <div className="col-span-3">
                <Form.TextField
                  name="website"
                  label={i18n._(t`Website`)}
                  helperText={i18n._(t`Please note that the URL must use https.`)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-span-3">
                <Form.TextField
                  name="whitepaper"
                  label={i18n._(t`Whitepaper`)}
                  helperText={i18n._(t`Please note that the URL must use https.`)}
                  placeholder="https://example.com/whitepaper.pdf"
                />
              </div>
              <div className="col-span-3">
                <Form.TextField
                  name="tokenomics"
                  label={i18n._(t`Tokenomics`)}
                  helperText={i18n._(t`Please note that the URL must use https.`)}
                  placeholder="https://example.com/tokenomics.pdf"
                />
              </div>
              <div className="col-span-3">
                <Form.SelectField
                  name="category"
                  label={i18n._(t`Category`)}
                  helperText={i18n._(
                    t`Setting a category will increase your project's findability. Please message us if you feel like your project doesn't fit in any of the categories.`
                  )}
                  options={enumToArray(AuctionCategory).map((el) => ({ label: el, value: el }))}
                />
              </div>
              <div className="col-span-3">
                <Form.TextField
                  name="icon"
                  label={i18n._(t`Icon`)}
                  placeholder="https://example.com/icon.png"
                  helperText={i18n._(
                    t`Icon image must be smaller than 250kB, this is to keep page load optimized. Icon dimensions preferably 128x128 or smaller`
                  )}
                />
              </div>
              <div className="col-span-3">
                <Form.TextField
                  name="desktopBanner"
                  label={i18n._(t`Desktop Banner`)}
                  helperText={i18n._(
                    t`Desktop banner must be smaller than 250kB, this is to keep page load optimized. Desktop banner dimensions preferably 1280x196 or a similar ratio`
                  )}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="col-span-3">
                <Form.TextField
                  name="mobileBanner"
                  placeholder="https://example.com/image.jpg"
                  label={i18n._(t`Mobile Banner`)}
                  helperText={i18n._(
                    t`Mobile banner must be smaller than 250kB, this is to keep page load optimized. Desktop banner dimensions preferably 768x360 or a similar ratio`
                  )}
                />
              </div>
              <div className="col-span-3">
                <Form.TextAreaField
                  name="description"
                  label={i18n._(t`Description`)}
                  helperText={
                    methods.getValues('description')
                      ? `${methods.getValues('description').length} / 300 Characters`
                      : i18n._(t`Summary of your project in at most 300 characters`)
                  }
                />
              </div>
            </Form.Section>
            <Form.Section
              className="pt-8"
              header={
                <Form.Section.Header
                  header={i18n._(t`Socials`)}
                  subheader={i18n._(t`Please note that all social links must use https. Each social link will be displayed with their
                corresponding brand icon`)}
                />
              }
            >
              {socials.map((el, index) => (
                <div className="col-span-6" key={index}>
                  <Form.TextField
                    name={el.key}
                    label={el.label}
                    helperText={el.helperText}
                    placeholder={el.placeholder}
                  />
                </div>
              ))}
            </Form.Section>
            <Form.Section className="pt-8" header={<Form.Section.Header header={i18n._(t`Settings`)} />}>
              <div className="col-span-6">
                <BannedCountries />
              </div>
              <div className="col-span-6">
                <Form.TextAreaField
                  rows={6}
                  name="bannedWarning"
                  placeholder={`The content contained in this website does not constitute an offer or sale of securities in or into the United States, or to or for the account or benefit of U.S. persons, or in any other jurisdictions where it is unlawful to do so. Transfer of ${auction.auctionToken.symbol} tokens may be subject to legal restrictions under applicable laws. Under no circumstances shall ${auction.auctionToken.symbol} tokens be reoffered, resold or transferred within the United States or to, or for the account or benefit of, U.S. persons, except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the U.S. Securities Act of 1933, as amended.`}
                  label={i18n._(t`Warning Message`)}
                  helperText={
                    methods.getValues('bannedWarning')
                      ? `${methods.getValues('bannedWarning').length} / 300 Characters`
                      : i18n._(t`Legal warning for your project in at most 300 characters`)
                  }
                />
              </div>
            </Form.Section>
            <Form.Section className="pt-8" header={<Form.Section.Header header={i18n._(t`Danger Zone`)} />}>
              <div className="col-span-6">
                <div
                  className={classNames(
                    auction.status !== AuctionStatus.UPCOMING
                      ? 'border-dark-800'
                      : 'border-red/50 hover:border-red/100',
                    'w-full md:w-1/3 border rounded p-5'
                  )}
                >
                  <div className="col-span-6">
                    <Button
                      onClick={cancelAuction}
                      variant="empty"
                      role="button"
                      color={auction.status !== AuctionStatus.UPCOMING ? 'gray' : 'red'}
                      disabled={auction.status !== AuctionStatus.UPCOMING}
                    >
                      {i18n._(t`Cancel this auction`)}
                    </Button>
                    <p
                      className={classNames(
                        auction.status !== AuctionStatus.UPCOMING ? 'text-low-emphesis' : 'text-red',
                        'mt-2 text-sm '
                      )}
                    >
                      {i18n._(t`Once you cancel an auction, there is no going back. Please be certain.`)}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {auction.status !== AuctionStatus.UPCOMING
                    ? i18n._(t`Auction is past start date`)
                    : i18n._(t`Auction can only be cancelled by the admin before the start date`)}
                </p>
              </div>
            </Form.Section>
            <Form.Submit>
              <div>
                <Button color="blue" type="submit">
                  {i18n._(t`Save`)}
                </Button>
              </div>
            </Form.Submit>
          </Form.Card>
        </Form>

        <Form.Card>
          <AuctionAdminFormWhitelistSection auction={auction} />
        </Form.Card>
      </div>
      <div>
        <div className="flex flex-col gap-1">
          <Typography variant="lg" className="text-high-emphesis" weight={700}>
            {i18n._(t`Example Card`)}
          </Typography>
        </div>
        <div className="mt-3 sticky top-[104px] w-[296px] h-[430px]" role="button">
          <AuctionCard auction={exampleAuction} link={false} />
        </div>
      </div>
    </div>
  )
}

export default AuctionAdminForm
