# EPIModel Next Project Architecture

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architectural Principles](#architectural-principles)
3. [Directory Structure](#directory-structure)
4. [Application Layers](#application-layers)
5. [Design Patterns](#design-patterns)
6. [State Management](#state-management)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Code Conventions](#code-conventions)
10. [Best Practices](#best-practices)

---

## 🎯 Overview

EPIModel Next is a web application built with **Next.js 12**, **TypeScript**, **Redux Toolkit**, and **D3.js** to visualize and simulate COVID-19 epidemiological models in Paraguay.

### Technology Stack

- **Framework**: Next.js 12.1.5
- **Language**: TypeScript 5.0.0
- **State Management**: Redux Toolkit + next-redux-wrapper
- **Visualization**: D3.js 7.4.4
- **Styles**: Tailwind CSS 3.0.24
- **Internationalization**: next-i18next
- **HTTP Client**: Axios
- **Testing**: (To be implemented)

---

## 🏗️ Architectural Principles

### 1. Separation of Concerns (SoC)
Each module, component, and function must have a single, well-defined responsibility.

### 2. Functional Components
- Exclusive use of functional components with Hooks
- Avoid classes except for Error Boundaries
- Prefer composition over inheritance

### 3. Type Safety
- TypeScript in strict mode
- Interfaces for all data structures
- Explicit typing in public functions

### 4. Immutability
- Immutable state in Redux
- Avoid direct mutations
- Use immutable data structures

### 5. Reusability
- Reusable and composable components
- Custom hooks for shared logic
- Generic and modular utilities

---

## 📁 Directory Structure

```
epimodel-next/
├── components/          # Reusable React components
│   ├── Layout/         # Layout components (Header, Footer)
│   ├── MainGraph/      # Main chart components
│   ├── SimulationGraph/# Simulation chart components
│   ├── ErrorBoundary/  # Error handling
│   └── utils/          # Utility components
│
├── pages/              # Next.js pages (routing)
│   ├── _app.tsx       # Global app configuration
│   ├── index.tsx      # Main page (charts)
│   └── Simulador.tsx  # Simulator page
│
├── store/              # Redux configuration
│   ├── store.ts       # Store configuration
│   └── reducers/      # Redux Toolkit reducers
│
├── services/           # API services
│   └── api.ts         # HTTP client and API logic
│
├── hooks/              # Custom Hooks
│   ├── useApi.ts      # Hook for API calls
│   └── ...            # Other custom hooks
│
├── types/              # TypeScript type definitions
│   └── api.ts         # API-related types
│
├── utils/              # Utilities and helpers
│   ├── constants.ts   # Application constants
│   ├── descriptions.ts# Chart line descriptions
│   └── index.ts       # General utilities
│
├── config/             # Configuration
│   └── environment.ts # Environment configuration
│
├── styles/             # Global styles
│   └── globals.css    # Global CSS styles
│
├── public/             # Static files
│   ├── assets/        # Images, icons
│   └── locales/       # Translation files
│
└── nginx/              # Nginx configuration (production)
```

### Naming Conventions

- **Components**: PascalCase (e.g., `MainGraph.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useApi.ts`)
- **Utilities**: camelCase (e.g., `constants.ts`)
- **Types/Interfaces**: PascalCase (e.g., `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Files**: kebab-case for configurations (e.g., `next.config.js`)

---

## 🎨 Application Layers

### 1. Presentation Layer (UI)
**Location**: `components/`, `pages/`

- Pure React components
- No business logic
- Typed props with TypeScript
- Responsive with Tailwind CSS

**Responsibilities**:
- Render UI
- Handle user interactions
- Display loading and error states

### 2. Business Logic Layer
**Location**: `hooks/`, `store/reducers/`

- Custom hooks for reusable logic
- Redux reducers for global state
- Memoized selectors for performance

**Responsibilities**:
- Transform data
- Validate inputs
- Manage application state

### 3. Service Layer
**Location**: `services/`

- Centralized HTTP client
- API error handling
- API data transformation

**Responsibilities**:
- Backend communication
- Network error handling
- Cache and request deduplication

### 4. Data Layer
**Location**: `types/`, `store/`

- TypeScript type definitions
- Redux global state
- Data interfaces

**Responsibilities**:
- Define data structures
- Manage application state
- Validate types at compile time

---

## 🎭 Design Patterns

### 1. Container/Presentational Pattern
- **Containers**: Pages and components that handle state
- **Presentational**: Pure components that only render

### 2. Custom Hooks Pattern
- Reusable logic encapsulated in hooks
- Separation of logic and presentation
- Example: `useApi`, `useDimensions`

### 3. Service Layer Pattern
- Centralized API client in `services/api.ts`
- Typed methods for each endpoint
- Centralized error handling

### 4. Redux Toolkit Slice Pattern
- Slices organized by domain
- Actions and reducers in the same file
- Memoized selectors for performance

### 5. Error Boundary Pattern
- Error Boundaries to catch React errors
- API error handling in services
- User-friendly error messages

---

## 📊 State Management

### Redux Toolkit

**Store Structure**:
```typescript
{
  graphInfo: {
    main: {
      reported: MainGraphData,
      hospitalized: MainGraphData,
      ICU: MainGraphData,
      deceases: MainGraphData,
      lastUpdateDate: string | null
    },
    simulation: {
      cumulative: SimulationGraphData,
      cumulative_deaths: SimulationGraphData,
      // ... other simulation charts
    }
  }
}
```

### Principles

1. **Global State**: Only for data shared between multiple components
2. **Local State**: Use `useState` for component state
3. **Memoized Selectors**: Use `createSelector` for complex selectors
4. **Immutability**: Never mutate state directly
5. **Normalization**: Maintain normalized data structure

### Data Flow

```
API Service → Redux Action → Reducer → Selector → Component
```

---

## 🚨 Error Handling

### Error Handling Levels

1. **Error Boundaries**: Catch React errors
2. **API Service**: Handle network and HTTP errors
3. **Redux Reducers**: Handle state errors
4. **Components**: Display error messages to users

### Strategy

- **Network Errors**: Show generic message and retry option
- **API Errors**: Show specific server message
- **Validation Errors**: Show inline messages in forms
- **Unexpected Errors**: Log to console and show generic message

### Error Handling Example

```typescript
try {
  const data = await apiService.getProjections();
  // Process data
} catch (error) {
  if (error instanceof ApiServiceError) {
    // Handle API error
    console.error('API Error:', error.message);
  } else {
    // Handle unexpected error
    console.error('Unexpected error:', error);
  }
}
```

---

## 🧪 Testing

### Testing Strategy

1. **Unit Tests**: Functions and utilities
2. **Component Tests**: React components
3. **Integration Tests**: Complete flows
4. **E2E Tests**: Critical use cases

### Test Structure

```
__tests__/
├── components/
├── hooks/
├── services/
├── utils/
└── integration/
```

### Recommended Tools

- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **MSW**: Mock Service Worker for API
- **Cypress**: E2E testing (optional)

---

## 📝 Code Conventions

### TypeScript

- **Strict Mode**: Enabled
- **No Implicit Any**: Enabled
- **Interfaces over Types**: Prefer interfaces for objects
- **Type Imports**: Use `import type` for type imports

### React

- **Functional Components**: Always use functional components
- **Hooks**: Use custom hooks for reusable logic
- **Props**: Type all props with interfaces
- **Memoization**: Use `useMemo` and `useCallback` when necessary

### Naming Conventions

- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Files**: kebab-case for config, camelCase for code

### Code Organization

1. **Imports**: Ordered by type (React, libraries, components, utils, types)
2. **Components**: Props interface, component, export
3. **Hooks**: Logic, effects, return
4. **Services**: Class, public methods, private methods

---

## ✅ Best Practices

### Performance

1. **Code Splitting**: Use dynamic imports for large components
2. **Memoization**: Use `React.memo`, `useMemo`, `useCallback`
3. **Lazy Loading**: Load components and data on demand
4. **Image Optimization**: Use Next.js Image component
5. **Bundle Size**: Monitor and optimize bundle size

### Accessibility

1. **ARIA Labels**: Add appropriate labels
2. **Keyboard Navigation**: Full keyboard support
3. **Screen Readers**: Accessible content for screen readers
4. **Color Contrast**: Meet WCAG AA minimum

### Security

1. **XSS Prevention**: Sanitize user inputs
2. **CSRF Protection**: Use CSRF tokens for forms
3. **Environment Variables**: Don't expose secrets in the client
4. **HTTPS**: Use HTTPS in production

### Internationalization

1. **i18n**: Use next-i18next for translations
2. **Locale Files**: Keep translations in `public/locales/`
3. **Date/Number Formatting**: Use local formats
4. **RTL Support**: Consider RTL support if necessary

### Documentation

1. **JSDoc**: Document public functions
2. **README**: Keep README updated
3. **Comments**: Comments for complex logic
4. **Type Definitions**: Descriptive and documented types

---

## 🔄 Development Flow

### 1. Create Feature Branch
```bash
git checkout -b feature/feature-name
```

### 2. Development
- Follow code conventions
- Write tests
- Update documentation

### 3. Code Review
- Review changes
- Verify tests
- Validate TypeScript types

### 4. Merge
- Merge to main after approval
- Automatic deploy to staging/production

---

## 📚 References

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [D3.js Documentation](https://d3js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🔍 Architecture Checklist

- [x] Separation of concerns
- [x] TypeScript in strict mode
- [x] Functional components
- [x] State management with Redux
- [x] Robust error handling
- [x] Internationalization
- [ ] Unit tests
- [ ] Integration tests
- [ ] Component documentation
- [ ] Performance optimization
- [ ] Complete accessibility
- [ ] SEO optimization

---

**Last updated**: 2024
**Version**: 1.0.0
