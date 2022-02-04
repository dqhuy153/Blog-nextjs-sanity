import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { urlFor } from '../../lib/sanity/helpers'
import { PostResponse } from '../../typings'
import { DefaultThumbnail, EmptyAvatar } from '../Images'

type Props = { post: PostResponse; hideAuthor?: boolean }

const PostItem = ({ post, hideAuthor = false }: Props) => {
  const router = useRouter()

  const handleGoToPostDetail = (slug: string) => {
    router.push(`/posts/${slug}`)
  }
  const handleGoToUserDetail = (slug: string) => {
    router.push(`/users/${slug}`)
  }

  return (
    <div className="group rounded-2xl hover:shadow-2xl">
      <div
        className="relative h-48 w-full transform cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-in-out group-hover:rounded-b-none group-focus:rounded-b-none"
        onClick={() => handleGoToPostDetail(post.slug.current)}
      >
        <Image
          src={urlFor(post.mainImage).url() || DefaultThumbnail}
          layout="fill"
          objectFit="cover"
          className="transform overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="flex cursor-pointer items-start justify-between space-x-6 overflow-hidden py-5 px-3">
        <div
          className={hideAuthor ? 'w-full' : 'w-9/12'}
          onClick={() => handleGoToPostDetail(post.slug.current)}
        >
          <p className="text-lg font-bold">{post.title}</p>
          <p className="w-full text-[11px] font-light">
            {new Date(post._createdAt).toLocaleDateString('en-GB')}
          </p>
          <p className="mt-2 text-sm font-[400] text-gray-500">
            {post.description.slice(0, 80)}
            {post.description.length > 80 && '...'}
          </p>
        </div>
        {!hideAuthor && (
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
        )}
      </div>
    </div>
  )
}

export default PostItem
