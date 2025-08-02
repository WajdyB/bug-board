# Bug Board 🐛

A fullstack web application for submitting and managing bug reports and feature ideas. Built with Next.js, Prisma, and PostgreSQL.

## Features

- 📝 **Anonymous Submissions** - Submit ideas without registration using UUID tracking
- 👍 **Voting System** - Upvote ideas (one vote per user per idea)
- 💬 **Comments** - Discuss ideas with the community
- 🔍 **Search & Filter** - Find ideas by keywords and tags
- 🏷️ **Tag System** - Organize ideas with customizable tags
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Optimistic UI updates for better UX

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Styling**: Tailwind CSS with shadcn/ui components
- **Anonymous Users**: UUID + localStorage

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

git clone <repository-url>
cd bug-board

2. Install dependencies:

npm install

3. Set up your environment variables:

cp .env.example .env

Add your PostgreSQL connection string to `.env`:

DATABASE_URL="postgresql://username:password@localhost:5432/bugboard"

4. Set up the database:

npx prisma db push
npx prisma generate


5. (Optional) Seed the database with sample data:

npm run db:seed

6. Start the development server:

npm run dev

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses three main models:

- **Idea**: Stores bug reports and feature ideas
- **Vote**: Tracks user votes on ideas (one vote per user per idea)
- **Comment**: Stores comments on ideas

## Project Structure

\`\`\`
bug-board/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── idea/[id]/         # Idea detail pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── header.tsx
│   ├── idea-card.tsx
│   ├── submit-form.tsx
│   ├── comment-section.tsx
│   └── filters.tsx
├── lib/                   # Utilities
│   ├── prisma.ts         # Database client
│   ├── uuid.ts           # Anonymous user management
│   ├── validations.ts    # Zod schemas
│   └── hooks.ts          # Custom React hooks
├── prisma/               # Database schema
└── scripts/              # Database scripts
\`\`\`

## API Endpoints

- `GET /api/ideas` - Fetch all ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/[id]` - Fetch specific idea
- `POST /api/votes` - Toggle vote on idea
- `POST /api/comments` - Add comment to idea

## Features in Detail

### Anonymous User System
- Uses UUID stored in localStorage to track anonymous users
- Prevents duplicate votes while maintaining privacy
- No registration required

### Voting System
- One vote per user per idea
- Optimistic UI updates for instant feedback
- Vote counts update in real-time

### Search & Filtering
- Search by keywords in title and description
- Filter by multiple tags
- Sort by newest or most upvoted

### Dark Mode
- System preference detection
- Manual toggle with localStorage persistence
- Smooth transitions between themes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
