# Inventory Management System

## Overview

This is a full-stack inventory management system built with a modern web stack. The application provides real-time inventory tracking, product management, and dashboard analytics for businesses to monitor their stock levels, manage products, and generate reports.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI primitives with shadcn/ui components for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for consistent theming and design system
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API endpoints with JSON responses
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Database**: PostgreSQL (configured via Neon serverless) for relational data integrity
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple

### Data Storage Strategy
- **Primary Database**: PostgreSQL for ACID compliance and relational data integrity
- **ORM**: Drizzle provides compile-time type safety and runtime validation
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts` for type sharing
- **Migration Strategy**: Drizzle Kit for database schema migrations and version control

## Key Components

### Database Schema
The system uses four main entities with well-defined relationships:
- **Users**: Authentication and user management with role-based access
- **Categories**: Product categorization system for organization
- **Products**: Core inventory items with stock tracking, pricing, and thresholds
- **Inventory Adjustments**: Complete audit trail for all stock changes

### Core Features
- **Dashboard Metrics**: Real-time inventory statistics with value calculations
- **Product Management**: Full CRUD operations with search and filtering
- **Stock Adjustments**: Quantity change tracking with reasons and notes
- **Search & Filtering**: Multi-criteria product search (name, SKU, category)
- **Low Stock Alerts**: Configurable threshold-based notifications
- **Bulk Operations**: CSV import/export functionality for mass data management

### Authentication & Authorization
- Session-based authentication using Express sessions for security
- PostgreSQL session storage for horizontal scalability
- User roles system for access control (extensible for future requirements)

## Data Flow

### Client-Server Communication
1. **Frontend**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle HTTP requests with validation
3. **Business Logic**: Storage layer processes data with Drizzle ORM
4. **Database**: PostgreSQL stores and retrieves data with ACID guarantees
5. **Response**: JSON data flows back through the same layers

### State Management Flow
- **Server State**: TanStack Query manages API data with automatic caching
- **UI State**: React hooks manage local component state
- **Form State**: React Hook Form handles form data with Zod validation
- **Session State**: Express sessions maintain user authentication

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via Neon's serverless platform
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router
- **zod**: Runtime type validation
- **react-hook-form**: Form state management

### Development Dependencies
- **typescript**: Static type checking
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR for fast development
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Neon serverless PostgreSQL for development

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Same Neon instance with production configuration
- **Deployment**: Single Node.js process serving both API and static files

### Environment Configuration
- **DATABASE_URL**: Required environment variable for PostgreSQL connection
- **NODE_ENV**: Controls development vs production behavior
- **Session Configuration**: Secure session management with PostgreSQL storage

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```