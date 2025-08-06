# Volleyball Club Management System

## Overview

This is a full-stack web application for managing volleyball club operations, including member registration, personnel management, team formations, training sessions, and payment processing. The system is designed specifically for volleyball clubs to track members, organize teams, schedule sessions, and handle administrative tasks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas shared between client and server
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **Build Process**: esbuild for server bundling and tsx for development

### Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations in `migrations/` directory
- **Core Entities**:
  - Locations (Head/Branch offices with capacity tracking)
  - Personnel (Staff with roles and mandate types)
  - Club Members (Players with SSN/Medicare validation and family associations)
  - Family Members (Emergency contacts and guardians)
  - Team Formations (Gender-based teams with coaches and duration)
  - Sessions (Training/Game sessions with scoring)
  - Payments (Membership fees and donations)
  - Roles and Hobbies (Reference data)
- **Relationships**: Foreign key constraints linking members to families, teams to coaches, sessions to teams
- **Data Integrity**: Unique constraints on SSN and Medicare numbers, status enums for data consistency

### API Structure
- **RESTful Design**: CRUD operations for all major entities
- **Endpoint Pattern**: `/api/{resource}` with standard HTTP methods
- **Data Validation**: Request validation using Zod schemas
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Response Format**: Consistent JSON responses with error details

### Development Environment
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Path Aliases**: TypeScript path mapping for clean imports (@/, @shared/)
- **Replit Integration**: Custom plugins for development environment integration

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Required for Neon serverless connections (ws package)

### UI Framework Dependencies
- **Radix UI**: Comprehensive set of accessible component primitives
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Class Variance Authority**: Type-safe component variant management

### Development Tools
- **TypeScript**: Static type checking across entire codebase
- **Drizzle Kit**: Database schema management and migration tools
- **React Hook Form**: Form state management with validation
- **TanStack Query**: Server state synchronization and caching
- **Zod**: Runtime type validation and schema definition

### Build and Runtime
- **Vite**: Frontend build tool with plugin ecosystem
- **esbuild**: Fast JavaScript bundler for production server builds
- **tsx**: TypeScript execution for development server
- **Wouter**: Minimalist routing library for single-page application navigation