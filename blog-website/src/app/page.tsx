import Link from 'next/link'
import { formatDate, truncateText } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

async function getPublishedPosts() {
  return prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 10,
  })
}

async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Blog</h1>
              <p className="text-muted-foreground mt-1">
                Thoughts, stories and ideas
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline">Admin Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
                  No posts published yet
                </h2>
                <p className="text-muted-foreground">
                  Check back later for new content!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    {post.featuredImage && (
                      <div className="mb-4">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {post.category && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {post.category.name}
                        </span>
                      )}
                      <span>{formatDate(new Date(post.publishedAt!))}</span>
                      <span>By {post.author.name || 'Anonymous'}</span>
                      <span>{post._count.comments} comments</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-3 text-foreground">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.excerpt || truncateText(post.content, 200)}
                    </p>

                    <Link href={`/posts/${post.slug}`}>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Categories
              </h3>
              {categories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No categories yet
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors"
                    >
                      <span className="text-foreground">{category.name}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        {category._count.posts}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
