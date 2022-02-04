import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import { urlFor } from '../lib/sanity/helpers'
import { sanityClient } from '../lib/sanity/server'
import { PostResponse } from '../typings'
import DefaultThumbnail from '../public/images/pexels-tyler-lastovich-1022411.jpg'
import EmptyAvatar from '../public/images/emptyAvatar.png'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'
import { useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { authState } from '../recoil/auth'
import { useEffect } from 'react'
import { isEmpty } from 'lodash'

interface Props {
  posts: PostResponse[]
}

const MAX_RELATED_POSTS = 6

export default function Home({ posts }: Props) {
  const router = useRouter()
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

  const handleGoToPostDetail = (slug: string) => {
    router.push(`/posts/${slug}`)
  }
  const handleGoToUserDetail = (slug: string) => {
    router.push(`/users/${slug}`)
  }

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
          <h2>
            This blog, in the first place, is where I'm learning to code with a
            new stack. But over time, I think they could be a good place to
            share about my life, my knowledge with others. Welcome!
          </h2>
        </div>

        {/* Posts */}
        <div className="mt-2 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-4 lg:grid-cols-3 lg:py-4 xl:px-0">
          {posts.slice(0, MAX_RELATED_POSTS).map((post) => (
            <div className="group">
              <div
                className="relative h-48 w-full cursor-pointer overflow-hidden rounded-2xl "
                onClick={() => handleGoToPostDetail(post.slug.current)}
              >
                <Image
                  src={urlFor(post.mainImage).url() || DefaultThumbnail}
                  layout="fill"
                  objectFit="cover"
                  className="transform overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
              <div className="flex cursor-pointer items-start justify-center space-x-6 py-5">
                <div
                  className="w-9/12"
                  onClick={() => handleGoToPostDetail(post.slug.current)}
                >
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="mt-1 text-sm font-[400] text-gray-500">
                    {post.description.slice(0, 80)}
                    {post.description.length > 80 && '...'}
                  </p>
                </div>
                <div
                  className="flex w-3/12 flex-col items-center justify-center"
                  onClick={() => handleGoToUserDetail(post.user.slug.current)}
                >
                  <div className="relative h-11 w-11 overflow-hidden rounded-full">
                    <Image
                      src={urlFor(post?.user?.image).url() || EmptyAvatar}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <p className="mt-1 w-full text-center text-xs font-medium">
                    {post.user.name}
                  </p>
                </div>
              </div>
            </div>
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
