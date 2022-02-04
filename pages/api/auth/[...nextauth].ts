import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProviders from 'next-auth/providers/github'
import GoogleProviders from 'next-auth/providers/google'
import FacebookProviders from 'next-auth/providers/facebook'
// import { SanityAdapter, SanityCredentials } from 'next-auth-sanity'
// import { sanityClientEditor } from '../../../lib/sanity/server'

const options: NextAuthOptions = {
  providers: [
    GithubProviders({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }),
    // FacebookProviders({
    //   clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
    //   clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET || '',
    // }),
    GoogleProviders({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
    }),
    // SanityCredentials(sanityClientEditor), // only if you use sign in with credentials
  ],
  // adapter: SanityAdapter(sanityClientEditor),
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || '',
}

export default NextAuth(options)
