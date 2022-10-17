import { Head, Html, Main, NextScript } from 'next/document'

const MyDocument = () => {
  return (
    <Html lang="en" className="overflow-y-scroll">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=optional"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default MyDocument
