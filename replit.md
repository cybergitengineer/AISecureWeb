# AI Security Platform

## Overview

AI SecureGuard is a comprehensive AI security platform designed to protect AI applications from vulnerabilities, prompt injection attacks, and other security threats. The platform provides real-time security testing, vulnerability detection, and best practices guidance for securing AI deployments. It features a modern dashboard for monitoring security metrics, a prompt testing sandbox for analyzing potential threats, and automated vulnerability scanning capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component System**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design follows a professional security platform aesthetic inspired by GitHub Security, Snyk, Linear, and Vercel Dashboard, emphasizing clarity, authority, and trust.

**Design System**:
- Typography: Inter for primary text, JetBrains Mono for code/technical content
- Color scheme: Neutral base with customizable theme variables supporting light/dark modes
- Layout: Responsive grid system with max-width containers (max-w-7xl for main content)
- Spacing: Tailwind's standard spacing scale (2, 4, 6, 8, 12, 16, 24)

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Local state managed through React hooks.

**Routing**: Wouter for client-side routing with path-based navigation.

**Key Pages**:
- Dashboard: Security metrics overview with stats cards and vulnerability table
- Prompt Testing: Interactive sandbox for testing prompts against security threats
- Best Practices: Guided recommendations for AI security implementation
- Landing: Marketing page with feature showcase

### Backend Architecture

**Framework**: Express.js server with TypeScript running on Node.js.

**API Design**: RESTful API endpoints with JSON request/response format:
- `/api/security/test-prompt` - Analyzes prompts for security threats
- `/api/security/stats` - Returns security statistics dashboard data
- `/api/vulnerabilities` - CRUD operations for vulnerability records

**Middleware**: 
- Express JSON parser with raw body preservation for webhook support
- Request logging middleware tracking API response times and payloads
- Custom Vite integration for development HMR and production static file serving

**Development vs Production**:
- Development: Vite middleware mode with HMR support
- Production: Compiled bundle with static file serving from dist/public

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver for connection pooling and edge compatibility.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design**:
- `security_scans`: Records of all security analysis operations (prompt tests, vulnerability scans, output checks) with threat detection results
- `vulnerabilities`: Vulnerability records with severity classification (critical, high, medium, low)

**Migration Strategy**: Drizzle Kit for schema migrations stored in `/migrations` directory.

**Fallback Storage**: In-memory storage implementation (`MemStorage` class) for development and testing without database setup. Implements same interface (`IStorage`) as database layer for easy swapping.

### AI Integration

**Provider**: OpenAI API accessed through Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring direct API keys.

**Model**: GPT-5 for security analysis tasks.

**Security Analysis Features**:
- Prompt injection detection (ignore instructions, jailbreak attempts)
- System prompt extraction prevention
- Data extraction attempt identification
- Role manipulation detection
- Structured JSON response format for consistent parsing

**Response Format**: All AI analysis returns structured results with:
- Status classification (safe, warning, dangerous)
- Threat array listing detected issues
- Confidence score (0-100)
- Detailed analysis explanation

### Authentication & Authorization

Not currently implemented. The application is designed as a security analysis tool without user authentication requirements. Future implementation would require:
- Session management (connect-pg-simple already included for PostgreSQL session store)
- User model and authentication routes
- Protected API endpoints with authorization middleware

### Build & Deployment

**Build Process**:
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js` with ESM format
- TypeScript compilation checking via `tsc --noEmit`

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string (required)
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI API base URL via Replit
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key via Replit
- `NODE_ENV`: Environment designation (development/production)

**Development Workflow**: Single command `npm run dev` starts Express server with Vite middleware for hot reloading.

## External Dependencies

### Third-Party Services

**Replit AI Integrations**: Provides OpenAI-compatible API access for AI security analysis without requiring direct OpenAI API keys. Used for all prompt analysis and vulnerability detection features.

**Neon Serverless PostgreSQL**: Cloud PostgreSQL database with serverless driver for connection pooling and edge deployment compatibility.

### UI Component Libraries

**Radix UI**: Unstyled, accessible component primitives for building the UI (dialogs, dropdowns, tooltips, etc.). Provides 25+ component primitives with full keyboard navigation and ARIA compliance.

**Shadcn/ui**: Pre-styled components built on Radix UI with Tailwind CSS. Configured with "new-york" style variant.

### Development Tools

**Vite Plugins**:
- `@replit/vite-plugin-runtime-error-modal`: Runtime error overlay for development
- `@replit/vite-plugin-cartographer`: Development tooling integration
- `@replit/vite-plugin-dev-banner`: Development environment banner

### Utility Libraries

**Form Handling**: React Hook Form with Zod resolver for type-safe form validation.

**Date Manipulation**: date-fns for date formatting and manipulation.

**Styling**: 
- Tailwind CSS for utility-first styling
- class-variance-authority for variant-based component styling
- clsx and tailwind-merge for conditional class composition

**Icons**: Lucide React for consistent icon set across the application.