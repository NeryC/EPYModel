# CLAUDE.md — EPIModel Next (Frontend)

Documentación completa en `docs/`. Lee primero los docs antes de hacer cambios.

## Proyecto

Visualizador de modelos epidemiológicos COVID-19 para Paraguay (proyecto PINV20-40, CONACYT).
Dos páginas: proyecciones (`/`) y simulador SEIR-H (`/Simulador`).

## Stack

- **Next.js 16** + **React 19** + **TypeScript 5** (strict mode)
- **Redux Toolkit** + **next-redux-wrapper** (estado global)
- **D3.js 7** (gráficos interactivos)
- **Tailwind CSS 3** (estilos)
- **next-i18next** (i18n: `es` default, `en`)
- **Axios** (HTTP)

## Comandos

```bash
yarn dev        # Desarrollo en localhost:3000
yarn build      # Build producción
yarn start      # Servidor producción
yarn lint       # ESLint
```

## Variables de entorno

Copiar `.env.example` a `.env.local`. Las importantes:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001   # auto-detectado por NODE_ENV
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_DEBUG_LOGS=false
```

El backend debe correr en el puerto `3001`.

## Estructura clave

```
components/     # Componentes React organizados por feature
pages/          # Rutas Next.js (_app.tsx, index.tsx, Simulador.tsx)
store/          # Redux (graphInfoSlice.ts)
services/       # ApiService centralizado (Axios)
hooks/          # Custom hooks (useApi, useDimensions, useResize...)
types/          # Tipos TypeScript globales
utils/          # Constantes y helpers
config/         # environment.ts (variables de entorno tipadas)
public/locales/ # Archivos de traducción (es/en)
docs/           # Documentación detallada
```

## Patrones de código

- Componentes funcionales TypeScript con props tipadas
- Imports con alias `@/` (ej: `@/components/`, `@/store/`)
- Redux: acciones en slice, selectores memoizados
- API: siempre a través de `ApiService` en `services/api.ts`
- i18n: `const { t } = useTranslation('common')` en todos los componentes
- `useMemo`/`useCallback` para cálculos costosos de D3

## Flujo de datos

```
Backend API → ApiService → Redux dispatch → Selector → Componente → D3.js
```

## Colores del tema (Tailwind)

```
gray-theme, default-text, back, deep-blue, dark-blue, text-secondary, light-background
```

## Docs disponibles

- `docs/ARCHITECTURE.md` — Arquitectura detallada
- `docs/CODE_QUALITY.md` — Reporte de calidad
- `docs/IMPLEMENTATION_SUMMARY.md` — Resumen de implementación
