# Blog Website with Admin Panel

A modern, full-featured blog website built with Next.js, featuring a complete admin panel for content management.

## ✨ Features

### Public Blog
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **Blog Posts**: Full-featured blog posts with rich content support
- **Categories**: Organize posts by categories
- **Comments**: Reader engagement with comment system
- **SEO Optimized**: Server-side rendering for better search engine visibility

### Admin Panel
- **Dashboard**: Overview of blog statistics and quick actions
- **Post Management**: Create, edit, delete, and publish/unpublish posts
- **Category Management**: Organize content with categories
- **User Authentication**: Secure admin access with JWT tokens
- **Rich Editor**: HTML support for post content formatting

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Prisma**: Modern database toolkit with SQLite
- **Authentication**: Secure login system with password hashing
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   cd blog-website
   npm install
   ```

2. **Setup the database:**
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Blog: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### Default Admin Credentials
- **Email**: admin@blog.com
- **Password**: password123

## 📁 Project Structure

```
blog-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── login/             # Authentication pages
│   │   └── posts/             # Public blog pages
│   ├── components/            # Reusable components
│   │   └── ui/                # UI components
│   └── lib/                   # Utilities and configurations
│       ├── auth.ts            # Authentication utilities
│       ├── prisma.ts          # Database client
│       ├── utils.ts           # Helper functions
│       └── seed.ts            # Database seeding
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint

## 📊 Database Schema

The blog uses the following main models:

- **User**: Admin users and authors
- **Post**: Blog posts with content, metadata, and publishing status
- **Category**: Post categories for organization
- **Comment**: Reader comments on posts
- **Tag**: Post tags (many-to-many relationship)

## 🔐 Authentication

The application uses a custom JWT-based authentication system:

- **Secure Password Hashing**: bcryptjs for password security
- **JWT Tokens**: Stateless authentication with HTTP-only cookies
- **Role-based Access**: Admin-only access to management features
- **Protected Routes**: Middleware protection for admin areas

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Design System**: Consistent color scheme and typography
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for easy theme switching

## 📝 Content Management

### Creating Posts
1. Login to admin panel at `/admin`
2. Click "New Post" or navigate to `/admin/posts/new`
3. Fill in title, content, excerpt, and category
4. Save as draft or publish immediately

### Managing Categories
1. Navigate to `/admin/categories`
2. Create new categories or manage existing ones
3. Categories automatically appear in the public blog sidebar

## 🚀 Deployment

### Environment Variables
Create a `.env` file with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://yourdomain.com"
JWT_SECRET="your-jwt-secret-here"
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

**Happy Blogging! 🎉**
