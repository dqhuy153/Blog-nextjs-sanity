import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
import styles from './styles.module.scss'

type Props = {}

const Header = (props: Props) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between  py-4 px-6">
        <div className="flex items-center space-x-12 ">
          <div className="w-50 cursor-pointer object-contain text-2xl font-medium">
            <Link href="/">Blog.</Link>
          </div>
          <div className="hidden items-center justify-center space-x-6 md:inline-flex">
            <h3 className={styles.btn}>About</h3>
            <h3 className={styles.btn}>Contact</h3>
            <h3
              className={classNames(
                styles.btn_primary,
                'rounded-full bg-orange-500 py-1 px-4 text-white hover:py-[1px]'
              )}
            >
              Follow
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-orange-500">
          <h3 className="cursor-pointer">Sign In</h3>
          <h3 className="cursor-pointer rounded-full border border-orange-500 px-4 py-1">
            Get Started
          </h3>
        </div>
      </div>
    </header>
  )
}

export default Header
