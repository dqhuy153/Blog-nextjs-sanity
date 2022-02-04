import Head from 'next/head'
import Header from '../components/Header'
import { sanityClient } from '../lib/sanity/server'
import { PostResponse } from '../typings'
import Footer from '../components/Footer'
import { useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { authState } from '../recoil/auth'
import { useEffect } from 'react'
import { isEmpty } from 'lodash'
import PostItem from '../components/PostItem'

interface Props {
  posts: PostResponse[]
}

const MAX_RELATED_POSTS = 6

export default function Home({ posts }: Props) {
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

  return (
    <div className="relative min-h-[80vh]">
      <Head>
        <title>Blog.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-7xl">
        <Header />

        {/* Banner */}
        <div className="mt-20 space-y-5 border-black bg-yellow-400 py-10 px-10">
          <h1 className="max-w-2xl font-serif text-6xl">
            <span className="underline">Blog</span> is a place to write, read
            and connect.
          </h1>
          <h2 className="max-w-3xl">
            This blog, in the first place, is where I'm learning to code with a
            new stack. But over time, I think it could be a good place to share
            about my life, my knowledge with others. Welcome!
          </h2>
        </div>

        {/* Posts */}
        <div className="mt-2 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-4 lg:grid-cols-3 lg:py-4 xl:px-0">
          {posts.slice(0, MAX_RELATED_POSTS).map((post) => (
            <PostItem post={post} key={post._id} />
          ))}
        </div>
      </main>

      {/* footer */}
      <Footer showOtherPosts={false} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] | order(_createdAt desc) {
  _id,
  _createdAt,
  title,
  user -> {
    name,
    image,
    slug
  },
  description,
  mainImage,
  slug,
  body
}`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
