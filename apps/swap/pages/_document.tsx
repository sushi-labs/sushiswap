import { Head, Html, Main, NextScript } from 'next/document'

const MyDocument = () => {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=optional" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default MyDocument
