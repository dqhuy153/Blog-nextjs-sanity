import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import ProtectedRoute from '../components/ProtectedRoute'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
