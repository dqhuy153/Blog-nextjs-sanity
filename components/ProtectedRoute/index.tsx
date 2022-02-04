import { isEmpty } from 'lodash'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { authState } from '../../recoil/auth'

type Props = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { data: session } = useSession()
  const [authData, setAuthData] = useRecoilState(authState)

  useEffect(() => {
    if (isEmpty(session) || !session || !session?.user || !authData) {
      setAuthData((prev) => ({
        user: null,
        isAuthenticated: false,
        expires: null,
      }))
    } else {
      setAuthData({
        user: session?.user,
        isAuthenticated: true,
        expires: session?.expires,
      })
    }
  }, [session])

  return <div>{children}</div>
}

export default ProtectedRoute
