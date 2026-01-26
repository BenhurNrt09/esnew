# ESNew - Next.js 14 + Supabase Listing Platform

Professional listing/profile platform with monorepo architecture.

## 🏗️ Project Structure

```
esnew/
├── apps/
│   ├── web/          # Public website
│   └── admin/        # Admin panel
├── packages/
│   ├── ui/           # Shared UI components
│   ├── lib/          # Supabase client & utilities
│   └── types/        # TypeScript types
└── supabase/
    └── migrations/   # Database migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run database migrations in Supabase SQL editor:
```bash
# Copy content from supabase/migrations/*.sql
# Run them in order in your Supabase dashboard
```

4. Start development servers:
```bash
# All apps
npm run dev

# Individual apps
npm run dev:web    # Web app on http://localhost:3000
npm run dev:admin  # Admin panel on http://localhost:3001
```

## 📦 Workspaces

- **apps/web**: Public-facing website with listing pages
- **apps/admin**: Admin panel for content management
- **packages/ui**: Shared shadcn/ui components
- **packages/lib**: Supabase client and auth helpers
- **packages/types**: TypeScript definitions

## 🗄️ Database

Run migrations in this order:
1. `001_initial_schema.sql` - Create tables
2. `002_rls_policies.sql` - Set up Row Level Security
3. `003_storage_buckets.sql` - Configure image storage
4. `004_seed_data.sql` - Sample data (optional)

## 🔐 Admin Access

First admin user must be created manually:
1. Sign up in Supabase Auth
2. Update user role in database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## 🚧 Development

- TypeScript strict mode enabled
- ESLint configured
- Tailwind CSS for styling
- shadcn/ui component library

## 📝 License

MIT
