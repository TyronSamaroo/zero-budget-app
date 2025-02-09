# Zero Budget App - Engineering Documentation

## Architecture Overview

### System Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │ ←→  │   Backend   │ ←→  │  Database   │
│   (React)   │     │    (Go)     │     │ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
```

## Backend Architecture

### Directory Structure
```
backend/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── database/
│   │   └── db.go
│   ├── handlers/
│   │   ├── auth.go
│   │   ├── budget.go
│   │   ├── category.go
│   │   └── transaction.go
│   ├── middleware/
│   │   └── auth.go
│   └── models/
│       ├── user.go
│       ├── category.go
│       ├── budget.go
│       └── transaction.go
├── config/
│   └── config.go
└── tests/
    └── api_test.go
```

### Key Components

1. **Models**
   - User: Core user information and authentication
   - Category: Budget categories management
   - Budget: Monthly budget allocations
   - Transaction: Financial transactions tracking

2. **Handlers**
   - Authentication: User registration and login
   - Budget: Budget CRUD operations
   - Category: Category management
   - Transaction: Transaction management

3. **Middleware**
   - Authentication: JWT token validation
   - Logging: Request/Response logging
   - CORS: Cross-origin resource sharing

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── features/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
├── public/
└── tests/
```

### Key Components

1. **Components**
   - Common: Reusable UI components
   - Layout: Page layout components
   - Features: Feature-specific components

2. **Services**
   - API integration
   - Authentication
   - Data transformation

3. **State Management**
   - React Query for server state
   - Context for global state
   - Local state for component-specific data

## Database Schema

### Relationships
```
User
 ├── Categories (1:N)
 ├── Budgets (1:N)
 └── Transactions (1:N)

Category
 ├── Budgets (1:N)
 └── Transactions (1:N)
```

### Indexes
- Users: email (unique)
- Categories: user_id
- Budgets: user_id, category_id
- Transactions: user_id, category_id, date

## API Documentation

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Categories
```
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Budgets
```
GET    /api/budgets
POST   /api/budgets
PUT    /api/budgets/:id
DELETE /api/budgets/:id
```

### Transactions
```
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

## Security Considerations

1. **Authentication**
   - JWT token-based authentication
   - Password hashing with bcrypt
   - Token expiration and refresh

2. **Data Protection**
   - Input validation
   - SQL injection prevention
   - XSS protection

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Request validation

## Performance Optimization

1. **Backend**
   - Database indexing
   - Query optimization
   - Connection pooling
   - Caching strategies

2. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Bundle size optimization

## Deployment

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Environment Variables
```
# Backend
PORT=8080
ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=zero_budget_db
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h

# Frontend
REACT_APP_API_URL=http://localhost:8080
```

### Deployment Steps
1. Backend:
   ```bash
   cd backend
   go build cmd/api/main.go
   ./main
   ```

2. Frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

## Monitoring and Logging

1. **Application Monitoring**
   - Error tracking
   - Performance metrics
   - User activity

2. **System Monitoring**
   - Server health
   - Database performance
   - API response times

3. **Logging**
   - Request/Response logging
   - Error logging
   - Audit logging

## Testing Strategy

1. **Backend Testing**
   - Unit tests
   - Integration tests
   - API tests

2. **Frontend Testing**
   - Component tests
   - Integration tests
   - E2E tests

## Maintenance Procedures

1. **Database Maintenance**
   - Regular backups
   - Index optimization
   - Query optimization

2. **Code Maintenance**
   - Code reviews
   - Documentation updates
   - Dependency updates

3. **Performance Monitoring**
   - Regular performance audits
   - Load testing
   - Optimization updates 