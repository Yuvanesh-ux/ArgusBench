# TaskFlow - Team Task Management Platform

TaskFlow is a modern, full-stack team task management platform built with React and Node.js. It provides comprehensive project and task management capabilities with real-time collaboration features.

## Features

- **User Authentication** - Secure login with JWT tokens and OAuth integration
- **Project Management** - Create and manage projects with team collaboration
- **Task Management** - Full CRUD operations with priority, status, and assignment tracking
- **Real-time Updates** - WebSocket-powered live updates and notifications
- **File Management** - Upload, organize, and share project files
- **AI Assistant** - Integrated AI help for task planning and productivity
- **Team Collaboration** - User roles, permissions, and activity tracking

## Technology Stack

### Frontend
- React 18.2+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- React Query for state management

### Backend
- Node.js 18+ with Express
- TypeScript for type safety
- PostgreSQL database
- Redis for caching and sessions
- Socket.io for real-time features

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow
```

2. Start development environment:
```bash
docker-compose up -d
npm run dev:setup
```

3. Run the application:
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
taskflow/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── database/          # Database schemas and migrations
├── docs/              # Project documentation
├── scripts/           # Build and deployment scripts
└── .github/           # CI/CD workflows
```

## API Documentation

Comprehensive API documentation is available at `/docs/API.md` when running in development mode.

## Development

### Running Tests
```bash
npm run test            # Run all tests
npm run test:frontend   # Frontend tests only
npm run test:backend    # Backend tests only
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run format         # Format with Prettier
npm run type-check     # TypeScript validation
```

## Deployment

See `docs/DEPLOYMENT.md` for detailed production deployment instructions.

## License

This project is licensed under the MIT License.