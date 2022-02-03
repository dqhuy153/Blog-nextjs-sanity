import { User } from 'next-auth'
import { atom } from 'recoil'

interface IAuthState {
  isAuthenticated: boolean
  user?: User | null
  expires?: string | null
}

export const authState = atom<IAuthState>({
  key: 'IAuthState',
  default: {
    isAuthenticated: false,
    user: null,
    expires: null,
  },
})
