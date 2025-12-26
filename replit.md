# Community Resource Engine

## Overview

This is a mental health and substance abuse facility locator application built for Arizona State University. The platform helps users find behavioral health resources by searching through a national directory of mental health and substance abuse treatment facilities. Key features include facility search with advanced filtering, facility detail views, a research page showcasing the principal investigator's work, and a contact form for user feedback.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming, using the "new-york" shadcn style

The frontend follows a page-based architecture with shared components. Pages are located in `client/src/pages/` and reusable components in `client/src/components/`. The application has two main search flows: mental health services and substance abuse services, each with their own filter configurations defined in `client/src/lib/filter-data.ts`.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: MySQL (connected via mysql2/promise library)
- **API Design**: RESTful endpoints under `/api/` prefix

The server provides facility search and detail endpoints that query a MySQL database containing facility data. The database connection is managed through a connection pool in `server/db.ts`.

### Data Storage
- **Primary Database**: MySQL hosted externally (AWS RDS based on environment variables)
- **Schema Definition**: Drizzle ORM configured for PostgreSQL in `shared/schema.ts` (but actual queries use MySQL directly)
- **Connection**: Uses `MYSQL_DATABASE_URL` environment variable for database connection string

The application stores mental health facility data with extensive service codes. The storage layer in `server/storage.ts` handles parsing service codes from database rows into structured facility objects.

### Email Integration
- **Service**: Resend API for transactional emails
- **Use Case**: Contact form submissions for feedback
- **Configuration**: Uses Replit's connector system to obtain API credentials dynamically

## External Dependencies

### Third-Party Services
- **MySQL Database**: External MySQL database (AWS RDS) for facility data storage
- **Resend**: Email service for contact form submissions, integrated via Replit connectors

### Key NPM Packages
- **Database**: `mysql2` for MySQL connections, `drizzle-orm` with `drizzle-zod` for schema validation
- **UI**: Full shadcn/ui component set via Radix UI primitives, `lucide-react` for icons
- **HTTP Client**: Native fetch API for client-server communication
- **Build**: Vite for frontend, esbuild for server bundling

### Environment Variables Required
- `MYSQL_DATABASE_URL`: MySQL connection string for the facility database
- `RESEND_API_KEY`: API key for Resend email service (optional, managed via Replit connectors)
- `FEEDBACK_EMAIL`: Destination email for contact form submissions

## Recent Changes (December 2024)

### Find Care Page Updates
- **Filter Categories**: Now sorted alphabetically from left to right
- **State Dropdown**: Expanded to include all 50 US states plus DC, with Arizona as default
- **Language Services**: Extended to 24 languages including Arabic, Chinese, French, German, Hindi, Korean, Russian, Vietnamese, and more

### Contact Page Redesign
- Complete redesign with cascading dropdown workflow:
  1. Directory type selection (Mental Health / Substance Abuse)
  2. State selection (all 50 states)
  3. Searchable clinic dropdown with autocomplete
  4. Issue category selection
  5. Displays selected clinic's services

### Database Migration (December 2024)
- **Combined SQL File**: `combined_facilities_final.sql` (70MB)
  - Contains both `datamentalhealth` (~8,300 records) and `datasubstanceabuse` (~12,200 records) tables
  - Each table has `directory_type` column ('mental' or 'substance')
  - Import to Heroku MySQL: `mysql -h HOST -u USER -p DATABASE < combined_facilities_final.sql`
  - BOM character fix included for substance abuse first column

- **Backend Updates**:
  - `server/storage.ts` now queries both tables based on directory type
  - Automatic table detection: checks if `datasubstanceabuse` exists before querying
  - Service codes split: MENTAL_HEALTH_CODES (145 codes) and SUBSTANCE_ABUSE_CODES (184 codes)
  - Filters correctly applied per directory type

### API Endpoints
- `/api/clinics`: Searchable clinic dropdown (used in Contact form)
- `/api/facilities`: Facility search with state, directory, and service filters
- `/api/facilities/:id`: Get facility by ID (searches both tables)
- `/api/contact`: Submit feedback via email