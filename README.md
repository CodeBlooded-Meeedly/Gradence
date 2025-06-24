# Anonymous Subject Voter

A modern, anonymous subject voting and leaderboard web app for universities. Built with React, Vite, Supabase, and Recharts.

## Features
- **Anonymous voting** on university subjects with emoji-based feedback
- **Live leaderboard** with real-time updates
- **Time-series charts**: vote trends, activity, improvements, and more
- **University and major filtering**
- **Dark, modern UI**
- **Supabase backend** for authentication and data
- **Automatic deployment** via Vercel + GitHub

## Screenshots
> _Add screenshots here if desired_

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/Gradence
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the `Gradence` directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Get these values from your [Supabase project dashboard](https://app.supabase.com/).

### 4. Run Locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

### Deploy to Vercel (Recommended)
1. **Push your code to GitHub**
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **New Project** and import your repo
4. Set **Root Directory** to `Gradence`
5. Set **Build Command** to `npm run build` and **Output Directory** to `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Deploy**

Vercel will auto-deploy on every push to your main branch.

### Custom Domain
Add a custom domain in your Vercel project settings if desired.

## Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key

## Project Structure
```
Gradence/
  src/
    components/    # React components (charts, leaderboard, voting, etc)
    lib/           # Supabase and utility functions
    assets/        # Static assets
    App.tsx        # Main app
    main.tsx       # Entry point
  public/          # Static files
  package.json     # Project config
  vite.config.ts   # Vite config
  tailwind.config.js # Tailwind CSS config
```

## Updating & Contributing
1. Make changes in your local branch
2. Test locally (`npm run dev`)
3. Commit and push to GitHub
4. Vercel will auto-deploy your changes

## Troubleshooting
- **Build errors**: Run `npm run build` locally to debug
- **Lint errors**: Run `npm run lint` (see notes below)
- **Supabase errors**: Check your environment variables and Supabase project settings

### Linting Notes
You may see `no-undef` errors for browser globals (like `window`, `localStorage`, etc.) in ESLint. These are safe to ignore for a Vite/React project.

## License
MIT

---

_This project was bootstrapped with Vite + React + Supabase._
