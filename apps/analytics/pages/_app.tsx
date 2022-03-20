import { Provider } from 'urql'
import client from '../lib/urlq'

export default function App({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  )
}
