# TaskFlow Implementation Plan - testbed-web-app Branch

## Application Overview

**TaskFlow** is a modern team task management platform designed to simulate a real-world enterprise web application. It serves as a security scanning benchmark with 38 strategically placed vulnerabilities across OWASP Top 10, ML Top 10, and Agentic AI categories.

## Technology Stack Deep Dive

### Frontend Stack
- **React 18.2+** - Component-based UI with hooks and context
- **TypeScript 5.0+** - Type safety and developer experience
- **Vite 4.0+** - Fast build tool and development server
- **React Router v6** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **React Hook Form** - Form handling and validation
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **React Query** - Server state management and caching

### Backend Stack
- **Node.js 18+** - JavaScript runtime environment
- **Express.js 4.18+** - Web application framework
- **TypeScript 5.0+** - Type-safe backend development
- **PostgreSQL 15+** - Primary relational database
- **Redis 7+** - Session storage and caching
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Socket.io** - Real-time WebSocket communication
- **OpenAI API** - AI assistant integration
- **Joi** - Request validation

### Development & Infrastructure
- **Docker & Docker Compose** - Containerization
- **Jest + Supertest** - Testing framework
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hooks for quality gates
- **GitHub Actions** - CI/CD pipeline

## Detailed File Structure & Purpose

```
taskflow/
├── README.md                           # Project overview, setup guide, API documentation
├── package.json                        # Root workspace config, shared scripts, dev deps
├── .gitignore                         # Node.js, env files, logs, build artifacts
├── .env.example                       # Environment template (no secrets)
├── docker-compose.yml                 # Development environment setup
├── docker-compose.prod.yml            # Production deployment config
├── Dockerfile                         # Multi-stage production build
├── jest.config.js                     # Jest configuration for monorepo testing
├── tsconfig.json                      # Root TypeScript configuration
├── .eslintrc.json                     # ESLint rules for TS/React
├── .prettierrc                        # Code formatting configuration
├── .husky/                            # Git hooks directory
│   ├── pre-commit                     # Run linting before commit
│   └── pre-push                       # Run tests before push
│
├── frontend/
│   ├── package.json                   # React-specific dependencies and scripts
│   ├── vite.config.ts                 # Vite build configuration, proxy setup
│   ├── tsconfig.json                  # Frontend TypeScript configuration
│   ├── index.html                     # HTML template with meta tags
│   ├── tailwind.config.js             # Tailwind CSS customization
│   ├── postcss.config.js              # PostCSS configuration
│   ├── public/
│   │   ├── favicon.ico               # Application favicon
│   │   ├── manifest.json             # PWA manifest for mobile
│   │   ├── robots.txt                # SEO robots configuration
│   │   └── icons/                    # Various icon sizes for PWA
│   │       ├── icon-192.png          # Android icon
│   │       └── icon-512.png          # iOS icon
│   ├── src/
│   │   ├── main.tsx                  # React app entry point, providers setup
│   │   ├── App.tsx                   # Root component with routing configuration
│   │   ├── App.css                   # Global application styles
│   │   ├── index.css                 # Tailwind imports, CSS reset
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx     # Email/password login with validation
│   │   │   │   ├── RegisterForm.tsx  # User registration with terms acceptance
│   │   │   │   ├── ForgotPassword.tsx # Password reset request form
│   │   │   │   ├── ProtectedRoute.tsx # Route wrapper for authenticated pages
│   │   │   │   ├── OAuthButtons.tsx   # Google/GitHub OAuth integration
│   │   │   │   └── AuthProvider.tsx   # Authentication context provider
│   │   │   ├── tasks/
│   │   │   │   ├── TaskList.tsx      # Paginated task list with filters
│   │   │   │   ├── TaskCard.tsx      # Individual task display card
│   │   │   │   ├── TaskForm.tsx      # Create/edit task modal form
│   │   │   │   ├── TaskFilters.tsx   # Status, priority, assignee filters
│   │   │   │   ├── TaskComments.tsx  # Task discussion thread
│   │   │   │   ├── TaskAssignee.tsx  # User assignment dropdown
│   │   │   │   └── TaskProgress.tsx  # Visual progress indicator
│   │   │   ├── projects/
│   │   │   │   ├── ProjectList.tsx   # Grid view of user projects
│   │   │   │   ├── ProjectCard.tsx   # Project summary card
│   │   │   │   ├── ProjectForm.tsx   # Project creation/editing
│   │   │   │   └── ProjectMembers.tsx # Team member management
│   │   │   ├── files/
│   │   │   │   ├── FileUpload.tsx    # Drag-drop file upload component
│   │   │   │   ├── FileViewer.tsx    # File preview (images, PDFs, text)
│   │   │   │   ├── FileList.tsx      # File browser with actions
│   │   │   │   └── FileThumbnail.tsx # File type icon generator
│   │   │   ├── shared/
│   │   │   │   ├── Header.tsx        # Top navigation with user menu
│   │   │   │   ├── Sidebar.tsx       # Left navigation menu
│   │   │   │   ├── Footer.tsx        # Application footer
│   │   │   │   ├── LoadingSpinner.tsx # Animated loading indicator
│   │   │   │   ├── ErrorBoundary.tsx # React error boundary wrapper
│   │   │   │   ├── Modal.tsx         # Reusable modal dialog
│   │   │   │   ├── Button.tsx        # Styled button variants
│   │   │   │   ├── Input.tsx         # Form input with validation
│   │   │   │   ├── Textarea.tsx      # Multi-line text input
│   │   │   │   ├── Select.tsx        # Dropdown selection component
│   │   │   │   └── Notification.tsx  # Toast notification system
│   │   │   └── ai/
│   │   │       ├── AIAssistant.tsx   # Chat interface with OpenAI
│   │   │       ├── AIPromptInput.tsx # AI prompt input with suggestions
│   │   │       └── AIResponseDisplay.tsx # Formatted AI response viewer
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Main dashboard with metrics
│   │   │   ├── Login.tsx             # Login page layout
│   │   │   ├── Register.tsx          # Registration page layout
│   │   │   ├── Profile.tsx           # User profile management
│   │   │   ├── Projects.tsx          # Projects overview page
│   │   │   ├── ProjectDetail.tsx     # Individual project workspace
│   │   │   ├── Tasks.tsx             # Tasks management page
│   │   │   ├── Settings.tsx          # User preferences and config
│   │   │   ├── Team.tsx              # Team management interface
│   │   │   └── NotFound.tsx          # 404 error page
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Authentication state management
│   │   │   ├── useTasks.ts           # Task CRUD operations
│   │   │   ├── useProjects.ts        # Project management logic
│   │   │   ├── useApi.ts             # Generic API request hook
│   │   │   ├── useLocalStorage.ts    # Browser storage management
│   │   │   ├── useDebounce.ts        # Input debouncing for search
│   │   │   └── useWebSocket.ts       # Real-time connection management
│   │   ├── services/
│   │   │   ├── api.ts                # Axios instance with interceptors
│   │   │   ├── auth.ts               # Authentication API calls
│   │   │   ├── tasks.ts              # Task-related API endpoints
│   │   │   ├── projects.ts           # Project API interactions
│   │   │   ├── files.ts              # File upload/download handlers
│   │   │   ├── users.ts              # User management API
│   │   │   └── websocket.ts          # Socket.io client configuration
│   │   ├── utils/
│   │   │   ├── validation.ts         # Form validation schemas
│   │   │   ├── formatting.ts         # Date/text formatting helpers
│   │   │   ├── constants.ts          # Application constants
│   │   │   ├── storage.ts            # LocalStorage wrapper utilities
│   │   │   ├── permissions.ts        # Role-based access helpers
│   │   │   └── errorHandling.ts      # Error processing utilities
│   │   ├── types/
│   │   │   ├── auth.ts               # Authentication type definitions
│   │   │   ├── task.ts               # Task model interfaces
│   │   │   ├── project.ts            # Project structure types
│   │   │   ├── user.ts               # User profile types
│   │   │   ├── file.ts               # File metadata types
│   │   │   └── api.ts                # API response interfaces
│   │   └── __tests__/
│   │       ├── components/           # Component unit tests
│   │       ├── hooks/                # Custom hook tests
│   │       ├── services/             # API service tests
│   │       └── utils/                # Utility function tests
│   └── dist/                         # Vite build output (gitignored)
│
├── backend/
│   ├── package.json                  # Backend dependencies and scripts
│   ├── tsconfig.json                 # Backend TypeScript configuration
│   ├── nodemon.json                  # Development server settings
│   ├── src/
│   │   ├── server.ts                 # Express server initialization
│   │   ├── app.ts                    # Express app configuration, middleware setup
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Login, register, password reset
│   │   │   ├── taskController.ts     # CRUD operations for tasks
│   │   │   ├── projectController.ts  # Project management endpoints
│   │   │   ├── userController.ts     # User profile, team management
│   │   │   ├── fileController.ts     # File upload, download, metadata
│   │   │   ├── commentController.ts  # Task comments and discussions
│   │   │   ├── webhookController.ts  # Third-party webhook handlers
│   │   │   └── aiController.ts       # OpenAI integration endpoints
│   │   ├── routes/
│   │   │   ├── index.ts              # Route aggregation and mounting
│   │   │   ├── auth.ts               # Authentication route definitions
│   │   │   ├── tasks.ts              # Task management routes
│   │   │   ├── projects.ts           # Project-related routes
│   │   │   ├── users.ts              # User management routes
│   │   │   ├── files.ts              # File handling routes
│   │   │   ├── comments.ts           # Comment system routes
│   │   │   ├── webhooks.ts           # Webhook endpoint routes
│   │   │   └── ai.ts                 # AI assistant routes
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification middleware
│   │   │   ├── validation.ts         # Request schema validation
│   │   │   ├── errorHandler.ts       # Global error handling
│   │   │   ├── rateLimiter.ts        # API rate limiting
│   │   │   ├── security.ts           # Security headers (helmet)
│   │   │   ├── cors.ts               # Cross-origin configuration
│   │   │   ├── logging.ts            # Request/response logging
│   │   │   └── upload.ts             # Multer file upload config
│   │   ├── services/
│   │   │   ├── authService.ts        # Authentication business logic
│   │   │   ├── taskService.ts        # Task management operations
│   │   │   ├── projectService.ts     # Project business logic
│   │   │   ├── userService.ts        # User management operations
│   │   │   ├── fileService.ts        # File processing and storage
│   │   │   ├── commentService.ts     # Comment threading logic
│   │   │   ├── emailService.ts       # Email notification service
│   │   │   ├── notificationService.ts # Push notification handling
│   │   │   ├── searchService.ts      # Full-text search implementation
│   │   │   └── aiService.ts          # OpenAI API integration
│   │   ├── models/
│   │   │   ├── User.ts               # User data model and methods
│   │   │   ├── Task.ts               # Task model with relationships
│   │   │   ├── Project.ts            # Project model and permissions
│   │   │   ├── Comment.ts            # Comment threading model
│   │   │   ├── File.ts               # File metadata model
│   │   │   ├── Session.ts            # User session management
│   │   │   └── AuditLog.ts           # Activity audit logging
│   │   ├── database/
│   │   │   ├── connection.ts         # PostgreSQL connection setup
│   │   │   ├── query.ts              # Database query utilities
│   │   │   ├── migrations/
│   │   │   │   ├── 001_create_users.sql        # User table schema
│   │   │   │   ├── 002_create_projects.sql     # Project table schema
│   │   │   │   ├── 003_create_tasks.sql        # Task table with relations
│   │   │   │   ├── 004_create_comments.sql     # Comment threading table
│   │   │   │   ├── 005_create_files.sql        # File metadata table
│   │   │   │   └── 006_create_audit_logs.sql   # Audit trail table
│   │   │   └── seeds/
│   │   │       ├── users.sql         # Sample user accounts
│   │   │       ├── projects.sql      # Demo project data
│   │   │       └── tasks.sql         # Sample tasks and comments
│   │   ├── utils/
│   │   │   ├── crypto.ts             # Password hashing with bcrypt
│   │   │   ├── jwt.ts                # JWT token generation/verification
│   │   │   ├── logger.ts             # Winston logging configuration
│   │   │   ├── validation.ts         # Joi validation schemas
│   │   │   ├── email.ts              # Email template rendering
│   │   │   ├── fileUtils.ts          # File type validation, sizing
│   │   │   └── constants.ts          # Backend configuration constants
│   │   ├── types/
│   │   │   ├── express.d.ts          # Express Request/Response extensions
│   │   │   ├── database.ts           # Database query result types
│   │   │   └── jwt.ts                # JWT payload type definitions
│   │   └── __tests__/
│   │       ├── controllers/          # Controller endpoint tests
│   │       ├── services/             # Service layer unit tests
│   │       ├── middleware/           # Middleware functionality tests
│   │       ├── utils/                # Utility function tests
│   │       └── integration/          # End-to-end API tests
│   ├── uploads/                      # File storage directory (gitignored)
│   ├── logs/                         # Application log files (gitignored)
│   └── dist/                         # TypeScript compilation output
│
├── database/
│   ├── init.sql                      # Database initialization script
│   ├── schema.sql                    # Complete database schema
│   ├── seed-data.sql                 # Realistic test data
│   └── backup/
│       ├── backup.sh                 # PostgreSQL backup script
│       └── restore.sh                # Database restoration script
│
├── docs/
│   ├── API.md                        # OpenAPI specification
│   ├── DEPLOYMENT.md                 # Production deployment guide
│   ├── DEVELOPMENT.md                # Local development setup
│   └── ARCHITECTURE.md               # System design documentation
│
├── scripts/
│   ├── dev-setup.sh                  # Initialize development environment
│   ├── build.sh                      # Production build script
│   ├── test.sh                       # Run test suite
│   └── deploy.sh                     # Deployment automation
│
└── .github/
    └── workflows/
        ├── ci.yml                    # Continuous integration pipeline
        ├── deploy.yml                # Deployment automation
        └── security.yml              # Security scanning workflow
```

## Implementation Roadmap

### Phase 1: Project Foundation (Week 1)

#### 1.1 Repository Setup
- [ ] Initialize git repository on `testbed-web-app` branch
- [ ] Create complete directory structure
- [ ] Set up package.json files with dependencies
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Set up Docker development environment

#### 1.2 Database Design & Setup
- [ ] Design PostgreSQL schema for users, projects, tasks, files, comments
- [ ] Create database migration scripts
- [ ] Set up Redis for session storage
- [ ] Write seed data for realistic testing
- [ ] Configure database connection utilities

#### 1.3 Backend Foundation
- [ ] Express server setup with TypeScript
- [ ] Middleware stack configuration (CORS, security, logging)
- [ ] Database connection and query utilities
- [ ] Basic error handling and validation
- [ ] JWT authentication system

### Phase 2: Core Backend Implementation (Week 2)

#### 2.1 Authentication System
- [ ] User registration with email validation
- [ ] Login with JWT token generation
- [ ] Password reset functionality
- [ ] OAuth integration (Google/GitHub)
- [ ] Session management with Redis
- [ ] Role-based access control

#### 2.2 Core API Endpoints
- [ ] User management (profile, preferences)
- [ ] Project CRUD operations
- [ ] Task management with full lifecycle
- [ ] Comment system with threading
- [ ] File upload/download handling
- [ ] Search functionality

#### 2.3 Advanced Features
- [ ] Real-time WebSocket integration
- [ ] Email notification service
- [ ] AI assistant OpenAI integration
- [ ] Webhook handlers for integrations
- [ ] Audit logging system

### Phase 3: Frontend Implementation (Week 3)

#### 3.1 React Foundation
- [ ] Vite build configuration
- [ ] React Router setup with protected routes
- [ ] Authentication context provider
- [ ] Tailwind CSS styling system
- [ ] Component library structure

#### 3.2 Core Components
- [ ] Login/Register forms with validation
- [ ] Dashboard with metrics
- [ ] Task management interface
- [ ] Project workspace
- [ ] File upload/management
- [ ] User profile management

#### 3.3 Advanced UI Features
- [ ] Real-time updates with WebSocket
- [ ] AI assistant chat interface
- [ ] Notification system
- [ ] Mobile responsive design
- [ ] Loading states and error handling

### Phase 4: Integration & Testing (Week 4)

#### 4.1 System Integration
- [ ] Frontend-backend API integration
- [ ] Authentication flow testing
- [ ] File upload/download testing
- [ ] Real-time feature validation
- [ ] AI assistant integration testing

#### 4.2 Testing Implementation
- [ ] Unit tests for utilities and services
- [ ] Component testing with React Testing Library
- [ ] API endpoint integration tests
- [ ] End-to-end workflow testing
- [ ] Performance and load testing

#### 4.3 Production Readiness
- [ ] Docker production configuration
- [ ] Environment configuration
- [ ] Security hardening
- [ ] Documentation completion
- [ ] Deployment scripts

## Vulnerability Placement Strategy

### OWASP Top 10 Vulnerabilities (25 total)

#### A01 - Broken Access Control (4 vulnerabilities)

**WEB-A01-001: IDOR in Task Access**
- **Location**: `backend/src/routes/tasks.ts` - GET `/api/tasks/:id` endpoint
- **Vulnerability**: Direct task access without ownership verification
- **Implementation**: Remove authorization check, allow any user to access any task
- **Detection**: Easy (pattern-based)

**WEB-A01-002: Admin Privilege Escalation**
- **Location**: `backend/src/routes/auth.ts` - POST `/api/admin/users` endpoint
- **Vulnerability**: Weak token validation for admin operations
- **Implementation**: Check only token presence, not admin role
- **Detection**: Medium (context required)

**WEB-A01-003: Profile Access IDOR** 
- **Location**: `frontend/src/pages/Profile.tsx` - User profile component
- **Vulnerability**: Frontend allows viewing any user profile via URL manipulation
- **Implementation**: No authorization check on profile data fetching
- **Detection**: Easy (client-side)

**WEB-A01-004: File Download Path Traversal**
- **Location**: `backend/src/routes/files.ts` - GET `/api/files/download/:filename`
- **Vulnerability**: No path validation allows directory traversal
- **Implementation**: Direct file path concatenation without sanitization
- **Detection**: Easy (pattern-based)

#### A02 - Cryptographic Failures (3 vulnerabilities)

**WEB-A02-001: Hardcoded API Keys**
- **Location**: `frontend/src/utils/api.ts` - API configuration
- **Vulnerability**: Production API keys hardcoded in frontend bundle
- **Implementation**: Include OpenAI and Stripe keys directly in source
- **Detection**: Easy (static analysis)

**WEB-A02-002: Weak Password Hashing**
- **Location**: `backend/src/utils/crypto.ts` - Password hashing function
- **Vulnerability**: Using MD5 for password hashing
- **Implementation**: Replace bcrypt with MD5 hashing
- **Detection**: Easy (pattern matching)

**WEB-A02-003: Plaintext Sensitive Storage**
- **Location**: `backend/src/services/userService.ts` - User data storage
- **Vulnerability**: Sensitive data stored without encryption
- **Implementation**: Store SSN, credit cards in plaintext
- **Detection**: Medium (context required)

#### A03 - Injection (5 vulnerabilities)

**WEB-A03-001: SQL Injection in Search**
- **Location**: `backend/src/routes/tasks.ts` - GET `/api/tasks/search`
- **Vulnerability**: String concatenation in SQL query
- **Implementation**: Direct query string interpolation
- **Detection**: Easy (pattern-based)

**WEB-A03-002: XSS in Comments**
- **Location**: `frontend/src/components/tasks/TaskComments.tsx`
- **Vulnerability**: Unsanitized HTML rendering
- **Implementation**: Use `dangerouslySetInnerHTML` without sanitization
- **Detection**: Medium (requires context)

**WEB-A03-003: Command Injection in File Processing**
- **Location**: `backend/src/services/fileService.ts` - File processing
- **Vulnerability**: User input passed to shell commands
- **Implementation**: Direct filename passed to ImageMagick
- **Detection**: Medium (requires context)

**WEB-A03-004: NoSQL Injection**
- **Location**: `backend/src/routes/tasks.ts` - MongoDB query endpoint
- **Vulnerability**: User input in $where clause
- **Implementation**: Direct JavaScript injection in MongoDB query
- **Detection**: Hard (requires NoSQL knowledge)

**WEB-A03-005: Template Injection**
- **Location**: `backend/src/services/emailService.ts` - Email templates
- **Vulnerability**: User data in template without escaping
- **Implementation**: Handlebars template with user-controlled data
- **Detection**: Hard (requires template knowledge)

#### A04 - Insecure Design (2 vulnerabilities)

**WEB-A04-001: Password Reset Rate Limiting**
- **Location**: `backend/src/routes/auth.ts` - Password reset endpoint
- **Vulnerability**: No rate limiting on password reset
- **Implementation**: Allow unlimited reset requests
- **Detection**: Medium (business logic)

**WEB-A04-002: Insecure Password Reset Flow**
- **Location**: `backend/src/routes/auth.ts` - Password reset confirmation
- **Vulnerability**: Password changed before token validation
- **Implementation**: Reverse validation order
- **Detection**: Hard (business logic flaw)

#### A05 - Security Misconfiguration (3 vulnerabilities)

**WEB-A05-001: Exposed Environment Secrets**
- **Location**: `.env` - Environment configuration file
- **Vulnerability**: Production secrets in repository
- **Implementation**: Commit actual .env with real credentials
- **Detection**: Easy (file scanning)

**WEB-A05-002: Missing Security Headers**
- **Location**: `backend/src/app.ts` - Express configuration
- **Vulnerability**: No security headers, permissive CORS
- **Implementation**: Remove helmet, allow all CORS origins
- **Detection**: Easy (configuration scanning)

**WEB-A05-003: Directory Listing Enabled**
- **Location**: `backend/src/app.ts` - Static file serving
- **Vulnerability**: Upload directory browsing enabled
- **Implementation**: Enable directory listing for uploads
- **Detection**: Easy (configuration check)

#### A06 - Vulnerable Components (3 vulnerabilities)

**WEB-A06-001: Outdated React Version**
- **Location**: `frontend/package.json` - Dependencies
- **Vulnerability**: React version with known XSS vulnerabilities
- **Implementation**: Use React 17.0.1 with CVE-2021-44228
- **Detection**: Easy (dependency scanning)

**WEB-A06-002: Vulnerable NPM Packages**
- **Location**: `frontend/package.json` & `backend/package.json`
- **Vulnerability**: Multiple vulnerable dependencies
- **Implementation**: Include lodash 4.17.15, moment 2.24.0, etc.
- **Detection**: Easy (dependency scanning)

**WEB-A06-003: Insecure JWT Middleware**
- **Location**: `backend/src/middleware/auth.ts` - Authentication middleware
- **Vulnerability**: Hardcoded JWT secrets and weak configuration
- **Implementation**: Use weak secrets and insecure JWT settings
- **Detection**: Medium (configuration analysis)

#### A07 - Authentication Failures (3 vulnerabilities)

**WEB-A07-001: Weak Password Policy**
- **Location**: `backend/src/services/authService.ts` - Password validation
- **Vulnerability**: Minimal password requirements
- **Implementation**: Allow 4-character passwords
- **Detection**: Easy (policy checking)

**WEB-A07-002: Non-expiring Sessions**
- **Location**: `backend/src/utils/session.ts` - Session management
- **Vulnerability**: Sessions never expire
- **Implementation**: Set expiration to null
- **Detection**: Medium (session analysis)

**WEB-A07-003: Username Enumeration**
- **Location**: `backend/src/routes/auth.ts` - Login endpoint
- **Vulnerability**: Different error messages reveal valid usernames
- **Implementation**: Distinct errors for invalid user vs invalid password
- **Detection**: Medium (behavioral analysis)

#### A08 - Data Integrity Failures (1 vulnerability)

**WEB-A08-001: Insecure Deserialization**
- **Location**: `backend/src/routes/webhooks.ts` - Webhook handler
- **Vulnerability**: Unsafe deserialization with eval()
- **Implementation**: Parse JSON and pass to eval()
- **Detection**: Easy (dangerous function usage)

#### A09 - Logging Failures (1 vulnerability)

**WEB-A09-001: Sensitive Data in Logs**
- **Location**: `backend/src/utils/logger.ts` - Logging configuration
- **Vulnerability**: Passwords and sensitive data logged
- **Implementation**: Log full user objects including passwords
- **Detection**: Medium (log analysis required)

#### A10 - SSRF (2 vulnerabilities)

**WEB-A10-001: URL Fetch SSRF**
- **Location**: `backend/src/routes/webhooks.ts` - URL fetch endpoint
- **Vulnerability**: Unvalidated URL fetching
- **Implementation**: Direct fetch of user-provided URLs
- **Detection**: Medium (requires URL analysis)

**WEB-A10-002: Webhook SSRF**
- **Location**: `backend/src/routes/webhooks.ts` - Webhook notification
- **Vulnerability**: Webhook URL not validated
- **Implementation**: POST to user-provided webhook URLs
- **Detection**: Medium (requires request analysis)

### Agentic AI Top 10 Vulnerabilities (8 total)

#### AI Agent Vulnerabilities

**WEB-AG-001: Direct Prompt Injection**
- **Location**: `frontend/src/components/ai/AIAssistant.tsx`
- **Vulnerability**: User input directly concatenated to system prompt
- **Implementation**: No prompt sanitization or isolation
- **Detection**: Hard (requires AI context understanding)

**WEB-AG-002: AI Code Execution**
- **Location**: `backend/src/routes/ai.ts` - AI code generation endpoint
- **Vulnerability**: AI-generated code executed with eval()
- **Implementation**: Execute AI responses without validation
- **Detection**: Medium (dangerous function detection)

**WEB-AG-003: AI Data Leakage**
- **Location**: `backend/src/routes/ai.ts` - AI document summarization
- **Vulnerability**: AI responses contain sensitive training data
- **Implementation**: Return original content with AI summary
- **Detection**: Hard (requires AI behavior analysis)

**WEB-AG-004: Excessive AI Permissions**
- **Location**: `backend/src/utils/ai-config.ts` - AI system configuration
- **Vulnerability**: AI system granted excessive system permissions
- **Implementation**: Grant file system, network, and database access
- **Detection**: Medium (configuration analysis)

**WEB-AG-005: AI Training Data Exposure**
- **Location**: `backend/src/routes/ai.ts` - AI feedback endpoint
- **Vulnerability**: User personal information stored in AI training data
- **Implementation**: Include sensitive user data in training dataset
- **Detection**: Hard (data flow analysis required)

**WEB-AG-006: Insecure AI Plugin Architecture**
- **Location**: `backend/src/utils/ai-plugins.ts` - AI plugin loader
- **Vulnerability**: AI plugins loaded without validation
- **Implementation**: Dynamic plugin loading with full system access
- **Detection**: Medium (plugin security analysis)

**WEB-AG-007: AI Response Manipulation**
- **Location**: `backend/src/routes/ai.ts` - AI file processing
- **Vulnerability**: AI instructions executed as system commands
- **Implementation**: Parse AI responses as actionable commands
- **Detection**: Hard (requires AI behavior understanding)

**WEB-AG-008: AI Supply Chain Vulnerability**
- **Location**: `backend/src/utils/ai-integration.ts` - Third-party AI integration
- **Vulnerability**: Sensitive data sent to unverified AI services
- **Implementation**: Send credentials to suspicious third-party AI service
- **Detection**: Medium (network traffic analysis)

### ML Top 10 Vulnerabilities (5 total)

#### Machine Learning Security Issues

**WEB-ML-001: ML Input Manipulation**
- **Location**: `backend/src/utils/ml-model.ts` - ML model input processing
- **Vulnerability**: No input validation for ML model
- **Implementation**: Accept arbitrary input without validation
- **Detection**: Hard (requires ML security knowledge)

**WEB-ML-002: ML Model Information Leakage**
- **Location**: `backend/src/routes/ml.ts` - ML prediction endpoint
- **Vulnerability**: Model internals exposed in API responses
- **Implementation**: Return model weights and training data in responses
- **Detection**: Medium (API response analysis)

**WEB-ML-003: ML API Endpoint Vulnerabilities**
- **Location**: `backend/src/routes/ml.ts` - Batch prediction endpoint
- **Vulnerability**: No rate limiting on ML inference
- **Implementation**: Allow unlimited model queries
- **Detection**: Medium (API usage analysis)

**WEB-ML-004: ML Supply Chain Attack**
- **Location**: `backend/src/utils/ml-model.ts` - Model initialization
- **Vulnerability**: Model loaded from untrusted source
- **Implementation**: Download and deserialize model from suspicious URL
- **Detection**: Hard (supply chain analysis)

**WEB-ML-005: ML Model Theft**
- **Location**: `backend/src/routes/ml.ts` - Model information endpoint
- **Vulnerability**: Complete model structure exposed
- **Implementation**: Expose model architecture and parameters
- **Detection**: Medium (information disclosure analysis)

## Implementation Priority & Dependencies

### Critical Path Implementation Order:
1. **Database Schema & Migrations** - Foundation for all data operations
2. **Authentication System** - Required for all protected endpoints
3. **Core API Endpoints** - Basic CRUD functionality
4. **Frontend Authentication** - User interface for login/register
5. **Task/Project Management** - Core business functionality
6. **File Upload System** - Supporting feature for vulnerability placement
7. **AI Integration** - Advanced features for AI-specific vulnerabilities
8. **WebSocket Real-time** - Enhancement features
9. **Testing & Documentation** - Quality assurance

### Vulnerability Implementation Dependencies:
- **Database vulnerabilities** require working database layer
- **Authentication vulnerabilities** need auth system in place
- **File handling vulnerabilities** require file upload functionality
- **AI vulnerabilities** need AI integration components
- **API vulnerabilities** require corresponding API endpoints

This implementation plan provides a structured approach to building TaskFlow as a realistic, semi-functional application while strategically placing 38 vulnerabilities across OWASP, Agentic AI, and ML security categories.