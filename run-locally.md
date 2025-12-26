# Running the Application Locally

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL database access (or use the provided AWS RDS connection)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MYSQL_DATABASE_URL=mysql://username:password@host:port/database
RESEND_API_KEY=your_resend_api_key
FEEDBACK_EMAIL=ashriv61@asu.edu
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility functions and API calls
│   │   └── assets/        # Static assets
├── server/                 # Backend Express server
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database storage layer
│   ├── db.ts              # MySQL database connection
│   └── resend-client.ts   # Email service client
├── shared/                 # Shared types and schemas
└── package.json
```

## Available Routes

- `/` - Home page
- `/search` - Directory selection
- `/search/mental-health` - Mental health facilities search
- `/search/substance-abuse` - Substance abuse facilities search
- `/facility/:id` - Facility details
- `/research` - Research page
- `/contact` - Contact form

## API Endpoints

- `GET /api/facilities` - Search facilities with filters
- `GET /api/facilities/:id` - Get facility by ID
- `POST /api/contact` - Submit contact form (sends email)

## Database

The application connects to a MySQL database hosted on AWS RDS. The database contains mental health and substance abuse facility information with service codes for filtering.

## Email Configuration

The contact form uses Resend for sending emails. You need a valid Resend API key for email functionality to work.
