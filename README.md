# NEST Admin Dashboard

This is the admin dashboard for NEST, an AI-powered online examination proctoring system. This repository contains the frontend code for the admin interface and the API routes for data management.

![NEST Architecture](./images/architecture/architecture-nest.webp)


## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS
- **State Management**: TanStack Query
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **UI Components**: shadcn/ui


## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ProctorAI/admin-dashboard.git
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=your_ml_service_url
```

4. Run the development server:
```bash
npm run dev
```

## API Routes

The dashboard includes several API routes for data management:

1. `/api/exams`
   - GET: Fetch all exams
   - POST: Create new exam

2. `/api/exams/[examId]`
   - GET: Fetch specific exam details
   - PUT: Update exam details
   - DELETE: Delete exam

3. `/api/exams/[examId]/students/[userId]`
   - GET: Fetch student exam data
   - PUT: Update student data

4. `/api/stats`
   - GET: Fetch dashboard statistics

5. `/api/users/[userId]`
   - GET: Fetch user details