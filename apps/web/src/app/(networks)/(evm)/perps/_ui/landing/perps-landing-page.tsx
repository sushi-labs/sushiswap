'use client'
import { motion } from 'framer-motion'
import { Ellipses } from './ellipses'
import { LargeSushiIcon } from './large-sushi-icon'
import { SushiBrandLogo } from './sushi-brand-logo'
import { TelegramForm } from './telegram-form'
import { Title } from './title'

export const PerpsLandingPage = () => {
  return (
    <main className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="my-20 px-4 md:px-6 md:my-32 flex items-center flex-col gap-3 md:gap-6"
      >
        <SushiBrandLogo className="w-32 md:w-44 h-12 text-[#2C2C2C] dark:text-white" />
        <Title />
        <p className="max-w-sm md:max-w-xl lg:max-w-[645px] text-center font-medium text-base md:text-lg lg:text-xl">
          Pre-launch access is now open. Enter your Telegram and secure your
          bonus before trading begins.
        </p>
        <div className="mt-2 w-full">
          <TelegramForm />
        </div>
      </motion.div>
      <LargeSushiIcon className="fixed z-[-1] -right-24 -bottom-20 md:-bottom-10 w-[80vw] md:w-[60vw] h-[80vh]" />
      <Ellipses />
    </main>
  )
}
