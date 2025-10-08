'use client'

import { type ThemeOptions, darkTheme, lightTheme } from '@funkit/connect'

const ACTION_COLOR = '#6C4BFF'
const ACTION_COLOR_FOREGROUND = '#FFFFFF'
const BUTTON_BACKGROUND = '#4217FF'
const BUTTON_BACKGROUND_HOVER = '#5B36FF'
const BUTTON_BACKGROUND_DISABLED = 'rgba(66, 23, 255, 0.5)'

const dark = {
  PRIMARY_TEXT: '#FFFFFF',
  SECONDARY_TEXT: '#E4DDEC',
  OFF_BACKGROUND: '#2C2B45',
}

const light = {
  PRIMARY_TEXT: '#000000',
  SECONDARY_TEXT: '#535263',
  OFF_BACKGROUND: '#F3F2F4',
}

const darkColors: ThemeOptions['customColors'] = {
  actionColorDisabled: 'rgba(108,75,255,0.65)',
  buttonBackground: BUTTON_BACKGROUND,
  buttonBackgroundPressed: BUTTON_BACKGROUND_HOVER,
  buttonBackgroundHover: BUTTON_BACKGROUND_HOVER,
  buttonBackgroundDisabled: BUTTON_BACKGROUND_DISABLED,
  buttonBackgroundTertiary: dark.OFF_BACKGROUND,
  buttonIconBackgroundHover: dark.OFF_BACKGROUND,
  focusedOptionBorder: ACTION_COLOR,

  buttonTextPrimary: dark.PRIMARY_TEXT,
  buttonTextDisabled: 'rgba(255, 255, 255, 0.5)',
  buttonTextSecondary: dark.PRIMARY_TEXT,
  primaryText: dark.PRIMARY_TEXT,
  secondaryText: dark.SECONDARY_TEXT,
  tertiaryText: 'rgba(255,255,255,0.35)',
  lightStroke: '#31314A',
  mediumStroke: '#383851',
  heavyStroke: '#535370',
  offBackground: dark.OFF_BACKGROUND,
  modalBackground: '#222137',
  errorBackground: dark.PRIMARY_TEXT,

  inputBackground: '#222137',
  inputAmountQuickOptionBaseBackground: dark.OFF_BACKGROUND,
  inputAmountQuickOptionDisabledBackground: dark.OFF_BACKGROUND,
  inputAmountQuickOptionFocusedBorder: dark.OFF_BACKGROUND,

  youPayYouReceiveBackground: dark.OFF_BACKGROUND,
  youPayYouReceiveBorder: dark.OFF_BACKGROUND,
  youPayYouReceivePrimaryText: dark.PRIMARY_TEXT,
  youPayYouReceiveSecondaryText: dark.SECONDARY_TEXT,

  strokeColor: dark.PRIMARY_TEXT,
}

const lightColors: ThemeOptions['customColors'] = {
  actionColorDisabled: 'rgba(108,75,255,0.50)',
  buttonBackground: BUTTON_BACKGROUND,
  buttonBackgroundPressed: BUTTON_BACKGROUND_HOVER,
  buttonBackgroundHover: BUTTON_BACKGROUND_HOVER,
  buttonBackgroundDisabled: BUTTON_BACKGROUND_DISABLED,
  buttonBackgroundTertiary: light.OFF_BACKGROUND,
  buttonIconBackgroundHover: light.OFF_BACKGROUND,
  focusedOptionBorder: ACTION_COLOR,

  buttonTextPrimary: ACTION_COLOR_FOREGROUND,
  buttonTextDisabled: ACTION_COLOR_FOREGROUND,
  buttonTextSecondary: '#535263',
  primaryText: light.PRIMARY_TEXT,
  secondaryText: light.SECONDARY_TEXT,
  tertiaryText: '#9493A0',
  lightStroke: '#F2F2F2',
  mediumStroke: '#ECECEC',
  heavyStroke: '#F2F2F2',
  offBackground: light.OFF_BACKGROUND,
  errorBackground: '#F2E6E4',

  inputAmountQuickOptionBaseBackground: light.OFF_BACKGROUND,
  inputAmountQuickOptionDisabledBackground: light.OFF_BACKGROUND,
  inputAmountQuickOptionFocusedBorder: light.OFF_BACKGROUND,

  youPayYouReceiveBackground: light.OFF_BACKGROUND,
  youPayYouReceiveBorder: light.OFF_BACKGROUND,
  youPayYouReceivePrimaryText: light.PRIMARY_TEXT,
  youPayYouReceiveSecondaryText: light.SECONDARY_TEXT,
}

const baseTheme: ThemeOptions = {
  borderRadius: 'large',
  customFontFamily: 'inherit',
  accentColor: ACTION_COLOR,
  accentColorForeground: ACTION_COLOR_FOREGROUND,
  customBorderRadiuses: {
    modal: '24px',
    modalMobile: '24px',
    modalActionButton: '12px',
    modalActionButtonMobile: '12px',
  },
}

export const sushiTheme = {
  darkMode: darkTheme({
    ...baseTheme,
    customColors: darkColors,
  }),
  lightMode: lightTheme({
    ...baseTheme,
    customColors: lightColors,
  }),
}
