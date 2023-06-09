import '@/styles/globals.css'
import '@/styles/cursor.scss'
import '@/styles/container.scss'
import '@/styles/secondcontainer.scss'
import '@/styles/loaders.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
