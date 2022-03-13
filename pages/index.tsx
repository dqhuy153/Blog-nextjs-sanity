import Head from 'next/head'
import Header from '../components/Header'
import { sanityClient } from '../lib/sanity/server'
import { PostResponse } from '../typings'
import Footer from '../components/Footer'

import PostItem from '../components/PostItem'

interface Props {
  posts: PostResponse[]
}

const MAX_RELATED_POSTS = 6

export default function Home({ posts }: Props) {
  return (
    <div className="relative min-h-screen">
      <Head>
        <title>Blog.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-7xl">
        <Header />

        {/* Banner */}
        <div className="mt-16">
          <div className="hidden space-y-5 rounded-b-2xl border-black bg-orange-200 py-14 px-10 md:mt-20 md:block md:py-20">
            <h1 className="max-w-2xl font-serif text-6xl">
              Just a simple <span className="underline">Blog</span>
            </h1>
            <h2 className="max-w-3xl">
              This blog, in the first place, is where I'm learning to code with
              new stacks. But over time, I think it could be a good place to
              share my stories with others. Welcome!
            </h2>
          </div>
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
