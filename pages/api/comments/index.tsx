// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { sanityClientEditor } from '../../../lib/sanity/server'
import { IFormCommentInput } from '../../posts/[slug]'

interface Payload extends IFormCommentInput {}

interface Data {
  data?: any
  message: string
  error?: any
  statusCode: number
}

export default async function comments(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { _id, name, email, comment } = JSON.parse(req.body)

  try {
    const response = await sanityClientEditor.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    })

    res.status(200).json({
      message: 'Create comment successfully',
      statusCode: 200,
      data: response,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Something went wrong', error, statusCode: 500 })
  }
}
