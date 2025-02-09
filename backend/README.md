# Zero Budget App Backend

A modern zero-based budgeting application backend built with Go, PostgreSQL, and GORM.

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 14 or higher
- Make sure PostgreSQL service is running

## Setup

1. Clone the repository:
```bash
git clone https://github.com/tyronsamaroo/zero-budget-app.git
cd zero-budget-app/backend
```

2. Install dependencies:
```bash
go mod tidy
```

3. Create a PostgreSQL database:
```bash
createdb zero_budget_db
```

4. Set up environment variables by creating a `.env` file in the root directory:
```env
# Server Configuration
PORT=8080
ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=zero_budget_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h
```

Replace `your_postgres_username` and `your_postgres_password` with your PostgreSQL credentials.

## Running the Application

1. Start the server:
```bash
go run cmd/api/main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Public Routes
- `GET /health` - Health check endpoint

### Authentication Routes
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Protected Routes (Requires JWT Token)
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token
```

## Database Schema

### Users
- ID (uint)
- Email (string, unique)
- Password (string, hashed)
- FirstName (string)
- LastName (string)
- CreatedAt (timestamp)
- UpdatedAt (timestamp)

### Categories
- ID (uint)
- Name (string)
- UserID (uint, foreign key)
- Color (string, hex code)
- Icon (string)
- CreatedAt (timestamp)
- UpdatedAt (timestamp)

### Budgets
- ID (uint)
- UserID (uint, foreign key)
- CategoryID (uint, foreign key)
- Amount (float64)
- Month (timestamp)
- Spent (float64)
- Remaining (float64)
- CreatedAt (timestamp)
- UpdatedAt (timestamp)

### Transactions
- ID (uint)
- UserID (uint, foreign key)
- CategoryID (uint, foreign key)
- Amount (float64)
- Date (timestamp)
- Description (string)
- Type (string: "income" or "expense")
- Payee (string)
- Note (string)
- IsRecurring (bool)
- CreatedAt (timestamp)
- UpdatedAt (timestamp)

## Development

The project uses:
- [Gin](https://github.com/gin-gonic/gin) for HTTP web framework
- [GORM](https://gorm.io) for database ORM
- [JWT-Go](https://github.com/golang-jwt/jwt) for authentication
- [GoDotEnv](https://github.com/joho/godotenv) for environment configuration 