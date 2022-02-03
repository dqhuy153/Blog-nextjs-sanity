import React from 'react'
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  useSession,
} from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null
}

const Login = ({ providers }: Props) => {
  const handleLoginProvider = (provider: ClientSafeProvider) => {
    signIn(provider.id, {
      callbackUrl: '/',
    })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 lg:max-w-4xl">
        <div
          className="hidden bg-cover lg:block lg:w-1/2"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
          }}
        ></div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <h2 className="mb-2 text-center text-2xl font-semibold text-gray-700 dark:text-white">
            Blog.
          </h2>

          <p className="text-md text-center text-gray-600 dark:text-gray-200">
            Welcome back!
          </p>

          {providers &&
            Object.values(providers).map((provider) => (
              <button
                onClick={() => handleLoginProvider(provider)}
                className="mt-4 flex w-full transform items-center justify-center rounded-lg border text-gray-600 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                key={provider.id}
              >
                {/* TODO: Add icon brand here */}
                {provider.name === 'GitHub' && <AiFillGithub size={22} />}
                {provider.name === 'Google' && <FcGoogle size={22} />}
                <span className="w-5/6 px-4 py-3 text-center font-bold">
                  Sign in with {provider.name}
                </span>
              </button>
            ))}

          <div className="mt-4 flex items-center justify-between">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

            <a
              href="#"
              className="text-center text-xs uppercase text-gray-500 hover:underline dark:text-gray-400"
            >
              or login with email
            </a>

            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
          </div>

          <div className="mt-4">
            <label
              className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200"
              htmlFor="LoggingEmailAddress"
            >
              Email Address
            </label>
            <input
              id="LoggingEmailAddress"
              className="block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
              type="email"
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between">
              <label
                className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200"
                htmlFor="loggingPassword"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs text-gray-500 hover:underline dark:text-gray-300"
              >
                Forget Password?
              </a>
            </div>

            <input
              id="loggingPassword"
              className="block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
              type="password"
            />
          </div>

          <div className="mt-8">
            <button className="w-full transform rounded bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none">
              Login
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

            <a
              href="#"
              className="text-xs uppercase text-gray-500 hover:underline dark:text-gray-400"
            >
              or sign up
            </a>

            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: {
      providers,
    },
  }
}
