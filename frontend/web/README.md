# Price Platform - Web Frontend

Modern, responsive web application built with Next.js 15 and React 19.

## 🎯 Features

- ✅ Server-side rendering (SSR)
- ✅ React Query for data fetching
- ✅ Tailwind CSS for styling
- ✅ TypeScript for type safety
- ✅ Zustand for state management
- ✅ React Hook Form for forms
- ✅ Responsive design
- ✅ SEO optimized

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Visit http://localhost:3001

## 📁 Project Structure

```
src/
├── app/                 # Next.js 15 App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── home/           # Homepage components
│   ├── product/        # Product components
│   ├── search/         # Search components
│   └── ui/             # UI components
├── lib/                # Utilities
│   ├── api.ts          # API client
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
└── types/              # TypeScript types
```

## 🎨 Pages

- `/` - Homepage
- `/products` - Product listing
- `/products/[slug]` - Product detail
- `/search` - Search results
- `/categories/[slug]` - Category page
- `/login` - Login
- `/register` - Register
- `/dashboard` - User dashboard
- `/dashboard/cashback` - Cashback tracking
- `/dashboard/favorites` - Favorite products
- `/dashboard/alerts` - Price alerts

## 🔧 Tech Stack

- **Framework:** Next.js 15
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Data Fetching:** TanStack Query
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts

## 📦 Build

```bash
npm run build
npm start
```

## 📄 License

Proprietary - Price Platform
