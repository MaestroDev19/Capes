# Capes - Fandom Social Platform

A modern social platform built for fandoms and communities, featuring event discovery, RSVP management, and community building tools.

## 🚀 Features

- **Twitch OAuth Authentication** - Secure login with Twitch social authentication
- **Event Discovery** - Browse and discover events from external APIs
- **RSVP Management** - Join events and manage your RSVPs
- **Community Building** - Create and join fandom communities
- **Modern UI** - Built with shadcn/ui and Tailwind CSS
- **Type Safety** - Full TypeScript support throughout
- **Real-time Updates** - Live notifications and updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth with Twitch OAuth
- **Database**: Supabase (PostgreSQL)
- **Package Manager**: Bun
- **Icons**: Lucide React

## 📋 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Node.js](https://nodejs.org/) 18+ (if not using Bun)
- [Supabase](https://supabase.com/) account
- [Twitch Developer](https://dev.twitch.tv/) account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd capes
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Twitch OAuth
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret

# Optional: Site URL for OAuth redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Supabase Setup

1. Create a new project in [Supabase](https://supabase.com/)
2. Go to Authentication > Providers
3. Enable Twitch provider and add your Twitch credentials
4. Add redirect URL: `http://localhost:3000/auth/callback`
5. Create a `profiles` table with the following schema:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  fandoms JSONB,
  interests JSONB,
  country TEXT,
  event_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### 5. Twitch OAuth Setup

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Create a new application
3. Set OAuth Redirect URL to: `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to your `.env.local`

### 6. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
capes/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication routes
│   │   └── callback/      # OAuth callback handler
│   ├── error/             # Error pages
│   ├── login/             # Login page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── dialog.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── use-toast.ts
├── lib/                   # Utility libraries
│   ├── providers.tsx      # Theme and toast providers
│   └── utils.ts          # Utility functions
├── supabase/             # Supabase client configuration
│   ├── client.ts         # Browser client
│   ├── server.ts         # Server client
│   └── middleware.ts     # Middleware client
├── auth/                 # Legacy auth routes (to be removed)
├── middleware.ts         # Next.js middleware
├── data-types.ts         # TypeScript type definitions
├── components.json       # shadcn/ui configuration
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## 🎨 UI Components

The project uses shadcn/ui components with custom theming:

- **Button** - Various variants and sizes
- **Input** - Form input fields
- **Label** - Form labels
- **Select** - Dropdown selections
- **Dialog** - Modal dialogs
- **Toast** - Notification system

## 🔐 Authentication Flow

1. User clicks "Continue with Twitch" on login page
2. Server action redirects to Twitch OAuth
3. User authenticates with Twitch
4. Twitch redirects back to `/auth/callback`
5. Callback handler exchanges code for session
6. User is redirected to home page with active session

## 🗄️ Database Schema

### Profiles Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users |
| username | TEXT | Unique username |
| full_name | TEXT | Display name |
| avatar_url | TEXT | Profile picture URL |
| bio | TEXT | User biography |
| fandoms | JSONB | Array of fandom data |
| interests | JSONB | Array of interest data |
| country | TEXT | User's country |
| event_count | INTEGER | Number of events attended |
| created_at | TIMESTAMPTZ | Account creation time |
| updated_at | TIMESTAMPTZ | Last update time |

### JSONB Data Types

```typescript
interface FandomData {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  category?: string;
  popularity?: number;
  created_at?: string;
}

interface InterestData {
  id: string;
  name: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  created_at?: string;
}
```

## 🚀 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server

# Code Quality
bun run lint         # Run ESLint
bun run lint:fix     # Run ESLint with auto-fix
bun run type-check   # Run TypeScript type checking
```

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS v4 with custom theme configuration in `app/globals.css`. The theme includes:

- Light and dark mode support
- Custom color palette
- Typography settings
- Component-specific styling

### ESLint

ESLint is configured with Next.js and TypeScript rules. Configuration is in `eslint.config.mjs`.

### Supabase

Supabase clients are configured for different environments:

- **Browser Client**: For client-side operations
- **Server Client**: For server-side operations
- **Middleware Client**: For middleware operations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for authentication and database
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Bun](https://bun.sh/) for fast package management

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ for the fandom community