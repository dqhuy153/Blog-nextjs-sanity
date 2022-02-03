import Image from 'next/image'
import React, { useState } from 'react'
import Header from '../../../components/Header'
import { urlFor } from '../../../lib/sanity/helpers'
import { sanityClient } from '../../../lib/sanity/server'
import { PostResponse } from '../../../typings'
import DefaultThumbnail from '../../../public/images/pexels-tyler-lastovich-1022411.jpg'
import EmptyAvatar from '../../../public/images/emptyAvatar.png'
import DefaultAvatar from '../../../public/images/avatar.jpg'
import { useRouter } from 'next/router'
// import PortableText from 'react-portable-text'
import { PortableText } from '@portabletext/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Footer from '../../../components/Footer'
import urlBuilder from '@sanity/image-url'
import { getImageDimensions } from '@sanity/asset-utils'

// Barebones lazy-loaded image component
export const ImageComponent = ({ value, isInline }: any) => {
  const { width, height } = getImageDimensions(value)
  return (
    <img
      src={
        urlFor(value)
          .width(isInline ? 100 : 800)
          .fit('max')
          .auto('format')
          .url() || ''
      }
      alt={value.alt || ' '}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? 'inline-block' : 'block',

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: (width / height).toFixed(2),
      }}
    />
  )
}

export const LinkComponent = ({ children, value }: any) => {
  const target = (value?.href || '').startsWith('http' || 'https')
    ? '_blank'
    : undefined
  const rel =
    target === '_blank'
      ? 'noindex nofollow'
      : !value.href.startsWith('/')
      ? 'noreferrer noopener'
      : undefined
  return (
    <a
      href={value.href}
      target={target}
      rel={rel}
      className="cursor-pointer text-blue-500 hover:underline"
    >
      {children}
    </a>
  )
}

export const H1Component = ({ children, value }: any) => {
  return <h1 className="my-5 text-2xl font-bold">{children}</h1>
}

export const NormalComponent = ({ children, ...props }: any) => (
  <p {...props} className={'my-5'}>
    {children}
  </p>
)

export const portableTextComponents = {
  // Any other custom types you have in your content
  // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
  types: {
    image: ImageComponent,
  },

  // Marks custom here (link, em, strong, code, underline, strikethrough, ...)
  marks: {
    // Ex. 1: custom renderer for the em / italics decorator
    em: ({ children }: any) => (
      <em className="font-semibold text-gray-600">{children}</em>
    ),

    // Ex. 2: rendering a custom `link` annotation
    link: LinkComponent,
  },

  // Block custom here (h1, h2, h3, h4, h5, h6, blockquote, normal, ...)
  block: {
    // Ex. 1: customizing common block types
    h1: (props: any) => <h1 {...props} className="my-5 text-2xl font-bold" />,
    h2: (props: any) => <h2 {...props} className="my-5 text-xl font-bold" />,
    h3: (props: any) => <h3 {...props} className="my-5 text-lg font-bold" />,
    h4: (props: any) => <h4 {...props} className="text-md my-5 font-bold" />,
    blockquote: ({ children }: any) => (
      <blockquote className="my-4">{children}</blockquote>
    ),
    normal: NormalComponent,

    // Ex. 2: rendering custom styles
    customHeading: ({ children }: any) => (
      <h2 className="text-primary text-2xl font-semibold">{children}</h2>
    ),
  },

  // List custom here (bulleted-list, numbered-list, list-item, ...)
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }: any) => <ul className="mt-xl">{children}</ul>,
    number: ({ children }: any) => <ol className="mt-lg">{children}</ol>,

    // Ex. 2: rendering custom lists
    checkmarks: ({ children }: any) => (
      <ol className="m-auto text-lg">{children}</ol>
    ),
  },

  // List item custom here (bulleted-list, numbered-list, list-item, ...)
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }: any) => (
      <li style={{ listStyleType: 'disclosure-closed' }}>{children}</li>
    ),

    // Ex. 2: rendering custom list items
    checkmarks: ({ children }: any) => <li>✅ {children}</li>,
  },
}

//serializers for PortableText of 'react-portable-text'
export const serializers = {
  h1: (props: any) => <h1 {...props} className="my-5 text-2xl font-bold" />,
  h2: (props: any) => <h2 {...props} className="my-5 text-xl font-bold" />,
  h3: (props: any) => <h3 {...props} className="my-5 text-lg font-bold" />,
  h4: (props: any) => <h4 {...props} className="text-md my-5 font-bold" />,
  li: ({ children, ...props }: any) => (
    <li {...props} className="ml-4 list-disc">
      {children}
    </li>
  ),
  link: ({ href, children, ...props }: any) => (
    <a {...props} className="cursor-pointer text-blue-500 hover:underline">
      {children}
    </a>
  ),
  img: ({ ...props }: any) => <img {...props} className="my-10 py-10" />,
  normal: ({ children, ...props }: any) => (
    <p {...props} className={'my-5'}>
      {children}
    </p>
  ),
}

export interface IFormCommentInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: PostResponse
  otherPosts: PostResponse[]
}

const Post = ({ post, otherPosts }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleGoToUserDetail = (slug: string) => {
    router.push(`/users/${slug}`)
  }

  const handleBackToComment = () => {
    setSubmitted(false)
    reset()
  }

  const onSubmit: SubmitHandler<any> = async (data: IFormCommentInput) => {
    setLoading(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      setSubmitted(true)
    } catch (error) {
      console.log('error', error)
    }

    setLoading(false)
  }

  return (
    <main className="relative mx-auto min-h-[80vh]">
      <Header />

      {/* Banner */}
      <div className="relative mt-20 h-48 w-full overflow-hidden bg-gray-800">
        <Image
          src={urlFor(post.mainImage).url() || DefaultThumbnail}
          layout="fill"
          objectFit="none"
          className="transform overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:object-contain"
        />
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl p-4 font-medium">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="text-grey-500 text-xl font-light">{post.description}</h2>
        <div className="flex items-center justify-start space-x-3 py-4">
          <div className="relative h-11 w-11 cursor-pointer overflow-hidden rounded-full">
            <Image
              src={urlFor(post.author.image).url() || DefaultAvatar}
              layout="fill"
              objectFit="cover"
              onClick={() => handleGoToUserDetail(post.author.slug.current)}
            />
          </div>
          <p className="mt-1 text-center text-sm font-normal">
            Blog post by{' '}
            <span
              className="cursor-pointer font-bold hover:underline"
              onClick={() => handleGoToUserDetail(post.author.slug.current)}
            >
              {post.author.name}
            </span>{' '}
            - published at {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          {/* PortableText from  '@portabletext/react' (Official of sanity)*/}
          <PortableText value={post.body} components={portableTextComponents} />

          {/* PortableText from  'react-portable-text' (customize easily)*/}
          {/* <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={serializers}
          /> */}
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-xl border-yellow-300 " />

      {/* Email & comment section */}
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-3xl flex-col items-center rounded-xl bg-yellow-500 py-10 text-white">
          <h3 className="mb-4 text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below!</p>
          <button
            className="mt-8 rounded-full bg-white py-3 px-6 text-sm font-medium text-black shadow hover:drop-shadow-xl"
            onClick={handleBackToComment}
          >
            Back to Comment
          </button>
        </div>
      ) : (
        <form
          className="mx-auto max-w-3xl p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-md mx-auto mb-1 text-yellow-500">
            Enjoy this article?
          </h3>
          <h4 className="text-2xl font-bold">Leave a comment below!</h4>

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 mt-4 block">
            <span className="block font-medium text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-2 block w-full rounded border py-2 px-3 shadow outline-none ring-0 ring-orange-300 focus:ring"
              type="text"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-2 text-red-500">Field is required.</p>
            )}
          </label>
          <label className="mb-5 mt-4 block">
            <span className="block font-medium text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-2 block w-full rounded border py-2 px-3 shadow outline-none ring-0 ring-orange-300 focus:ring"
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-2 text-red-500">Field is required.</p>
            )}
          </label>
          <label className="mb-5 mt-4 block">
            <span className="block font-medium text-gray-700">Content</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-2 block w-full rounded border py-2 px-3 shadow outline-none ring-0 ring-orange-300 focus:ring"
              placeholder="Enter your comment"
              rows={6}
            />
            {errors.comment && (
              <p className="mt-2 text-red-500">Field is required.</p>
            )}
          </label>

          <input
            type="submit"
            value={loading ? 'Submitting...' : 'Submit'}
            className="focus:shadow-outline mx-auto block w-full cursor-pointer self-center rounded-full bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-500 lg:w-[20%]"
            disabled={loading}
          />
        </form>
      )}

      {/* Comments */}
      <div className="my-8 mx-auto max-w-3xl p-4">
        <h3 className="mx-auto mb-8 text-xl font-medium">
          Comments ({post.comments?.length || 0})
        </h3>
        {post.comments &&
          post.comments.map((comment) => (
            <div className="mx-auto mb-3 flex max-w-3xl rounded-xl border p-4">
              <div className="mr-4 flex w-3/12 items-center justify-between">
                <div className="flex items-center">
                  <div className="relative h-11 w-11 cursor-pointer overflow-hidden rounded-full">
                    <Image
                      src={EmptyAvatar}
                      layout="fill"
                      objectFit="cover"
                      // onClick={() =>
                      //   handleGoToUserDetail(comment.author.slug.current)
                      // }
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold">{comment.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4">{comment.comment}</p>
            </div>
          ))}
      </div>

      <Footer showOtherPosts posts={otherPosts} />
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    id,
    slug {
      current
    }
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: PostResponse) => ({
    params: {
      slug: post.slug.current,
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
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
      name,
      image,
      slug
    },
    'comments': *[_type == "comment" && 
      post._ref == ^._id &&
      approved == true
    ] | order(_createdAt desc),
    description,
    mainImage,
    slug,
    body
  }`

  const postsQuery = `*[_type == "post" && slug.current != $slug] {
  _id,
  _createdAt,
  title,
  author -> {
    name,
    image,
    slug
  },
  description,
  mainImage,
  slug,
  body
}`

  const post = await sanityClient.fetch(query, { slug: params?.slug })

  const otherPosts = await sanityClient.fetch(postsQuery, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      // returns the default 404 page with a status code of 404
      notFound: true,
    }
  }

  return {
    props: {
      post,
      otherPosts,
    },
    revalidate: 60, //after 60 seconds, the page will updated the old cached version
  }
}
