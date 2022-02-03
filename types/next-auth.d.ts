import NextAuth, { User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  export interface User {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    username?: string
  }

  export interface Session {
    user: User
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user?: User
    accessToken?: string
    refreshToken?: string
    username?: string
    accessTokenExpires?: number
  }
}
