# API Migration Guide

This document outlines the migration from the legacy API calls to the new optimized API service layer in epimodel-next.

## Overview

The frontend has been updated to use a new API service layer that provides:
- Type-safe API calls
- Better error handling
- Request deduplication and caching
- Loading states management
- Consistent response formatting

## New API Structure

### 1. API Service (`services/api.ts`)

The `ApiService` class provides a centralized way to make API calls:

```typescript
import { apiService } from '../services/api';

// Get projections data
const projections = await apiService.getProjections({ format: 'json' });

// Get simulation data
const simulation = await apiService.getSimulation({
  Rt: '[1.5, 2.0]',
  UCI_threshold: '100',
  V_filtered: '500',
  lambda_I_to_H: '0.1'
});
```

### 2. Custom Hooks (`hooks/useApi.ts`)

React hooks for API calls with built-in loading states and error handling:

```typescript
import { useProjections, useSimulation } from '../hooks/useApi';

function MyComponent() {
  const { data, loading, error, refetch } = useProjections();
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{/* Render data */}</div>;
}
```

### 3. TypeScript Types (`types/api.ts`)

Comprehensive type definitions for all API responses:

```typescript
interface SimulationData {
  cumulative: DataPoint[];
  cumulative_deaths: DataPoint[];
  exposed: DataPoint[];
  // ... other properties
}
```

## Endpoint Changes

### Old Endpoints (Legacy)
- `/projection-r` - Get reported projections
- `/projection-h` - Get hospitalized projections  
- `/projection-u` - Get ICU projections
- `/projection-f` - Get deceases projections
- `/get-simulation` - Get simulation with parameters
- `/get-first-simulation` - Get default simulation

### New Endpoints
- `/projections?format=json` - Get all projections in one call
- `/simulations` - Get simulation with parameters (RESTful)
- `/get-simulation` - Legacy endpoint (still supported)
- `/get-first-simulation` - Get default simulation
- `/get-first-simulation-2` - Execute and get simulation

## Migration Examples

### Before (Legacy)
```typescript
// Multiple API calls
const [reported, hospitalized, icu, deceases] = await Promise.all([
  axiosInstance.get("/projection-r"),
  axiosInstance.get("/projection-h"),
  axiosInstance.get("/projection-u"),
  axiosInstance.get("/projection-f"),
]);

const projectionData = {
  reported: reported.data,
  hospitalized: hospitalized.data,
  ICU: icu.data,
  deceases: deceases.data,
};
```

### After (New API)
```typescript
// Single API call
const projectionData = await apiService.getProjections({ format: 'json' });
```

## Error Handling

### Before
```typescript
try {
  const response = await axiosInstance.get('/endpoint');
  return response.data;
} catch (error) {
  console.error('Error:', error);
  // Generic error handling
}
```

### After
```typescript
try {
  const data = await apiService.getProjections();
  return data;
} catch (error) {
  if (error instanceof ApiError) {
    // Specific error handling based on error type
    console.error('API Error:', error.message, error.status);
  }
  throw error;
}
```

## Environment Configuration

The new system uses environment variables for configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
```

## Benefits

1. **Type Safety**: Full TypeScript support with compile-time type checking
2. **Better Error Handling**: Structured error responses with specific error types
3. **Performance**: Request deduplication and caching
4. **Consistency**: Standardized API response format
5. **Maintainability**: Centralized API logic
6. **Developer Experience**: Better debugging and logging

## Backward Compatibility

The legacy `axiosInstance` is still available for gradual migration:

```typescript
// Still works for existing code
import { axiosInstance } from '../utils';
```

## Next Steps

1. Update remaining components to use the new API service
2. Remove legacy API calls once migration is complete
3. Add API response caching for better performance
4. Implement retry logic for failed requests
