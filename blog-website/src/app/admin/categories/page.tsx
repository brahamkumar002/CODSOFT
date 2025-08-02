'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2, FolderOpen } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

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
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    setCreating(true)
    setError('')

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.trim(),
        }),
      })

      if (response.ok) {
        const category = await response.json()
        setCategories([...categories, { ...category, _count: { posts: 0 } }])
        setNewCategory('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create category')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    if (category._count.posts > 0) {
      if (!confirm(`This category has ${category._count.posts} posts. Deleting it will remove the category from those posts. Are you sure?`)) {
        return
      }
    } else {
      if (!confirm('Are you sure you want to delete this category?')) {
        return
      }
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== categoryId))
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Categories</h1>
              <p className="text-muted-foreground">Organize your blog posts with categories</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Create New Category */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Category</h2>
          <form onSubmit={handleCreate} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name..."
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                disabled={creating}
              />
              {error && (
                <p className="text-destructive text-sm mt-1">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={creating || !newCategory.trim()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-card border rounded-lg">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-foreground">All Categories</h2>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="animate-pulse flex-1">
                      <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/6"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-8 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No categories yet</h3>
              <p className="text-muted-foreground">
                Create your first category to start organizing your blog posts.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div key={category.id} className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category._count.posts} {category._count.posts === 1 ? 'post' : 'posts'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/categories/${category.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">About Categories</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Categories help organize your blog posts by topic</li>
            <li>• Each post can belong to one category</li>
            <li>• Categories are automatically displayed on your blog homepage</li>
            <li>• Readers can filter posts by category</li>
          </ul>
        </div>
      </div>
    </div>
  )
}