# Zero Budget App Backend

A modern zero-based budgeting application backend built with Go, PostgreSQL, and GORM.

## Author
Created by Tyron Samaroo
Copyright © 2024. All rights reserved.

This project is proprietary software. No part of this project may be copied, modified, or distributed without explicit permission from the author.

## Technical Stack
- Go 1.21
- PostgreSQL 14
- GORM v2
- Gin Web Framework
- JWT Authentication
- GoDotEnv
- Air (for hot reload)

## Project Structure
```
backend/
├── cmd/
│   └── api/              # Application entrypoint
│       └── main.go
├── internal/
│   ├── api/              # API layer
│   │   ├── handlers/     # Request handlers
│   │   ├── middleware/   # HTTP middleware
│   │   └── routes/       # Route definitions
│   ├── models/           # Database models
│   │   ├── user.go
│   │   ├── category.go
│   │   ├── budget.go
│   │   └── transaction.go
│   ├── database/         # Database configuration
│   │   └── db.go
│   ├── services/         # Business logic
│   │   ├── auth/
│   │   ├── budget/
│   │   └── transaction/
│   └── utils/            # Utility functions
├── config/               # Configuration
├── tests/                # Integration tests
└── scripts/             # Utility scripts
```

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
GIN_MODE=debug

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=zero_budget_db
DB_SSL_MODE=disable

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173
```

## Development

### Running the Application

1. Normal mode:
```bash
go run cmd/api/main.go
```

2. Hot reload mode (using Air):
```bash
air
```

### Database Migrations

The application uses GORM's auto-migration feature. Models will be automatically migrated when the application starts.

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Routes
All protected routes require JWT token in the Authorization header:
```http
Authorization: Bearer your_jwt_token
```

## Database Schema

### Users
```go
type User struct {
  gorm.Model
  Email        string `gorm:"uniqueIndex;not null"`
  Password     string `gorm:"not null"`
  FirstName    string
  LastName     string
  Categories   []Category
  Budgets      []Budget
  Transactions []Transaction
}
```

### Categories
```go
type Category struct {
  gorm.Model
  Name         string
  UserID       uint
  Color        string // Hex code
  Icon         string
  Budgets      []Budget
  Transactions []Transaction
}
```

### Budgets
```go
type Budget struct {
  gorm.Model
  UserID       uint
  CategoryID   uint
  Amount       float64
  Month        time.Time
  Spent        float64
  Remaining    float64
}
```

### Transactions
```go
type Transaction struct {
  gorm.Model
  UserID       uint
  CategoryID   uint
  Amount       float64
  Date         time.Time
  Description  string
  Type         string // "income" or "expense"
  Payee        string
  Note         string
  IsRecurring  bool
}
```

## Error Handling
The application uses a standardized error response format:
```go
type ErrorResponse struct {
  Error   string `json:"error"`
  Message string `json:"message,omitempty"`
  Code    int    `json:"code,omitempty"`
}
```

## Testing

### Running Tests
```bash
# Run all tests
go test ./...

# Run specific package tests
go test ./internal/services/auth

# Run with coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html
```

## Code Style

### Guidelines
- Follow standard Go formatting (gofmt)
- Use meaningful variable and function names
- Add comments for exported functions and packages
- Implement proper error handling
- Use context for timeouts and cancellation
- Follow interface segregation principle

### Linting
The project uses golangci-lint for code quality:
```bash
golangci-lint run
```

## Security Considerations
- All passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation and sanitization
- Proper error handling to prevent information leakage
- Database query parameterization
- Rate limiting on sensitive endpoints
- CORS configuration

## Performance
- Connection pooling for database
- Proper indexing on database columns
- Caching where appropriate
- Request timeouts
- Graceful shutdown

## Contributing
This is a proprietary project. Contributions are not accepted without explicit permission from the author.

## License
All rights reserved. This project is proprietary software. 