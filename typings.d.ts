import { TypedObject } from '@portabletext/react'

export interface PostResponse {
  _id: string
  _createdAt: string
  author: {
    image: SanityImageSource
    name: string
    slug: {
      current: string
    }
  }
  description: string
  mainImage: SanityImageSource
  slug: {
    current: string
  }
  comments?: CommentResponse[]
  title: string
  body: TypedObject[]
}

export interface BodyPostResponse {
  _key: string
  _type: string
  children: [
    {
      _key: string
      _type: 'block'
      marks: ['strong' | 'em']
      text: string
    }
  ]
  markDefs: any[]
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote'
}

export interface CommentResponse {
  _createdAt: string
  _id: string
  _rev: string
  _type: 'comment'
  _updatedAt: string
  approved: boolean
  comment: string
  email: string
  name: string
  post: {
    _ref: 'reference'
    _type: string
  }
}
