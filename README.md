# ProbidAI - AI-Powered Proposal Generation Platform

ProbidAI is a sophisticated web application that helps professionals create high-quality proposals using artificial intelligence. Built with Next.js 14, TypeScript, and modern web technologies, it streamlines the proposal creation process and improves bid success rates.

Live Link: https://probid-ai.vercel.app

## Features

- **AI-Powered Proposal Generation**: Automatically generate professional proposals based on job requirements
- **Smart Proposal Scoring**: Get instant feedback on your proposals with AI-driven scoring
- **Portfolio Management**: Manage and showcase your work portfolio
- **Authentication**: Secure user authentication system
- **Responsive Dashboard**: Modern, responsive interface for managing proposals and jobs
- **Dark/Light Theme**: Built-in theme support for better user experience

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/probid-ai.git
cd probid-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the necessary environment variables:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=your-database-url

# AI Service (if applicable)
AI_API_KEY=your-ai-api-key
```

4. Initialize the database:
```bash
npm run db:push
# or
yarn db:push
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `/app` - Next.js app router pages and layouts
  - `/(app)` - Protected dashboard routes
  - `/(auth)` - Authentication routes
  - `/api` - API routes for proposals and jobs
- `/components` - Reusable React components
  - `/ui` - Shadcn UI components
  - `/layout` - Layout components
- `/db` - Database schema and migrations
- `/lib` - Utility functions and shared logic
- `/public` - Static assets

## Key Features Explained

### Proposal Generation
The AI-powered proposal generation system analyzes job requirements and creates tailored proposals based on your portfolio and experience. The system uses advanced AI models to understand job requirements and create compelling, personalized proposals.

### Portfolio Management
Users can manage their work history, skills, and past projects through an intuitive interface. This information is used to enhance proposal generation and showcase expertise to potential clients.

### Proposal Scoring
The AI scoring system evaluates proposals based on multiple criteria including:
- Relevance to job requirements
- Writing quality and clarity
- Technical accuracy
- Competitive positioning

## API Routes

- `/api/generate-proposal` - AI proposal generation endpoint
- `/api/score-proposal` - Proposal scoring endpoint
- `/api/portfolio` - Portfolio management endpoints
- `/api/job-post` - Job posting management endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Deployment

The application can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/yourusername/probid-ai)

---

Built with ❤️ using Next.js and AI
