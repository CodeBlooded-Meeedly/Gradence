# Gradence: Anonymous Subject Voter

[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green?style=for-the-badge&logo=supabase)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**Gradence** is a real-time, anonymous voting application designed to gather honest feedback about educational subjects. Built with modern technologies, it provides a seamless and engaging experience for users to rate subjects and view live leaderboard statistics.

This application was developed as part of the **Global Summer Challenge** organized by **Meeedly**.

![App Screenshot](https://i.imgur.com/your-screenshot.png) <!-- Replace with your screenshot -->

---

## 🚀 Key Features

### Core Functionality
- **Anonymous Voting**: Users can vote without creating an account, identified by a unique UUID stored in `localStorage`.
- **Fingerprint-Based Security**: Uses FingerprintJS for enhanced security to prevent vote manipulation.
- **Real-time Leaderboard**: Data updates automatically when new votes are cast, powered by Supabase Realtime subscriptions.
- **Comprehensive SQL Functions**: All business logic is handled by robust PostgreSQL functions in the database.
- **PST Timezone Handling**: All time-based calculations are performed in PST for consistency.

### Live Analytics & Charts
- **Interactive Chart Gallery**: A dedicated gallery to explore all 7 chart types.
- **Vote Trends**: 7-day line chart showing voting patterns for each emoji category.
- **Hourly Activity**: Bar chart of today's voting activity by the hour.
- **Top Subjects**: Horizontal bar chart ranking subjects by rating or vote count.
- **Vote Distribution**: Pie chart showing the percentage breakdown of vote types.
- **Weekly Trending**: Combo chart showing weekly votes and average ratings.
- **Most Improved**: Horizontal bar chart showing subjects with the biggest rating improvements.

### User Interface
- **Modern Dark Theme**: A sleek, dark UI with red accents and glass morphism effects.
- **Responsive Design**: Fully responsive layout for both desktop and mobile devices.
- **Engaging Animations**: Smooth transitions and micro-interactions throughout the app.
- **Social Sharing**: A beautiful, animated share button with options for WhatsApp, Facebook, Instagram, and Email.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Backend**: Supabase (PostgreSQL, Realtime, Auth)
- **Styling**: Tailwind CSS
- **Charting**: Recharts
- **Security**: FingerprintJS
- **Deployment**: Vercel / Netlify / etc.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gradence.git
cd gradence
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create Supabase Project
1.  Go to [supabase.com](https://supabase.com) and create a new project.
2.  Wait for your project to be ready.

#### Set Up the Database
1.  Navigate to the **SQL Editor** in your Supabase project dashboard.
2.  Copy the entire content of `complete-leaderboard-functions.sql` and run it. This will create all necessary tables, functions, and policies.
3.  Next, copy the content of `update-subjects.sql` and run it to populate the subjects.

### 4. Configure Environment Variables
1.  In your Supabase dashboard, go to **Settings → API**.
2.  Copy your **Project URL** and **anon/public key**.
3.  Create a `.env` file in the root of the project and add the following:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Run the Application
```bash
npm run dev
```
The application should now be running on `http://localhost:5173`.

---

## 🗃️ Database Schema

### `subjects` Table
| Column       | Type                       | Description                  |
|--------------|----------------------------|------------------------------|
| `id`         | `UUID` (Primary Key)       | Unique identifier for subject|
| `name`       | `TEXT` (Unique)            | Name of the subject          |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Timestamp of creation        |

### `votes` Table
| Column          | Type                       | Description                                |
|-----------------|----------------------------|--------------------------------------------|
| `id`            | `UUID` (Primary Key)       | Unique identifier for vote                 |
| `user_id`       | `UUID`                     | Anonymous user identifier (from localStorage)|
| `subject_id`    | `UUID` (Foreign Key)       | References `subjects.id`                   |
| `vote_value`    | `INTEGER`                  | Vote value from -2 to +2                   |
- **-2**: 💀 Way too hard
- **-1**: 😴 Too boring
- **+1**: ❤️ Loved the subject
- **+2**: 🔥 Super fun
| `fingerprint_id`| `TEXT`                     | Browser fingerprint ID from FingerprintJS  |
| `created_at`    | `TIMESTAMP WITH TIME ZONE` | Timestamp of vote creation (in UTC)        |
| **Constraint**  | `UNIQUE(subject_id, user_id, fingerprint_id)` | Prevents duplicate votes.                |


---

## 📄 SQL Scripts

- **`add-fingerprint.sql`**: Adds the `fingerprint_id` column and unique constraint to the `votes` table.
- **`complete-leaderboard-functions.sql`**: A single file to drop and recreate all leaderboard-related SQL functions. This is the main file to use for database setup.
- **`update-subjects.sql`**: Clears and repopulates the `subjects` table with a new list of courses.

---

## 🎨 Design & UI

The UI is designed to be modern, intuitive, and visually appealing. Key design elements include:

- **Glass Morphism**: Used for card and chart backgrounds.
- **Consistent Color Palette**: A dark theme with red as the primary accent color.
- **Custom Fonts**: `Inter` for body text and a serif font for display headings.
- **Micro-interactions**: Subtle animations and hover effects provide a polished user experience.

This `README.md` provides a comprehensive overview of the Gradence application. For more specific details, please refer to the source code and comments within the project.
