import Main from '@/components/Main'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title> Portfolio | Myth  </title>
        <meta name="description" content="Portfolio Myth" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main/>
    </>
  )
}
