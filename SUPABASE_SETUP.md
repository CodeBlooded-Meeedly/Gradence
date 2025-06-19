# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be ready (this may take a few minutes)

## Step 2: Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` into the editor
4. Run the SQL script to create your tables and policies

## Step 3: Get Your API Keys

1. In your Supabase dashboard, go to Settings → API
2. Copy your Project URL and anon/public key

## Step 4: Configure Environment Variables

Create a `.env` file in the root of your project with:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase project URL and anon key.

## Step 5: Test Your Setup

1. Run `npm run dev` to start the development server
2. Open your browser and navigate to the app
3. You should see the subjects loaded from your Supabase database

## Database Schema

### Subjects Table
- `id`: UUID (Primary Key)
- `name`: TEXT (Unique)
- `description`: TEXT (Optional)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Votes Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Anonymous user identifier)
- `subject_id`: UUID (Foreign Key to subjects)
- `vote_value`: INTEGER (1-5)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Constraints
- UNIQUE(user_id, subject_id) - Prevents duplicate votes
- CHECK(vote_value >= 1 AND vote_value <= 5) - Validates vote range

### Row Level Security (RLS)
- Subjects: Readable by everyone, insertable by authenticated users
- Votes: Users can only read, insert, and update their own votes

## Features

✅ Anonymous voting with UUID-based user identification
✅ Local storage to prevent duplicate votes
✅ Real-time Cool-o-Meter with color-coded progress bars
✅ Vote statistics and distribution
✅ Responsive design with Tailwind CSS
✅ TypeScript support with full type safety 