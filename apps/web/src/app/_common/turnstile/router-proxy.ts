export async function routerProxy(url: string, jwt: string) {
  return fetch('/api/router-proxy', {
    body: JSON.stringify({ url, jwt }),
    method: 'POST',
  })
}
