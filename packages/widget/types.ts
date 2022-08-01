export interface Theme {
  accent?: string
  primary: {
    default?: string
    hover?: string
  }
  secondary: {
    default?: string
    hover?: string
  }
  borderRadius?: number
  background: {
    primary?: string
    secondary?: string
  }
}
