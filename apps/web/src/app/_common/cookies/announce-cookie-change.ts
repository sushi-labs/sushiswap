export function announceCookieChange() {
  const event = new Event('cookieChange')
  document.dispatchEvent(event)
}
