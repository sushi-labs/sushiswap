import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import Form from 'app/components/Form'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useWatch } from 'react-hook-form'

interface TokenCreationFormGeneralDetailsProps {}

const TokenCreationFormGeneralDetails: FC<TokenCreationFormGeneralDetailsProps> = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const tokenTypeAddress = useWatch({ name: 'tokenTypeAddress' })

  return (
    <Form.Section header={<Form.Section.Header header={i18n._(t`Token Details`)} />} className="pt-8">
      <div className="col-span-6">
        <Form.TextField
          name="tokenName"
          label={i18n._(t`Name*`)}
          helperText={i18n._(t`This will be the name of your token. Choose wisely, this is final and immutable.`)}
          placeholder="The name of your token"
        />
      </div>
      <div className="col-span-6">
        <Form.TextField
          name="tokenSymbol"
          label={i18n._(t`Symbol*`)}
          helperText={i18n._(t`This will be the symbol of your token. Choose wisely, this is final and immutable.`)}
          placeholder="The symbol of your token"
        />
      </div>
      <div className="col-span-6">
        <Form.TextField
          name="tokenSupply"
          label={i18n._(t`Initial Supply*`)}
          helperText={
            tokenTypeAddress ===
            // @ts-ignore TYPE NEEDS FIXING
            (chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.FixedToken.address : undefined)
              ? i18n._(
                  t`This will be the initial supply of your token. Because your token type is set to fixed. This value will be final and immutable`
                )
              : i18n._(t`This will be the initial supply of your token.`)
          }
          placeholder="The name of your token"
        />
      </div>
    </Form.Section>
  )
}

export default TokenCreationFormGeneralDetails
