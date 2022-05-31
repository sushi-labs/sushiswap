export function getCookie(key: string): string {
  const name = key + '='
  const cookie = decodeURIComponent(document.cookie)
  const entries = cookie.split(';')
  for (let i = 0; i < entries.length; i++) {
    let c = entries[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
