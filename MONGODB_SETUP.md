# MongoDB Atlas Setup for Blog System

## Prerequisites
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster (free tier is sufficient for development)

## Setup Steps

### 1. Create Database and Collection
- Database name: `ai-education-portal`
- Collection name: `blogs` (will be created automatically)

### 2. Create Database User
1. Go to Database Access in your Atlas dashboard
2. Add a new database user with read/write permissions
3. Note down the username and password

### 3. Configure Network Access
1. Go to Network Access in your Atlas dashboard
2. Add your IP address or use `0.0.0.0/0` for development (less secure)

### 4. Get Connection String
1. Go to your cluster and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<dbname>` with your actual values

### 5. Environment Setup
Create a `.env.local` file in your project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-education-portal?retryWrites=true&w=majority
```

## Blog System Features

### API Endpoints
- `GET /api/blogs` - Fetch all published blogs
- `POST /api/blogs` - Create a new blog post
- `GET /api/blogs/[slug]` - Fetch a specific blog by slug
- `PUT /api/blogs/[slug]` - Update a blog post
- `DELETE /api/blogs/[slug]` - Delete a blog post

### Pages
- `/blog` - List all blog posts
- `/blog/new` - Create a new blog post with markdown editor
- `/blog/[slug]` - View individual blog post with rendered markdown

### Features
- Markdown editor with live preview
- Syntax highlighting for code blocks
- Tag system for categorization
- Responsive design
- SEO-friendly URLs with slugs
- Automatic timestamp tracking

## Usage
1. Navigate to `/blog` to view all posts
2. Click "Write New Post" to create content
3. Use markdown syntax for rich formatting
4. Posts are automatically published and visible immediately