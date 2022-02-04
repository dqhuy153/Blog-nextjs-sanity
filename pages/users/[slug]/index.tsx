import Head from 'next/head'
import Image from 'next/image'
import EmptyAvatar from '../../../public/images/emptyAvatar.png'
import Header from '../../../components/Header'
import { urlFor } from '../../../lib/sanity/helpers'
import Footer from '../../../components/Footer'
import { PostResponse, UserResponse } from '../../../typings'
import { sanityClient } from '../../../lib/sanity/server'
import PostItem from '../../../components/PostItem'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '../../posts/[slug]'
import { RiMailFill, RiMailLine } from 'react-icons/ri'

interface Props {
  user: UserResponse
}

const MAX_RELATED_POSTS = 6

export default function Home({ user }: Props) {
  const posts = user.posts || []

  return (
    <div className="relative min-h-[80vh]">
      <Head>
        <title>Blog.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-7xl">
        <Header />

        {/* Info */}
        <div className="mt-20 space-y-5 rounded-2xl bg-orange-50 py-10 px-10 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              <Image
                src={urlFor(user?.image).url() || EmptyAvatar}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="ml-5">
              <p className="mt-1 text-2xl font-light">{user.name}</p>

              <p>{user.posts.length} posts</p>

              {/* <div className="mt-3 flex items-center">
                <RiMailLine />
                <p className="ml-1">{user.email}</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-2 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-4 lg:grid-cols-3 lg:py-4 xl:px-0">
          {posts.slice(0, MAX_RELATED_POSTS).map((post) => (
            <PostItem post={post} key={post._id} hideAuthor />
          ))}
        </div>
      </main>

      {/* footer */}
      <Footer showOtherPosts={false} />
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "user"]{
    _id,
    slug {
      current
    }
  }`

  const users = await sanityClient.fetch(query)

  const paths = users.map((user: UserResponse) => ({
    params: {
      slug: user.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string }
}) => {
  const query = `*[_type == "user" && slug.current == $slug][0]{
    _id,
    _createdAt,
    image,
    name,
    'posts': *[_type == "post" && 
      user._ref == ^._id 
    ] | order(_createdAt desc) {
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
    },
    bio,
    email,
  }`

  const user = await sanityClient.fetch(query, { slug: params?.slug })

  if (!user) {
    return {
      // returns the default 404 page with a status code of 404
      notFound: true,
    }
  }

  return {
    props: {
      user,
    },
    revalidate: 60, //after 60 seconds, the page will updated the old cached version
  }
}
