export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: "Comment won't be displayed until approved",
    },
    {
      name: 'email',
      title: 'Email',
      type: 'email',
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
    },
  ],
  preview: {
    select: {
      title: 'comment',
      author: 'name',
      approved: 'approved',
      media: 'post.mainImage',
    },
    prepare(selection) {
      const { author, approved } = selection
      return Object.assign({}, selection, {
        subtitle:
          author &&
          `by ${author} (${
            approved === false
              ? 'not approved'
              : approved
              ? 'approved'
              : 'pending'
          })`,
      })
    },
  },
}
