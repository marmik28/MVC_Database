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

## 🚀 Complete Local Setup Guide

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **PostgreSQL 14+** - [Download from postgresql.org](https://www.postgresql.org/download/)
- **pgAdmin 4** - [Download from pgadmin.org](https://www.pgadmin.org/download/) (Database management tool)
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **npm** (comes with Node.js) or **yarn**

### Step-by-Step Installation

#### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd volleyball-club-system
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: PostgreSQL Database Setup

**3.1 Install PostgreSQL**
- Download and install PostgreSQL from the official website
- During installation, remember the **postgres** user password you set
- Default port is usually **5432**

**3.2 Install pgAdmin**
- Download and install pgAdmin 4
- Launch pgAdmin and connect to your PostgreSQL server using the postgres password

**3.3 Create Database User and Database using pgAdmin**

1. **Connect to PostgreSQL Server in pgAdmin:**
   - Open pgAdmin
   - Right-click "Servers" → "Create" → "Server"
   - Name: "Local PostgreSQL"
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: (your postgres password)

2. **Create Database User:**
   - Right-click your server → "Create" → "Login/Group Role"
   - Name: `volleyball_user`
   - Password: `volleyball123` (or your preferred password)
   - Privileges tab: Check "Can login?" and "Create databases?"

3. **Create Database:**
   - Right-click "Databases" → "Create" → "Database"
   - Database name: `volleyball_club`
   - Owner: `volleyball_user`

**Alternative: Command Line Setup**
```bash
# Connect to PostgreSQL as postgres user
psql -U postgres

# Create user
CREATE USER volleyball_user WITH PASSWORD 'volleyball123';

# Create database
CREATE DATABASE volleyball_club OWNER volleyball_user;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE volleyball_club TO volleyball_user;

# Exit psql
\q
```

#### Step 4: Environment Configuration

**4.1 Copy Environment File**
```bash
cp .env.example .env
```

**4.2 Edit .env File**
Open the `.env` file and update with your database credentials:

```env
# Database Configuration (PostgreSQL - Default)
DATABASE_URL="postgresql://volleyball_user:volleyball123@localhost:5432/volleyball_club"

# PostgreSQL Connection Details
PGHOST=localhost
PGPORT=5432
PGUSER=volleyball_user
PGPASSWORD=volleyball123
PGDATABASE=volleyball_club

# Email Service (Optional - for automated emails)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Application Settings
NODE_ENV=development
PORT=5000

# Session Secret (Generate a random string for production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

#### Step 5: Database Schema Setup

**5.1 Push Database Schema**
```bash
npm run db:push
```

This command will:
- Connect to your PostgreSQL database
- Create all necessary tables (locations, personnel, members, families, etc.)
- Set up relationships and constraints

**5.2 Verify Database Setup in pgAdmin**
- Refresh your database in pgAdmin
- Expand "volleyball_club" → "Schemas" → "public" → "Tables"
- You should see tables like: locations, personnel, club_members, family_members, etc.

#### Step 6: Start the Application

**6.1 Start Development Server**
```bash
npm run dev
```

**6.2 Access the Application**
- Open your browser and go to: `http://localhost:5000`
- You should see the Volleyball Club Management System dashboard

#### Step 7: Test the Application

**7.1 Add Sample Data**
1. Navigate to "Locations" and add a head office location
2. Go to "Personnel" and add staff members
3. Visit "Club Members" and register some players
4. Check "Email Logs" to see automated email tracking

**7.2 Verify Database Changes**
- In pgAdmin, right-click any table → "View/Edit Data" → "All Rows"
- You should see the data you added through the web interface

### Troubleshooting Common Issues

#### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U volleyball_user -d volleyball_club -h localhost

# If connection fails, check:
# 1. PostgreSQL service is running
# 2. Credentials in .env match database user
# 3. Database exists and user has permissions
```

#### Port Conflicts
```bash
# If port 5000 is busy, change in .env:
PORT=3000

# Then restart: npm run dev
```

#### Node.js Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Development Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build  
npm run preview

# Database operations
npm run db:push          # Apply schema changes
npm run db:studio        # Open Drizzle Studio (database GUI)
npm run db:generate      # Generate migration files

# Code quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation
```

### Accessing Your Data

**Via Web Interface:**
- Application: `http://localhost:5000`

**Via pgAdmin:**
- Launch pgAdmin
- Connect to your server
- Navigate to volleyball_club database
- View/edit tables under Schemas → public → Tables

**Via Command Line:**
```bash
# Connect to database
psql -U volleyball_user -d volleyball_club -h localhost

# Example queries
SELECT * FROM locations;
SELECT * FROM club_members;
SELECT * FROM personnel;
```

## 🗄️ Alternative Database Configuration

### Switching to MySQL (Optional)

If you prefer MySQL over PostgreSQL, follow these comprehensive steps:

#### Prerequisites for MySQL
- **MySQL 8.0+** - [Download from mysql.com](https://dev.mysql.com/downloads/mysql/)
- **MySQL Workbench** - [Download GUI tool](https://dev.mysql.com/downloads/workbench/)

#### Step-by-Step MySQL Conversion

**1. Install MySQL**
- Download and install MySQL Server
- During installation, set a root password
- Install MySQL Workbench for database management

**2. Install MySQL Dependencies**
```bash
# Remove PostgreSQL dependencies
npm uninstall @neondatabase/serverless ws

# Install MySQL dependencies  
npm install mysql2
```

**3. Create MySQL Database and User**

Using MySQL Workbench:
- Connect to MySQL server (localhost:3306, root user)
- Execute these SQL commands:

```sql
-- Create database
CREATE DATABASE volleyball_club CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'volleyball_user'@'localhost' IDENTIFIED BY 'volleyball123';

-- Grant permissions
GRANT ALL PRIVILEGES ON volleyball_club.* TO 'volleyball_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SELECT User, Host FROM mysql.user WHERE User = 'volleyball_user';
```

**4. Update Database Connection**

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

**5. Update Environment Variables**

Edit your `.env` file:
```env
# MySQL Database Configuration
DATABASE_URL="mysql://volleyball_user:volleyball123@localhost:3306/volleyball_club"

# Remove PostgreSQL variables and add MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=volleyball_user
MYSQL_PASSWORD=volleyball123
MYSQL_DATABASE=volleyball_club

# Keep other variables the same
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

**6. Update Drizzle Configuration**

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

**7. Convert Schema to MySQL**

The current PostgreSQL schema needs to be converted. Here's how to update key tables in `shared/schema.ts`:

```typescript
import { 
  mysqlTable, 
  serial, 
  varchar, 
  text, 
  int, 
  timestamp, 
  decimal, 
  mysqlEnum,
  datetime
} from 'drizzle-orm/mysql-core';

// Example: Convert locations table
export const locations = mysqlTable('locations', {
  id: serial('id').primaryKey(),
  type: mysqlEnum('type', ['Head', 'Branch']).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  province: varchar('province', { length: 50 }).notNull(),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  webAddress: varchar('web_address', { length: 255 }),
  capacity: int('capacity'),
});

// Convert personnel table
export const personnel = mysqlTable('personnel', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  dob: datetime('dob').notNull(),
  ssn: varchar('ssn', { length: 11 }).notNull().unique(),
  medicareCard: varchar('medicare_card', { length: 12 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  province: varchar('province', { length: 50 }).notNull(),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  roleId: int('role_id').notNull(),
  mandate: mysqlEnum('mandate', ['Volunteer', 'Salaried']).notNull(),
});

// Continue converting other tables...
```

**8. Apply Schema Changes**
```bash
# Push the new MySQL schema
npm run db:push

# Verify in MySQL Workbench
# Connect to volleyball_club database
# Check that all tables were created correctly
```

**9. Test the Application**
```bash
# Start the application
npm run dev

# Verify everything works at http://localhost:5000
```

**10. Verify MySQL Connection**

Test the connection:
```bash
# Connect via command line
mysql -u volleyball_user -p volleyball_club

# Or use MySQL Workbench
# Connect to localhost:3306 with volleyball_user credentials
```

#### MySQL vs PostgreSQL Differences

| Feature | PostgreSQL | MySQL |
|---------|------------|-------|
| **Data Types** | More extensive | Standard SQL types |
| **JSON Support** | Native JSONB | JSON data type |
| **Enum Types** | Native support | Limited enum support |
| **Performance** | Complex queries | Simple queries |
| **ACID Compliance** | Full | Full (InnoDB) |

#### Troubleshooting MySQL Setup

**Connection Issues:**
```bash
# Check MySQL service status
sudo systemctl status mysql

# Reset MySQL root password if needed
sudo mysql_secure_installation
```

**Permission Issues:**
```sql
-- Grant additional permissions if needed
GRANT CREATE, ALTER, DROP, INDEX ON volleyball_club.* TO 'volleyball_user'@'localhost';
FLUSH PRIVILEGES;
```

**Character Set Issues:**
```sql
-- Verify database character set
SHOW CREATE DATABASE volleyball_club;

-- Should show: CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
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