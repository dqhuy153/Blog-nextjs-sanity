import urlBuilder from '@sanity/image-url'
import { getImageDimensions } from '@sanity/asset-utils'
import { urlFor } from '../../../lib/sanity/helpers'

// Barebones lazy-loaded image component
export const ImageComponent: React.FC<any> = ({ value, isInline }) => {
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
