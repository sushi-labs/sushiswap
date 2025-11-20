export async function routerProxy(url: string) {
  return fetch('/api/router-proxy', {
    body: JSON.stringify({ url }),
    method: 'POST',
    credentials: 'include',
  })
}
