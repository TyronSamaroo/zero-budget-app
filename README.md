# Zero Budget App

A modern zero-based budgeting application built with React, TypeScript, Go, and PostgreSQL.

## Author
Created by Tyron Samaroo
Copyright © 2024. All rights reserved.

This project is proprietary software. No part of this project may be copied, modified, or distributed without explicit permission from the author.

## Project Overview

Zero Budget App is a comprehensive budgeting application that helps users manage their finances using the zero-based budgeting method. The application consists of a React frontend and a Go backend, providing a modern and efficient user experience.

### Key Features
- Zero-based budgeting system
- Transaction tracking and categorization
- Budget planning and monitoring
- Expense analysis and reporting
- Interactive charts and visualizations
- Responsive design for all devices

## Project Structure

```
zero-budget-app/
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   ├── store/     # State management
│   │   ├── types/     # TypeScript types
│   │   ├── utils/     # Utility functions
│   │   ├── constants/ # Constants and enums
│   │   └── assets/    # Static assets
│   └── ...
│
└── backend/           # Go backend
    ├── cmd/          # Application entrypoints
    ├── internal/     # Private application code
    │   ├── api/      # API handlers
    │   ├── models/   # Database models
    │   └── services/ # Business logic
    └── ...
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Material-UI
- React Router
- Axios
- Date-fns
- Recharts

### Backend
- Go 1.21
- Gin Web Framework
- GORM
- PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- Go 1.21 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tyronsamaroo/zero-budget-app.git
cd zero-budget-app
```

2. Set up the frontend:
```bash
cd frontend
npm install
```

3. Set up the backend:
```bash
cd backend
go mod tidy
```

4. Create and configure the database:
```bash
createdb zero_budget_db
```

5. Set up environment variables:
- Copy `.env.example` to `.env` in both frontend and backend directories
- Update the values according to your environment

### Running the Application

1. Start the backend server:
```bash
cd backend
go run cmd/api/main.go
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Guidelines

### Code Style
- Follow ESLint and Prettier configurations for frontend
- Follow Go standard formatting guidelines for backend
- Write meaningful component and function names
- Add proper documentation and comments
- Use TypeScript types and interfaces

### Git Workflow
1. Create feature branches from `main`
2. Use meaningful commit messages
3. Submit pull requests for review
4. Squash commits when merging

## Testing
- Frontend: Jest and React Testing Library
- Backend: Go testing package
- Run tests before committing

## Deployment
- Frontend: Build with `npm run build`
- Backend: Build with `go build`
- Use environment variables for configuration
- Follow security best practices

## License
All rights reserved. This project is proprietary software.

## Contact
For any inquiries or permissions, please contact Tyron Samaroo.
