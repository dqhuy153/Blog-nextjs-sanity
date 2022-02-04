import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { urlFor } from '../../lib/sanity/helpers'
import { PostResponse } from '../../typings'
import DefaultThumbnail from '../../public/images/pexels-tyler-lastovich-1022411.jpg'

type Props = { showOtherPosts: boolean; posts?: PostResponse[] }

const Footer = ({ posts, showOtherPosts = true }: Props) => {
  const router = useRouter()

  const handleGoToPostDetail = (slug: string) => {
    router.push(`/posts/${slug}`)
  }

  return (
    <footer className="absolute bottom-0 right-0 left-0 h-0">
      {showOtherPosts && posts && (
        <div className="container mx-auto max-w-3xl p-4 md:mb-8">
          <h3 className="mb-8 text-xl font-medium">Related Posts</h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            {posts?.map((post) => (
              <div
                className="group relative mb-6 cursor-pointer overflow-hidden rounded-xl hover:shadow-2xl lg:mb-0"
                onClick={() => handleGoToPostDetail(post.slug.current)}
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={urlFor(post.mainImage).url() || DefaultThumbnail}
                    layout="fill"
                    objectFit="cover"
                    className="w-full transform shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-70"
                  />
                </div>

                <div className="xs:border-none rounded-b-xl p-4 ">
                  <p className="text-lg font-medium text-gray-500 transition-all duration-300 ease-in-out group-hover:text-black">
                    {post.title}
                  </p>
                  <p className="text-xs font-medium text-gray-400 transition-all duration-300 ease-in-out group-hover:text-gray-600">
                    {post.user.name} -{' '}
                    {new Date(post._createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-sky-900 p-2 text-center text-sm text-white">
        <a className="text-sm text-white" href="/">
          Blog.{' '}
        </a>
        ©2022 Copyright
      </div>
    </footer>
  )
}

export default Footer
