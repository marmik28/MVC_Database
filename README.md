# Volleyball Club Management System (VCS)

A comprehensive full-stack web application for managing volleyball club operations, including member registration, personnel management, team formations, training sessions, and payment processing.

## 🏐 Features

- **Member Management**: Register and manage club members with detailed profiles
- **Personnel Management**: Track staff, coaches, and administrative personnel
- **Family Management**: Handle emergency contacts and guardians for minor members
- **Location Management**: Manage head and branch office facilities
- **Team Formation**: Create and organize gender-based teams with coaches
- **Session Scheduling**: Plan training sessions and games with scoring
- **Payment Processing**: Track membership fees and donations
- **Email System**: Automated email notifications with logging
- **Dashboard**: Real-time statistics and overview of club operations

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** with custom pastel color scheme
- **shadcn/ui** components with Radix UI primitives
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight routing

### Backend
- **Node.js** with TypeScript
- **Express.js** REST API
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** (default) or **MySQL** support
- **Zod** for request validation
- **Session management** with PostgreSQL store

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ or MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd volleyball-club-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   # Database Configuration (PostgreSQL - Default)
   DATABASE_URL="postgresql://username:password@localhost:5432/volleyball_club"
   
   # PostgreSQL Connection Details
   PGHOST=localhost
   PGPORT=5432
   PGUSER=username
   PGPASSWORD=password
   PGDATABASE=volleyball_club
   
   # Email Service (Optional)
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   
   # Application
   NODE_ENV=development
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   # Create database (PostgreSQL)
   createdb volleyball_club
   
   # Push schema to database
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 🗄️ Database Configuration

### PostgreSQL (Default)

The application is configured to use PostgreSQL by default with Neon serverless support.

**Local PostgreSQL Setup:**
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create user and database
sudo -u postgres createuser --interactive --pwprompt volleyball_user
sudo -u postgres createdb --owner=volleyball_user volleyball_club
```

**Environment Variables:**
```env
DATABASE_URL="postgresql://volleyball_user:password@localhost:5432/volleyball_club"
PGHOST=localhost
PGPORT=5432
PGUSER=volleyball_user
PGPASSWORD=your_password
PGDATABASE=volleyball_club
```

### MySQL Configuration

To switch from PostgreSQL to MySQL, follow these steps:

1. **Install MySQL Dependencies**
   ```bash
   npm uninstall @neondatabase/serverless
   npm install mysql2
   ```

2. **Update Database Configuration**
   
   Edit `server/db.ts`:
   ```typescript
   import mysql from 'mysql2/promise';
   import { drizzle } from 'drizzle-orm/mysql2';
   import * as schema from "@shared/schema";

   if (!process.env.DATABASE_URL) {
     throw new Error(
       "DATABASE_URL must be set. Did you forget to provision a database?",
     );
   }

   const connection = mysql.createConnection(process.env.DATABASE_URL);
   export const db = drizzle(connection, { schema });
   ```

3. **Update Schema for MySQL**
   
   Edit `shared/schema.ts` to use MySQL-compatible column types:
   ```typescript
   import { mysqlTable, serial, varchar, text, int, timestamp, decimal, mysqlEnum } from 'drizzle-orm/mysql-core';
   
   // Example: Update locations table
   export const locations = mysqlTable('locations', {
     id: serial('id').primaryKey(),
     type: mysqlEnum('type', ['Head', 'Branch']).notNull(),
     name: varchar('name', { length: 100 }).notNull(),
     // ... rest of the fields with MySQL types
   });
   ```

4. **Update Drizzle Config**
   
   Edit `drizzle.config.ts`:
   ```typescript
   import { defineConfig } from 'drizzle-kit';

   export default defineConfig({
     schema: './shared/schema.ts',
     out: './migrations',
     dialect: 'mysql',
     dbCredentials: {
       url: process.env.DATABASE_URL!,
     },
   });
   ```

5. **MySQL Environment Variables**
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/volleyball_club"
   ```

6. **Create MySQL Database**
   ```sql
   CREATE DATABASE volleyball_club CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'volleyball_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON volleyball_club.* TO 'volleyball_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

7. **Push Schema Changes**
   ```bash
   npm run db:push
   ```

## 📝 Database Schema

The system includes the following main entities:

- **Locations**: Head and branch offices
- **Personnel**: Staff with roles and mandates
- **Club Members**: Players with physical and personal details
- **Family Members**: Emergency contacts and guardians
- **Teams**: Gender-based team formations
- **Sessions**: Training and game sessions
- **Payments**: Membership fees and donations
- **Email Logs**: System-generated email tracking

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Database
npm run db:push         # Push schema changes
npm run db:studio       # Open Drizzle Studio
npm run db:generate     # Generate migrations

# Linting & Formatting
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## 📁 Project Structure

```
volleyball-club-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and helpers
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
├── migrations/           # Database migration files
└── README.md
```

## 🎨 UI Features

- **Pastel Color Scheme**: Professional and modern visual design
- **Responsive Design**: Works on desktop and mobile devices
- **Comprehensive Icons**: Lucide React icons throughout the application
- **Role-based Icons**: Visual indicators for personnel roles
- **Age Categories**: Major/Minor member classifications
- **Status Badges**: Active/Inactive status indicators
- **Statistics Cards**: Real-time dashboard metrics

## 🔐 Business Rules

### Personnel
- Head location must have: General Manager (President), Deputy, Treasurer, Secretary, Administrators
- General Manager of head location serves as Club President
- Personnel can operate at only one location at a time

### Club Members
- Major Members: 18+ years old with full privileges
- Minor Members: Under 18, require family member registration
- Teams are segregated by gender (Male/Female only)
- Unique SSN and Medicare card numbers required

### Family Members
- Must be registered before minor member enrollment
- Serve as emergency contacts and guardians
- Provide consent for minor member activities

## 📧 Email System

The system includes automated email notifications with:
- Session schedule reminders
- Payment notifications
- Administrative communications
- Complete email logging and tracking

To enable email functionality, configure SendGrid:
```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 🚀 Deployment

### Replit Deployment
The application is optimized for Replit deployment with:
- Automatic dependency management
- Built-in PostgreSQL database
- Environment variable configuration
- Hot reload development environment

### Production Deployment
For production deployment:
1. Build the application: `npm run build`
2. Set production environment variables
3. Configure production database
4. Set up reverse proxy (nginx recommended)
5. Configure SSL certificates
6. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the database schema
- Test with provided sample data

---

**Montreal Volleyball Club Management System** - Built with ❤️ for volleyball communities