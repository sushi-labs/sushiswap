import { Layout } from 'components'
import Head from 'next/head'
import React from 'react'

export default function Wiget() {
  return (
    <Layout>
      <Head>
        <title>Widget | Sushi</title>
        <meta property="og:title" content="Widget | Sushi" key="title" />
      </Head>
    </Layout>
  )
}
