import { RadioGroup } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import { BlocksIcon, MintableTokenIcon, SushiTokenIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import { TokenType } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface TokenCreationFormTypeSelectorProps {}

const TokenCreationFormTypeSelector: FC<TokenCreationFormTypeSelectorProps> = () => {
  const { watch, setValue } = useFormContext()
  const tokenTypeAddress = watch('tokenTypeAddress')
  const { i18n } = useLingui()
  const { map: tokenTemplateMap, templateIdToLabel } = useTokenTemplateMap()

  const items = [
    {
      icon: <BlocksIcon height={83} width={83} />,
      address: tokenTemplateMap?.[TokenType.FIXED],
      value: TokenType.FIXED,
      label: templateIdToLabel(TokenType.FIXED),
      description: i18n._(
        t`A "standard" ERC20 token with a fixed supply and protections against further token minting or burning.`
      ),
    },
    {
      icon: <MintableTokenIcon height={83} width={83} />,
      address: tokenTemplateMap?.[TokenType.MINTABLE],
      value: TokenType.MINTABLE,
      label: templateIdToLabel(TokenType.MINTABLE),
      description: i18n._(
        t`An ERC20 token with a function allowing further minting at a later date. Creators will have to assign an owner for the minting controls.`
      ),
    },
    {
      icon: <SushiTokenIcon height={83} width={83} />,
      address: tokenTemplateMap?.[TokenType.SUSHI],
      value: TokenType.SUSHI,
      label: templateIdToLabel(TokenType.SUSHI),
      description: i18n._(
        t`Sushi tokens function similar to mintable tokens but with additional capabilities built into the token. Creators will have to assign an owner address for token functions during minting.`
      ),
    },
  ]

  return (
    <Form.Section
      columns={6}
      header={
        <Form.Section.Header header={i18n._(t`Select Token Type`)} subheader={i18n._(t`Decide on the type of token`)} />
      }
    >
      <div className="col-span-6">
        <RadioGroup
          value={tokenTypeAddress}
          onChange={(tokenTypeAddress) => setValue('tokenTypeAddress', tokenTypeAddress)}
          className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10"
        >
          <input className="hidden" name="tokenTypeAddress" value={tokenTypeAddress} onChange={() => {}} />
          {items.map(({ icon, value, address, label, description }) => (
            <RadioGroup.Option value={address} key={value}>
              {({ checked }) => (
                <div
                  className={classNames(
                    checked ? 'bg-dark-1000/40' : 'bg-dark-900',
                    'flex flex-col gap-4 border border-dark-800 p-5 rounded h-full cursor-pointer'
                  )}
                >
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    {label}
                  </Typography>
                  {icon}
                  <Typography className="text-high-emphesis">{description}</Typography>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
    </Form.Section>
  )
}

export default TokenCreationFormTypeSelector
