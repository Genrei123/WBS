import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { postQuery } from "@/sanity/lib/queries";

const builder = createImageUrlBuilder(client);

type SanityImageAsset = {
  _ref: string;
  _type: "reference";
};

type SanityImage = {
  _type: "image";
  asset: SanityImageAsset;
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number; width: number; height: number };
};

type PortableTextSpan = {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
};

type PortableTextBlock = {
  _key: string;
  _type: "block";
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  children: PortableTextSpan[];
  markDefs: { _key: string; _type: string; href?: string }[];
};

type PortableTextImageBlock = {
  _key: string;
  _type: "image";
} & SanityImage;

type PortableTextCodeBlock = {
  _key: string;
  _type: "code";
  code: string;
  language?: string;
};

type BlockContent = PortableTextBlock | PortableTextImageBlock | PortableTextCodeBlock;

interface BlogPost {
  _id: string;
  title: string;
  slug: { _type: "slug"; current: string };
  author: { name: string } | null;
  body: BlockContent[];
  categories: { title: string }[] | null;
  publishedAt: string;
  mainImage: SanityImage | null;
}

type Params = {
  params: Promise<{ slug: string }>;
};


function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(body: BlockContent[]): number {
  const wordCount = body
    .filter((b): b is PortableTextBlock => b._type === "block")
    .flatMap((b) => b.children)
    .reduce((acc, span) => acc + span.text.split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(wordCount / 200));
}


const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-foreground/80 mb-6 text-base leading-relaxed">{children}</p>,
    h1: ({ children }) => <h1 className="text-foreground mt-10 mb-4 text-3xl font-bold tracking-tight">{children}</h1>,
    h2: ({ children }) => (
      <h2 className="text-foreground mt-8 mb-3 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-foreground mt-6 mb-2 text-xl font-semibold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-foreground mt-5 mb-2 text-lg font-semibold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-brand text-muted-foreground my-8 border-l-2 pl-6 text-lg italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand hover:text-brand-foreground underline underline-offset-4 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: PortableTextImageBlock }) => {
      if (!value?.asset) return null;
      const url = builder.image(value).width(900).url();
      return (
        <figure className="my-10">
          <img src={url} alt={value.alt ?? ""} className="w-full rounded-lg object-cover" />
          {value.caption && (
            <figcaption className="text-muted-foreground mt-3 text-center text-sm">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }: { value: PortableTextCodeBlock }) => (
      <pre className="bg-muted text-foreground my-6 overflow-x-auto rounded-lg p-5 font-mono text-sm">
        <code>{value.code}</code>
      </pre>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="text-foreground/80 mb-6 list-disc space-y-1.5 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="text-foreground/80 mb-6 list-decimal space-y-1.5 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};


export default async function BlogPage({ params }: Params) {
  const { slug } = await params;

  const { data } = await sanityFetch({
    query: postQuery,
    params: { slug: "blog/" + slug },
  });

  if (!data) notFound();

  const post = data as BlogPost;
  const readTime = post.body ? estimateReadTime(post.body) : 1;
  const heroUrl = post.mainImage?.asset
    ? builder.image(post.mainImage).width(1200).height(600).fit("crop").url()
    : null;

  return (
    <div className="bg-background w-full px-4">
      <div className="max-w-container relative mx-auto py-24">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories.map((cat, i) => (
              <span key={i} className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight">{post.title}</h1>

        {/* Byline */}
        <div className="border-border mb-8 flex items-center gap-3 border-b pb-8">
          <div className="bg-brand text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            {post.author?.name?.charAt(0) ?? "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-sm font-medium">{post.author?.name ?? "Anonymous"}</span>
            <span className="text-muted-foreground text-xs">
              {post.publishedAt ? formatDate(post.publishedAt) : ""}
              {" · "}
              {readTime} min read
            </span>
          </div>
        </div>

        {/* Hero image */}
        {heroUrl && (
          <img src={heroUrl} alt={post.mainImage?.alt ?? post.title} className="mb-10 w-full rounded-lg object-cover" />
        )}

        {/* Body */}
        {post.body && (
          <article>
            <PortableText value={post.body} components={portableTextComponents} />
          </article>
        )}

        {/* Footer */}
        {post.author?.name && (
          <div className="border-border mt-16 flex items-center gap-4 border-t pt-10">
            <div className="bg-brand text-primary-foreground flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-semibold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-foreground font-semibold">{post.author.name}</p>
              <p className="text-muted-foreground text-sm">Written by {post.author.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
