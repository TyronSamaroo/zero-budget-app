# Zero Budget App Frontend

A modern zero-based budgeting application frontend built with React, TypeScript, and Material-UI.

## Author
Created by Tyron Samaroo
Copyright © 2024. All rights reserved.

This project is proprietary software. No part of this project may be copied, modified, or distributed without explicit permission from the author.

## Technical Stack
- React 18
- TypeScript 5
- Material-UI v5
- React Router v6
- Axios
- Date-fns
- Recharts
- Vite
- ESLint + Prettier

## Project Structure
```
frontend/src/
├── components/
│   ├── common/           # Reusable components like buttons, inputs
│   │   ├── LoadingButton.tsx
│   │   ├── DataTable.tsx
│   │   └── PageHeader.tsx
│   ├── layout/           # Layout components
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   ├── forms/           # Form-related components
│   │   └── FormField.tsx
│   └── charts/          # Chart components
├── hooks/               # Custom React hooks
│   ├── useForm.ts
│   └── useApi.ts
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Budget.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── services/           # API services
│   └── api.ts
├── store/              # State management
│   ├── budgetStore.ts
│   └── dateContext.tsx
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
├── constants/          # Constants and enums
│   └── index.ts
└── assets/            # Static assets
```

## Component Library

### Common Components
1. `LoadingButton`: Extended Material-UI Button with loading state
2. `DataTable`: Reusable table with sorting and pagination
3. `PageHeader`: Consistent page headers with breadcrumbs

### Form Components
1. `FormField`: Unified form input component supporting:
   - Text input
   - Select
   - Date picker
   - Number input
   - Password input

### Custom Hooks
1. `useForm`: Form state management with validation
2. `useApi`: API request handling with loading and error states

## State Management
- React Context for global state
- Custom stores for specific features
- Local component state where appropriate

## API Integration
- Axios for HTTP requests
- Centralized API service
- Type-safe responses
- Error handling
- Authentication management

## Development Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```env
VITE_API_BASE_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Code Style Guide

### Component Structure
```typescript
import React from 'react';
import { ComponentProps } from './types';
import { useStyles } from './styles';

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 1. Hooks
  const styles = useStyles();
  
  // 2. State & Effects
  
  // 3. Handlers
  
  // 4. Render helpers
  
  // 5. Render
  return (
    // JSX
  );
};
```

### Naming Conventions
- Components: PascalCase
- Files: PascalCase for components, camelCase for others
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase

### Type Safety
- Use TypeScript types/interfaces for all props
- Avoid `any` type
- Use proper type annotations for functions
- Define return types for non-obvious functions

### Testing
- Write unit tests for components
- Test error scenarios
- Mock API calls
- Test user interactions

## Performance Considerations
- Use React.memo for expensive renders
- Implement proper code splitting
- Optimize bundle size
- Use proper key props in lists
- Implement proper error boundaries

## Security
- Sanitize user inputs
- Implement proper authentication
- Use HTTPS
- Follow security best practices
- Handle sensitive data properly

## Contributing
This is a proprietary project. Contributions are not accepted without explicit permission from the author.

## License
All rights reserved. This project is proprietary software. 