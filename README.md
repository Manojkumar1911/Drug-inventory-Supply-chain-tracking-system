
# Inventory Management System

## Features

- Complete inventory management solution for pharmaceutical companies
- Real-time alerts and notifications
- Transfer tracking between locations
- Analytics and reporting
- User management with role-based access control

## Setup

### Prerequisites
- Node.js (v16 or later)
- npm or bun package manager
- Supabase account (free tier works fine)

### Initial Setup

1. Clone the repository
2. Install dependencies with `npm install` or `bun install`
3. Create a `.env` file in the root directory based on `.env.example`
4. Create a Supabase project at [https://supabase.com](https://supabase.com)
5. Get your Supabase connection string and add it to the `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-SUPABASE-URL]:5432/postgres
   ```
6. Start the development server with `npm run dev` or `bun run dev`

### Database Setup

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Copy the complete schema from `src/server/schema.sql`
4. Paste it into the SQL Editor and run the script
5. This will create all required tables, triggers, and indexes

### Supabase Configuration

1. In your Supabase project settings, ensure the following are set up:
   - Database connection pooling is enabled
   - Authentication providers are configured
   - Row-Level Security (RLS) policies are in place
2. Copy your Supabase URL and Anon Key to use in the frontend application

## Running the Application

1. Start the backend server: `npm run server` or `bun run server`
2. Start the frontend development server: `npm run dev` or `bun run dev`
3. Access the application at http://localhost:5173

## Environment Variables

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment setting (development, production, etc.)

## Documentation

For more information on the API endpoints and available features, refer to the documentation in the `/docs` folder.
