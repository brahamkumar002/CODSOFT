import { prisma } from './prisma'
import { createUser } from './auth'

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  try {
    const adminUser = await createUser(
      'admin@blog.com',
      'password123',
      'Blog Admin',
      'ADMIN'
    )
    console.log('✅ Admin user created:', adminUser.email)

    // Create categories
    const techCategory = await prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
      },
    })

    const lifestyleCategory = await prisma.category.create({
      data: {
        name: 'Lifestyle',
        slug: 'lifestyle',
      },
    })

    console.log('✅ Categories created')

    // Create sample posts
    const post1 = await prisma.post.create({
      data: {
        title: 'Welcome to My Blog',
        slug: 'welcome-to-my-blog',
        content: `
          <h2>Welcome to My Blog!</h2>
          <p>This is my first blog post. I'm excited to share my thoughts and experiences with you.</p>
          <p>In this blog, you'll find posts about:</p>
          <ul>
            <li>Technology and programming</li>
            <li>Lifestyle and personal development</li>
            <li>My journey as a developer</li>
          </ul>
          <p>Stay tuned for more content!</p>
        `,
        excerpt: 'Welcome to my new blog! This is the first post where I introduce myself and what you can expect to find here.',
        published: true,
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryId: lifestyleCategory.id,
      },
    })

    const post2 = await prisma.post.create({
      data: {
        title: 'Getting Started with Next.js',
        slug: 'getting-started-with-nextjs',
        content: `
          <h2>Why Next.js?</h2>
          <p>Next.js is a powerful React framework that makes building web applications easier and more efficient.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li><strong>Server-Side Rendering (SSR)</strong> - Better SEO and performance</li>
            <li><strong>Static Site Generation (SSG)</strong> - Fast loading times</li>
            <li><strong>API Routes</strong> - Build full-stack applications</li>
            <li><strong>File-based Routing</strong> - Simple and intuitive</li>
          </ul>

          <h3>Getting Started</h3>
          <p>To create a new Next.js project, run:</p>
          <pre><code>npx create-next-app@latest my-app</code></pre>

          <p>This will set up a new Next.js project with all the necessary dependencies and configuration.</p>
        `,
        excerpt: 'Learn the basics of Next.js and why it\'s a great choice for building modern web applications.',
        published: true,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        authorId: adminUser.id,
        categoryId: techCategory.id,
      },
    })

    const post3 = await prisma.post.create({
      data: {
        title: 'Building a Blog with Prisma and SQLite',
        slug: 'building-blog-prisma-sqlite',
        content: `
          <h2>Database Setup</h2>
          <p>In this post, I'll walk you through setting up a blog database using Prisma and SQLite.</p>
          
          <h3>Why Prisma?</h3>
          <p>Prisma is a modern database toolkit that makes database access easy with:</p>
          <ul>
            <li>Type-safe database client</li>
            <li>Powerful migration system</li>
            <li>Intuitive data modeling</li>
          </ul>

          <h3>Database Schema</h3>
          <p>Our blog needs the following models:</p>
          <ul>
            <li>User - for authors and admins</li>
            <li>Post - for blog posts</li>
            <li>Category - for organizing posts</li>
            <li>Comment - for user engagement</li>
          </ul>

          <p>This creates a flexible and scalable blog structure.</p>
        `,
        excerpt: 'A comprehensive guide to setting up a blog database with Prisma and SQLite.',
        published: false, // Draft post
        authorId: adminUser.id,
        categoryId: techCategory.id,
      },
    })

    console.log('✅ Sample posts created')

    // Create sample comments
    await prisma.comment.create({
      data: {
        content: 'Great post! Looking forward to reading more.',
        authorId: adminUser.id,
        postId: post1.id,
      },
    })

    await prisma.comment.create({
      data: {
        content: 'Very helpful tutorial. Thanks for sharing!',
        authorId: adminUser.id,
        postId: post2.id,
      },
    })

    console.log('✅ Sample comments created')
    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('📧 Admin login credentials:')
    console.log('Email: admin@blog.com')
    console.log('Password: password123')
    console.log('')
    console.log('🚀 You can now start the development server with: npm run dev')

  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      console.log('⚠️  Database already seeded. Skipping...')
    } else {
      throw error
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })