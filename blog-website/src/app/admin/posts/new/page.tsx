'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye } from 'lucide-react'

interface Category {
  id: string
  name: string
}

export default function NewPost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    published: false,
    featuredImage: '',
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published: publish,
          categoryId: formData.categoryId || null,
        }),
      })

      if (response.ok) {
        router.push('/admin/posts')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create post')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/posts">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Posts
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create New Post</h1>
                <p className="text-muted-foreground">Write and publish your blog post</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading || !formData.title || !formData.content}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading || !formData.title || !formData.content}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-lg border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Enter your post title..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Brief description of your post (optional)..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be shown on the blog homepage and in search results.
            </p>
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-foreground mb-2">
              Featured Image URL
            </label>
            <input
              id="featuredImage"
              name="featuredImage"
              type="url"
              value={formData.featuredImage}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                No categories available.{' '}
                <Link href="/admin/categories" className="text-primary hover:underline">
                  Create one first
                </Link>
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={20}
              className="w-full px-4 py-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y font-mono text-sm"
              placeholder="Write your post content here... You can use HTML tags for formatting."
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
            </p>
          </div>

          {/* Mobile Save Buttons */}
          <div className="flex gap-4 sm:hidden">
            <Button
              variant="outline"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading || !formData.title || !formData.content}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading || !formData.title || !formData.content}
              className="flex-1 gap-2"
            >
              <Eye className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}