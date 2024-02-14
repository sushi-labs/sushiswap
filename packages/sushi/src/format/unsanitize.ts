// replace the colon sanitzed by nextjs with a colon
export function unsanitize(id: string): string {
  return id.replace('%3A', ':')
}
