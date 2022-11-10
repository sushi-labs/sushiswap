import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, classNames, Typography } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import { FC } from 'react'

import { CardInterface } from '../data'

export const Item: FC<{ id: string; onSelect(id?: string): void; data: CardInterface[] }> = ({
  id,
  onSelect,
  data,
}) => {
  const { category, title, backgroundColor, icon: Icon, textColor } = data.find((item) => item.id === id)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, delay: 0.15 }}
        style={{ pointerEvents: 'auto' }}
        className="z-[2000] fixed bg-[rgba(0,0,0,0.6)] will-change-[opacity] inset-0 w-full"
        onClick={() => onSelect()}
      >
        {/*<Link to="/" />*/}
      </motion.div>
      <article className="w-full h-full pointer-events-none top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed z-[2001] overflow-hidden px-[40px] py-0 flex items-center justify-center">
        <motion.div
          layoutId={`card-container-${id}`}
          className={classNames(
            'h-[auto] max-w-[700px] overflow-hidden pointer-events-none relative rounded-[20px] overflow-hidden w-full h-full m-[0_auto] bg-slate-900'
          )}
        >
          <motion.div
            className="absolute z-10 flex items-center right-10 top-5"
            layoutId={`title-container-icon-${id}`}
          >
            <Icon width={180} height={180} className="opacity-20" />
          </motion.div>
          <motion.div
            className={classNames('absolute top-0 left-0 overflow-hidden h-[240px] w-[100vw] z-[1]', backgroundColor)}
            layoutId={`card-image-container-${id}`}
          />
          <motion.div
            className="z-[1] absolute top-[30px] left-[30px] max-w-[300px] flex flex-col gap-2 m-3 rounded-[20px]"
            layoutId={`title-container-${id}`}
          >
            <Typography weight={500} className={classNames(textColor, 'uppercase')}>
              {category}
            </Typography>
            <Typography weight={600} variant="h3" className={classNames(textColor)}>
              {title}
            </Typography>
          </motion.div>
          <motion.div
            className="p-[280px_35px_35px_35px] max-w-[700px] w-[90vw] prose !prose-invert prose-slate"
            animate
          >
            <h3>What is the BentoBox?</h3>
            <p>
              The BentoBox (sometimes referred to as Bento) is a token vault that generates yield for the capital
              deposited into it. While there are many such yield generating “vaults” in DeFi, the BentoBox is a little
              different. Bento’s innovation is its ability to track the user’s deposits via artificial balance, which is
              used to account for their idle funds, while the same funds are simultaneously applied to strategies.
            </p>
            <p>
              The BentoBox creates yield for these funds without incurring any loss. The vault uses low-risk farming
              strategies, like depositing tokens on Compound for lending yield, or serving up $SUSHI on the SushiBar to
              earn more $SUSHI. The funds in Bento can also be used in flash loans, which can add more passive value to
              the user’s underutilized capital. The BentoBox will be the foundation for all of Sushi's financial
              instruments; therefore, the user can always put their tokens to use while they make moves on Sushi's many
              different DeFi offerings.
            </p>
            <Button className="!p-0" variant="empty" endIcon={<ChevronRightIcon width={16} height={16} />}>
              View More
            </Button>
          </motion.div>
        </motion.div>
      </article>
    </>
  )
}
