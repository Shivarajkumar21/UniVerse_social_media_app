# UniVerse - Next-Gen Social Media Platform

[![Next.js](https://img.shields.io/badge/Next.js-13.4.19-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.2.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24.5-000000?style=for-the-badge)](https://next-auth.js.org/)

UniVerse is a modern, full-stack social media platform built with Next.js 13+ and TypeScript. It offers a rich set of features including real-time chat, community building, event management, and content sharing in a clean, responsive interface.

## ✨ Features

- **Modern Authentication** - Secure sign-in with email/password and social providers
- **Real-time Chat** - Instant messaging with WebSocket support
- **Communities** - Create and join interest-based communities
- **Event Management** - Create, join, and manage events with calendar integration
- **Rich Media Posts** - Share text, images, and videos with emoji support
- **Responsive Design** - Fully responsive layout for all devices
- **Dark/Light Mode** - Built-in theme support
- **Admin Dashboard** - Comprehensive admin interface for content moderation

## 🚀 Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Realtime**: Pusher
- **File Storage**: AWS S3
- **Deployment**: Vercel (recommended)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or pnpm
- PostgreSQL database
- AWS S3 bucket (for file uploads)
- Pusher account (for realtime features)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/universe.git
   cd universe
   ```

2. Install dependencies
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables in `.env.local` with your configuration.

4. Set up the database
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/universe](https://github.com/yourusername/universe)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)

