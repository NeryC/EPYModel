# Arquitectura del Proyecto EPIModel Next

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Principios Arquitectónicos](#principios-arquitectónicos)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Capas de la Aplicación](#capas-de-la-aplicación)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Gestión de Estado](#gestión-de-estado)
7. [Manejo de Errores](#manejo-de-errores)
8. [Testing](#testing)
9. [Convenciones de Código](#convenciones-de-código)
10. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Visión General

EPIModel Next es una aplicación web construida con **Next.js 12**, **TypeScript**, **Redux Toolkit**, y **D3.js** para visualizar y simular modelos epidemiológicos del COVID-19 en Paraguay.

### Stack Tecnológico

- **Framework**: Next.js 12.1.5
- **Lenguaje**: TypeScript 5.0.0
- **Gestión de Estado**: Redux Toolkit + next-redux-wrapper
- **Visualización**: D3.js 7.4.4
- **Estilos**: Tailwind CSS 3.0.24
- **Internacionalización**: next-i18next
- **HTTP Client**: Axios
- **Testing**: (Por implementar)

---

## 🏗️ Principios Arquitectónicos

### 1. Separación de Responsabilidades (SoC)
Cada módulo, componente y función debe tener una responsabilidad única y bien definida.

### 2. Componentes Funcionales
- Uso exclusivo de componentes funcionales con Hooks
- Evitar clases excepto para Error Boundaries
- Preferir composición sobre herencia

### 3. Type Safety
- TypeScript en modo estricto
- Interfaces para todas las estructuras de datos
- Tipado explícito en funciones públicas

### 4. Inmutabilidad
- Estado inmutable en Redux
- Evitar mutaciones directas
- Uso de estructuras de datos inmutables

### 5. Reutilización
- Componentes reutilizables y composables
- Hooks personalizados para lógica compartida
- Utilidades genéricas y modulares

---

## 📁 Estructura de Directorios

```
epimodel-next/
├── components/          # Componentes React reutilizables
│   ├── Layout/         # Componentes de layout (Header, Footer)
│   ├── MainGraph/      # Componentes de gráficos principales
│   ├── SimulationGraph/# Componentes de gráficos de simulación
│   ├── ErrorBoundary/  # Manejo de errores
│   └── utils/          # Componentes utilitarios
│
├── pages/              # Páginas de Next.js (routing)
│   ├── _app.tsx       # Configuración global de la app
│   ├── index.tsx      # Página principal (gráficos)
│   └── Simulador.tsx  # Página de simulador
│
├── store/              # Configuración de Redux
│   ├── store.ts       # Configuración del store
│   └── reducers/      # Reducers de Redux Toolkit
│
├── services/           # Servicios de API
│   └── api.ts         # Cliente HTTP y lógica de API
│
├── hooks/              # Custom Hooks
│   ├── useApi.ts      # Hook para llamadas API
│   └── ...            # Otros hooks personalizados
│
├── types/              # Definiciones de tipos TypeScript
│   └── api.ts         # Tipos relacionados con API
│
├── utils/              # Utilidades y helpers
│   ├── constants.ts   # Constantes de la aplicación
│   ├── descriptions.ts# Descripciones de líneas de gráficos
│   └── index.ts       # Utilidades generales
│
├── config/             # Configuración
│   └── environment.ts # Configuración de entorno
│
├── styles/             # Estilos globales
│   └── globals.css    # Estilos CSS globales
│
├── public/             # Archivos estáticos
│   ├── assets/        # Imágenes, iconos
│   └── locales/       # Archivos de traducción
│
└── nginx/              # Configuración de Nginx (producción)
```

### Convenciones de Nombres

- **Componentes**: PascalCase (ej: `MainGraph.tsx`)
- **Hooks**: camelCase con prefijo "use" (ej: `useApi.ts`)
- **Utilidades**: camelCase (ej: `constants.ts`)
- **Tipos/Interfaces**: PascalCase (ej: `ApiResponse`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_URL`)
- **Archivos**: kebab-case para configuraciones (ej: `next.config.js`)

---

## 🎨 Capas de la Aplicación

### 1. Capa de Presentación (UI)
**Ubicación**: `components/`, `pages/`

- Componentes React puros
- Sin lógica de negocio
- Props tipadas con TypeScript
- Responsive con Tailwind CSS

**Responsabilidades**:
- Renderizar UI
- Manejar interacciones del usuario
- Mostrar estados de carga y errores

### 2. Capa de Lógica de Negocio
**Ubicación**: `hooks/`, `store/reducers/`

- Hooks personalizados para lógica reutilizable
- Reducers de Redux para estado global
- Selectors memoizados para performance

**Responsabilidades**:
- Transformar datos
- Validar inputs
- Gestionar estado de la aplicación

### 3. Capa de Servicios
**Ubicación**: `services/`

- Cliente HTTP centralizado
- Manejo de errores de API
- Transformación de datos de API

**Responsabilidades**:
- Comunicación con backend
- Manejo de errores de red
- Cache y deduplicación de requests

### 4. Capa de Datos
**Ubicación**: `types/`, `store/`

- Definiciones de tipos TypeScript
- Estado global de Redux
- Interfaces de datos

**Responsabilidades**:
- Definir estructuras de datos
- Gestionar estado de la aplicación
- Validar tipos en tiempo de compilación

---

## 🎭 Patrones de Diseño

### 1. Container/Presentational Pattern
- **Containers**: Páginas y componentes que manejan estado
- **Presentational**: Componentes puros que solo renderizan

### 2. Custom Hooks Pattern
- Lógica reutilizable encapsulada en hooks
- Separación de lógica y presentación
- Ejemplo: `useApi`, `useDimensions`

### 3. Service Layer Pattern
- Cliente API centralizado en `services/api.ts`
- Métodos tipados para cada endpoint
- Manejo centralizado de errores

### 4. Redux Toolkit Slice Pattern
- Slices organizados por dominio
- Actions y reducers en el mismo archivo
- Selectors memoizados para performance

### 5. Error Boundary Pattern
- Error Boundaries para capturar errores de React
- Manejo de errores de API en servicios
- Mensajes de error user-friendly

---

## 📊 Gestión de Estado

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
      // ... otros gráficos de simulación
    }
  }
}
```

### Principios

1. **Estado Global**: Solo para datos compartidos entre múltiples componentes
2. **Estado Local**: Usar `useState` para estado de componente
3. **Selectors Memoizados**: Usar `createSelector` para selectors complejos
4. **Inmutabilidad**: Nunca mutar el estado directamente
5. **Normalización**: Mantener estructura de datos normalizada

### Flujo de Datos

```
API Service → Redux Action → Reducer → Selector → Component
```

---

## 🚨 Manejo de Errores

### Niveles de Manejo de Errores

1. **Error Boundaries**: Capturan errores de React
2. **API Service**: Maneja errores de red y HTTP
3. **Redux Reducers**: Manejan errores de estado
4. **Componentes**: Muestran mensajes de error al usuario

### Estrategia

- **Errores de Red**: Mostrar mensaje genérico y opción de reintento
- **Errores de API**: Mostrar mensaje específico del servidor
- **Errores de Validación**: Mostrar mensajes inline en formularios
- **Errores Inesperados**: Registrar en consola y mostrar mensaje genérico

### Ejemplo de Error Handling

```typescript
try {
  const data = await apiService.getProjections();
  // Procesar datos
} catch (error) {
  if (error instanceof ApiServiceError) {
    // Manejar error de API
    console.error('API Error:', error.message);
  } else {
    // Manejar error inesperado
    console.error('Unexpected error:', error);
  }
}
```

---

## 🧪 Testing

### Estrategia de Testing

1. **Unit Tests**: Funciones y utilidades
2. **Component Tests**: Componentes React
3. **Integration Tests**: Flujos completos
4. **E2E Tests**: Casos de uso críticos

### Estructura de Tests

```
__tests__/
├── components/
├── hooks/
├── services/
├── utils/
└── integration/
```

### Herramientas Recomendadas

- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **MSW**: Mock Service Worker para API
- **Cypress**: E2E testing (opcional)

---

## 📝 Convenciones de Código

### TypeScript

- **Strict Mode**: Habilitado
- **No Implicit Any**: Habilitado
- **Interfaces sobre Types**: Preferir interfaces para objetos
- **Type Imports**: Usar `import type` para imports de tipos

### React

- **Functional Components**: Siempre usar componentes funcionales
- **Hooks**: Usar hooks personalizados para lógica reutilizable
- **Props**: Tipar todas las props con interfaces
- **Memoización**: Usar `useMemo` y `useCallback` cuando sea necesario

### Naming Conventions

- **Componentes**: PascalCase
- **Funciones**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Tipos/Interfaces**: PascalCase
- **Archivos**: kebab-case para config, camelCase para código

### Code Organization

1. **Imports**: Ordenados por tipo (React, librerías, componentes, utils, tipos)
2. **Componentes**: Props interface, componente, export
3. **Hooks**: Lógica, efectos, return
4. **Services**: Clase, métodos públicos, métodos privados

---

## ✅ Mejores Prácticas

### Performance

1. **Code Splitting**: Usar dynamic imports para componentes grandes
2. **Memoización**: Usar `React.memo`, `useMemo`, `useCallback`
3. **Lazy Loading**: Cargar componentes y datos bajo demanda
4. **Image Optimization**: Usar Next.js Image component
5. **Bundle Size**: Monitorear y optimizar tamaño del bundle

### Accesibilidad

1. **ARIA Labels**: Agregar labels apropiados
2. **Keyboard Navigation**: Soporte completo de teclado
3. **Screen Readers**: Contenido accesible para lectores de pantalla
4. **Color Contrast**: Cumplir con WCAG AA mínimo

### Seguridad

1. **XSS Prevention**: Sanitizar inputs del usuario
2. **CSRF Protection**: Usar tokens CSRF para formularios
3. **Environment Variables**: No exponer secretos en el cliente
4. **HTTPS**: Usar HTTPS en producción

### Internacionalización

1. **i18n**: Usar next-i18next para traducciones
2. **Locale Files**: Mantener traducciones en `public/locales/`
3. **Date/Number Formatting**: Usar formatos locales
4. **RTL Support**: Considerar soporte RTL si es necesario

### Documentación

1. **JSDoc**: Documentar funciones públicas
2. **README**: Mantener README actualizado
3. **Comments**: Comentarios para lógica compleja
4. **Type Definitions**: Tipos descriptivos y documentados

---

## 🔄 Flujo de Desarrollo

### 1. Crear Feature Branch
```bash
git checkout -b feature/nombre-feature
```

### 2. Desarrollo
- Seguir convenciones de código
- Escribir tests
- Actualizar documentación

### 3. Code Review
- Revisar cambios
- Verificar tests
- Validar tipos TypeScript

### 4. Merge
- Merge a main después de aprobación
- Deploy automático a staging/producción

---

## 📚 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [D3.js Documentation](https://d3js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🔍 Checklist de Arquitectura

- [x] Separación de responsabilidades
- [x] TypeScript en modo estricto
- [x] Componentes funcionales
- [x] Gestión de estado con Redux
- [x] Manejo de errores robusto
- [x] Internacionalización
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Documentación de componentes
- [ ] Performance optimization
- [ ] Accesibilidad completa
- [ ] SEO optimization

---

**Última actualización**: 2024
**Versión**: 1.0.0

