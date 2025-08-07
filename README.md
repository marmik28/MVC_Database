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

### Backend
- **Node.js** with TypeScript
- **Express.js** REST API
- **PostgreSQL**

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

2. **Create Database:**
   - Right-click "Databases" → "Create" → "Database"
   - Database name: `volleyball_club`
   - Owner: `volleyball_user`

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

# Application Settings
NODE_ENV=development
PORT=5000
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

## 🔐 Business Rules

### Personnel
- Head location must have: General Manager (President), Deputy, Treasurer, Secretary, Administrators
- General Manager of the head location serves as Club President
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
