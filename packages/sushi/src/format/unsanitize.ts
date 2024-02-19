// replace the colon sanitzed by nextjs with a colon
export function unsanitize(id: string): string {
  return id.replaceAll('%3A', ':')
}
