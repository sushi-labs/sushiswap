import * as React from 'react'
import { CSSProperties } from 'react'

const defaultConfig = {
  styles: {
    root: undefined,
    header: undefined,
    footer: undefined,
  },
  classes: {
    root: 'flex flex-col max-w-sm mx-auto p-0.5 bg-slate-700 rounded-xl relative shadow-md shadow-slate-900',
    header: '',
    footer: '',
  },
}

export interface Config {
  styles: {
    root: CSSProperties | undefined
    header: CSSProperties | undefined
    footer: CSSProperties | undefined
  }
  classes: {
    root: string
    header: string
    footer: string
  }
}

export interface Props {
  config?: Config
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}

export function Widget({ header, footer, children, config = defaultConfig }: Props) {
  return (
    <div id="sushiswap-widget" className={config.classes.root} style={config.styles.root}>
      <header className={config.classes.header} style={config.styles.header}>
        {header}
      </header>
      {children}
      <footer className={config.classes.footer} style={config.styles.footer}>
        {footer}
      </footer>
    </div>
  )
}

Widget.displayName = 'Widget'
