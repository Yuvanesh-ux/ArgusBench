# TaskFlow Scripts

This directory contains utility scripts for managing the TaskFlow application.

## Available Scripts

### Development

- **`dev-setup.sh`** - One-time setup for development environment
  - Creates .env file from template
  - Installs all dependencies
  - Creates necessary directories
  - Starts database services
  - Builds the application

- **`start.sh`** - Start the development environment
  - Starts all Docker services
  - Waits for services to be ready
  - Shows helpful URLs and commands
  - Starts both frontend and backend in development mode

### Production

- **`build.sh`** - Build the application for production
  - Cleans previous builds
  - Installs dependencies
  - Builds both frontend and backend
  - Shows build artifacts location

- **`deploy.sh`** - Deploy to production
  - Runs tests before deployment
  - Builds production images
  - Starts production containers
  - Performs health checks

### Testing

- **`test.sh`** - Run all tests and checks
  - Starts test services
  - Runs backend tests
  - Runs frontend tests
  - Runs linting and type checking
  - Shows coverage reports

## Usage

### First Time Setup

```bash
# Run the development setup
./scripts/dev-setup.sh

# Start the application
./scripts/start.sh
```

### Daily Development

```bash
# Start the application (if services are stopped)
./scripts/start.sh

# Or use npm commands directly
npm run dev
```

### Testing

```bash
# Run all tests
./scripts/test.sh

# Or run specific tests
npm run test:frontend
npm run test:backend
```

### Production Deployment

```bash
# Deploy to production
./scripts/deploy.sh
```

## Environment Files

- `.env` - Development environment variables
- `.env.production` - Production environment variables (create from template)
- `.env.example` - Template for environment variables

## Notes

- All scripts should be run from the app directory
- Scripts check for prerequisites and provide helpful error messages
- Docker must be running for most scripts to work
- Scripts are designed to be idempotent (safe to run multiple times)