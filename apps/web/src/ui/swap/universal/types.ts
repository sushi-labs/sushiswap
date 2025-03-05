import type { ReactNode } from 'react'

/**
 * Represents the different sections of a swap widget.
 * Each section is a React node that can be rendered in a specific position.
 *
 * @property banner - Optional top banner for announcements or important information
 * @property header - The header section containing title and main information
 * @property settings - The settings/configuration section, typically rendered next to mode buttons
 * @property content - The main content area containing the swap interface
 */
export interface SwapWidgetSlots {
  /** Optional top banner for announcements or important information */
  banner?: ReactNode
  /** The header section containing title and main information */
  header: ReactNode
  /** The settings/configuration section, typically rendered next to mode buttons */
  settings: ReactNode
  /** The main content area containing the swap interface */
  content: ReactNode
}
