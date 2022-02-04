import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { authState } from '../../recoil/auth'
import EmptyAvatar from '../../public/images/emptyAvatar.png'
import { Menu, Transition } from '@headlessui/react'
import styles from './styles.module.scss'
import { signOut } from 'next-auth/react'
import { AiOutlineLogout } from 'react-icons/ai'
import { RiUserFollowLine } from 'react-icons/ri'

type Props = {}

const Header = (props: Props) => {
  const [authData, setAuthData] = useRecoilState(authState)
  const [isFollow, setIsFollow] = React.useState(false)

  const handleSignOut = () => {
    signOut()
    setAuthData({
      isAuthenticated: false,
      user: null,
      expires: null,
    })
  }

  useEffect(() => {
    const followStatus = localStorage.getItem('follow')
    if (!followStatus) {
      setIsFollow(false)
    } else {
      setIsFollow(true)
    }
  }, [])

  const handleFollowClick = () => {
    const followStatus = isFollow ?? localStorage.getItem('follow')
    if (!followStatus) {
      Notification.requestPermission()
      localStorage.setItem('follow', '1')
      setIsFollow(true)
    } else {
      localStorage.removeItem('follow')
      setIsFollow(false)
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between  py-4 px-6">
        <div className="flex items-center space-x-12 ">
          <div className="w-50 cursor-pointer object-contain text-2xl font-medium">
            <Link href="/">Blog.</Link>
          </div>
          <div className="hidden items-center justify-center space-x-6 md:inline-flex">
            {/* <h3 className={styles.btn}>About</h3>
            <h3 className={styles.btn}>Contact</h3> */}
            <h3
              className={classNames(
                styles.btn_primary,
                isFollow
                  ? 'flex items-center border border-orange-500 text-orange-500'
                  : 'bg-orange-500 text-white',
                'rounded-full px-4 py-1 hover:py-[1px]'
              )}
              onClick={handleFollowClick}
            >
              {isFollow && <RiUserFollowLine className="mr-3" />}
              {isFollow ? 'Following' : 'Follow'}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-orange-500">
          {authData.isAuthenticated ? (
            <Menu
              as="div"
              className="relative inline-block cursor-pointer text-left"
            >
              <div>
                <Menu.Button className="flex items-center justify-center">
                  <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={authData.user?.image || EmptyAvatar}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">
                    {authData.user?.name || 'Guest'}
                  </p>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'flex w-full items-center px-4 py-2 text-sm'
                          )}
                          onClick={handleSignOut}
                        >
                          <AiOutlineLogout size={20} className="mr-6 mt-1" />
                          Log out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link href="/login">
              <h3 className={styles.btn}>Sign In</h3>
            </Link>
          )}
          {/* <h3 className="cursor-pointer rounded-full border border-orange-500 px-4 py-1">
            Get Started
          </h3> */}
        </div>
      </div>
    </header>
  )
}

export default Header
