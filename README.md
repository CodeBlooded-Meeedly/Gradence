# Gradence - Anonymous Subject Voting System

A modern, real-time anonymous subject voting and leaderboard web application for universities. Built with React, TypeScript, Vite, Supabase, and Tailwind CSS.

## 🎯 Features

- **Anonymous Voting**: Vote on university subjects with emoji-based feedback 
- **Real-time Leaderboard**: Live updates showing top-voted subjects with infinite carousel
- **Interactive Charts**: Comprehensive analytics including:
  - Vote distribution charts
  - Hourly activity patterns
  - Subject improvement tracking
  - Top subjects visualization
- **Smart Filtering**: Filter by university and major
- **Duplicate Prevention**: One vote per user per subject
- **Modern UI**: Dark theme with responsive design
- **Real-time Updates**: Live data synchronization via Supabase
- **TypeScript**: Full type safety throughout the application

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Backend**: Supabase (PostgreSQL, Real-time subscriptions)
- **Charts**: Recharts
- **Deployment**: Netlify
- **Package Manager**: npm


## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/your-organization/gradence.git
cd gradence
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your [Supabase project dashboard](https://app.supabase.com/).

### 4. Database Setup
Run the SQL setup scripts in your Supabase SQL editor:
- `supabase-setup.sql` - Initial database schema
- `add-vote-weight.sql` - Vote weighting functions
- `complete-leaderboard-functions.sql` - Leaderboard functions

### 5. Run Locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

## 🚀 Deployment

### Deploy to Netlify
1. **Push your code to GitHub**
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click **New site from Git** and import your repository
4. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy site**

Netlify will automatically deploy on every push to your main branch.

### Custom Domain
Add a custom domain in your Netlify site settings if desired.

## 📁 Project Structure
```
Gradence/
├── src/
│   ├── components/
│   │   ├── charts/           # Chart components (Recharts)
│   │   ├── Leaderboard.tsx   # Real-time leaderboard
│   │   ├── SubjectCard.tsx   # Subject voting cards
│   │   ├── ShareButton.tsx   # Social sharing
│   │   └── SpinWheel.tsx     # Interactive wheel
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client & types
│   │   ├── userUtils.ts      # User management
│   │   └── styleUtils.ts     # Styling utilities
│   ├── App.tsx               # Main application
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── sql/                      # Database setup scripts
├── package.json              # Dependencies & scripts
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind CSS config
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Schema
The application uses the following main tables:
- `subjects` - University subjects with metadata
- `votes` - User votes with timestamps
- `universities` - University information
- `majors` - Academic majors

### Key Features Implementation
- **Real-time Updates**: Uses Supabase real-time subscriptions
- **Vote Weighting**: Implements weighted voting system
- **Duplicate Prevention**: Database constraints prevent multiple votes
- **Infinite Carousel**: Smooth looping leaderboard display

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally (`npm run dev`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues
- **Build errors**: Run `npm run build` locally to debug
- **Supabase connection**: Verify environment variables and project settings
- **TypeScript errors**: Ensure all dependencies are installed
- **Real-time not working**: Check Supabase real-time settings

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous public key

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) for fast development
- Powered by [Supabase](https://supabase.com/) for backend services
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Recharts](https://recharts.org/)

---

**Gradence** - Making subject voting anonymous, engaging, and insightful for university communities.
