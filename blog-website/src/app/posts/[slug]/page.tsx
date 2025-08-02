import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { ArrowLeft } from 'lucide-react'

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      category: true,
      comments: {
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  return post
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {post.category && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {post.category.name}
                </span>
              )}
              <span>{formatDate(new Date(post.publishedAt!))}</span>
              <span>By {post.author.name || 'Anonymous'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-foreground/90 leading-relaxed"
            />
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Comments ({post.comments.length})
            </h2>

            {post.comments.length === 0 ? (
              <p className="text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-card border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {comment.author.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {comment.author.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(comment.createdAt))}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 My Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}