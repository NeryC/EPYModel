# 📊 EPIModel Next - Sistema de Visualización de Modelos Epidemiológicos

<div align="center">

![EPIModel Logo](public/logo.png)

**Sistema web para visualización y simulación de modelos epidemiológicos del COVID-19 en Paraguay**

[![Next.js](https://img.shields.io/badge/Next.js-12.1.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-4.2.0-purple?style=for-the-badge&logo=redux)](https://redux.js.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.4.4-orange?style=for-the-badge&logo=d3.js)](https://d3js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.24-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Arquitectura](#-arquitectura) • [Contribuir](#-contribuir)

</div>

---

## 📑 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración para Producción](#-configuración-para-producción)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Documentación Adicional](#-documentación-adicional)

---

## 🎯 Descripción

**EPIModel Next** es una aplicación web moderna desarrollada para visualizar y simular modelos epidemiológicos del COVID-19 en Paraguay. La aplicación permite a los usuarios:

- **Visualizar proyecciones** de casos reportados, hospitalizaciones, cuidados intensivos y fallecimientos
- **Simular escenarios** con diferentes parámetros epidemiológicos (Rt, UCI threshold, V filtered, lambda I to H)
- **Analizar datos** mediante gráficos interactivos construidos con D3.js
- **Exportar datos** en formatos CSV para análisis externos

La aplicación está construida con Next.js 12, TypeScript, Redux Toolkit para gestión de estado, y D3.js para visualización de datos. Incluye soporte multiidioma (Español e Inglés) y está optimizada para rendimiento y accesibilidad.

---

## ✨ Características

### 📈 Visualización de Datos

- **Gráficos Interactivos**: Visualización de datos epidemiológicos con D3.js
- **Múltiples Escenarios**: Comparación de diferentes escenarios epidemiológicos
- **Filtros y Configuración**: Personalización de visualizaciones con múltiples opciones
- **Rangos de Fechas**: Selección de rangos temporales para análisis
- **Incertidumbre**: Visualización de intervalos de incertidumbre en proyecciones

### 🧪 Simulación de Modelos

- **Parámetros Personalizables**: 
  - **Rt (Número Reproductivo)**: Valor único o serie temporal
  - **UCI Threshold**: Umbral de capacidad de cuidados intensivos
  - **V Filtered**: Parámetro de filtración
  - **Lambda I to H**: Tasa de transición de infectados a hospitalizados
- **Ejecución en Tiempo Real**: Simulaciones ejecutadas en el backend
- **Visualización de Resultados**: Múltiples gráficos de simulación simultáneos

### 🌐 Internacionalización

- **Soporte Multiidioma**: Español e Inglés
- **Cambio Dinámico**: Cambio de idioma sin recargar la página
- **Formateo Localizado**: Fechas y números formateados según el idioma

### 🎨 Interfaz de Usuario

- **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- **Tema Consistente**: Diseño coherente con Tailwind CSS
- **Accesibilidad**: Cumplimiento de estándares WCAG
- **Error Handling**: Manejo robusto de errores con mensajes user-friendly

### ⚡ Performance

- **Server-Side Rendering**: Renderizado en el servidor para mejor SEO
- **Code Splitting**: Carga bajo demanda de componentes
- **Optimización de Imágenes**: Optimización automática de imágenes
- **Caching**: Cache inteligente de requests API

---

## 🛠️ Tecnologías

### Core

- **[Next.js 12.1.5](https://nextjs.org/)** - Framework React para producción
- **[React 18.1.0](https://reactjs.org/)** - Biblioteca de UI
- **[TypeScript 5.0.0](https://www.typescriptlang.org/)** - Lenguaje de programación tipado

### Estado y Datos

- **[Redux Toolkit 1.8.3](https://redux-toolkit.js.org/)** - Gestión de estado
- **[Axios 0.27.2](https://axios-http.com/)** - Cliente HTTP
- **[D3.js 7.4.4](https://d3js.org/)** - Visualización de datos

### Estilos y UI

- **[Tailwind CSS 3.0.24](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Headless UI 1.6.0](https://headlessui.com/)** - Componentes UI sin estilos
- **[Heroicons 1.0.6](https://heroicons.com/)** - Iconos SVG
- **[Font Awesome 6.1.1](https://fontawesome.com/)** - Iconos adicionales

### Internacionalización

- **[next-i18next 12.0.1](https://github.com/isaachinman/next-i18next)** - Internacionalización para Next.js

### Utilidades

- **[Lodash 4.17.21](https://lodash.com/)** - Utilidades de JavaScript
- **[file-saver 2.0.5](https://github.com/eligrey/FileSaver.js/)** - Guardado de archivos
- **[react-csv 2.2.2](https://github.com/react-csv/react-csv)** - Exportación a CSV
- **[js-cookie 3.0.1](https://github.com/js-cookie/js-cookie)** - Manejo de cookies

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 16.x o superior
- **Yarn** 1.x o superior (gestor de paquetes)
- **Git** para control de versiones

### Verificar Instalación

```bash
node --version  # Debe ser v16.x o superior
yarn --version  # Debe ser 1.x o superior
git --version   # Cualquier versión reciente
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/epimodel-next.git
cd epimodel-next
```

### 2. Instalar Dependencias

```bash
yarn install
```

### 3. Configurar Variables de Entorno (Opcional)

> **Nota**: La `API_URL` se configura automáticamente según el `NODE_ENV`:
> - **Development** (`yarn dev`): `http://localhost:3001`
> - **Production** (`yarn build && yarn start`): `http://epymodel.uaa.edu.py:3001`
> 
> Solo necesitas crear `.env.local` si deseas personalizar la configuración.

Crea un archivo `.env.local` en la raíz del proyecto (opcional):

```bash
cp .env.example .env.local
```

Edita `.env.local` solo si necesitas personalizar valores:

```env
# API Configuration (Opcional - se determina automáticamente por NODE_ENV)
# NEXT_PUBLIC_API_URL=http://localhost:3001  # Solo si necesitas override
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3

# Environment (automático - no es necesario configurar)
# NODE_ENV=development  # Next.js lo configura automáticamente

# Feature Flags
NEXT_PUBLIC_DEBUG_LOGS=false
NEXT_PUBLIC_ERROR_REPORTING=false
```

### 4. Iniciar el Servidor de Desarrollo

```bash
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 🚀 Configuración para Producción

### Crear Archivo de Entorno para Producción

Para producción, puedes crear un archivo `.env.production` o configurar las variables de entorno en tu plataforma de despliegue.

#### Opción 1: Archivo `.env.production` (Local)

Crea un archivo `.env.production` en la raíz del proyecto:

```bash
cp .env.example .env.production
```

Edita `.env.production` con los valores para producción:

```env
# API Configuration
# La API_URL se configura automáticamente como http://epymodel.uaa.edu.py:3001
# cuando NODE_ENV=production, pero puedes override si es necesario
# NEXT_PUBLIC_API_URL=http://epymodel.uaa.edu.py:3001

# Timeout de requests API (ms)
NEXT_PUBLIC_API_TIMEOUT=30000

# Intentos de retry
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3

# Feature Flags para Producción
NEXT_PUBLIC_DEBUG_LOGS=false
NEXT_PUBLIC_ERROR_REPORTING=true

# NODE_ENV se configura automáticamente al hacer yarn build
# No es necesario definirla manualmente
```

#### Opción 2: Variables de Entorno en Plataforma de Despliegue

**Vercel:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables:
   - `NEXT_PUBLIC_API_URL` (opcional, se configura automáticamente)
   - `NEXT_PUBLIC_API_TIMEOUT` (opcional)
   - `NEXT_PUBLIC_API_RETRY_ATTEMPTS` (opcional)
   - `NEXT_PUBLIC_DEBUG_LOGS=false`
   - `NEXT_PUBLIC_ERROR_REPORTING=true`
   - `NODE_ENV=production` (automático)

**Netlify:**
1. Ve a Site settings → Build & deploy → Environment
2. Agrega las variables de entorno (igual que Vercel)

**Docker:**
```bash
# Usar variables de entorno al ejecutar el contenedor
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_DEBUG_LOGS=false \
  -e NEXT_PUBLIC_ERROR_REPORTING=true \
  epimodel-next
```

**Servidor VPS/Cloud:**
```bash
# Crear archivo .env.production
nano .env.production

# O exportar variables antes de ejecutar
export NODE_ENV=production
export NEXT_PUBLIC_DEBUG_LOGS=false
export NEXT_PUBLIC_ERROR_REPORTING=true

# Luego ejecutar
yarn build
yarn start
```

### Build y Deploy para Producción

```bash
# 1. Construir la aplicación (NODE_ENV se establece automáticamente como 'production')
yarn build

# 2. Iniciar el servidor de producción
yarn start

# La aplicación usará automáticamente:
# - API_URL: http://epymodel.uaa.edu.py:3001
# - NODE_ENV: production
```

### Verificar Configuración de Producción

Para verificar que la configuración es correcta:

```bash
# En desarrollo, verás en los logs:
# API_URL: http://localhost:3001

# En producción, verás en los logs:
# Production mode: Using API URL: http://epymodel.uaa.edu.py:3001
```

### Resumen de Configuración por Entorno

| Entorno | NODE_ENV | API_URL | Debug Logs | Error Reporting |
|---------|----------|---------|------------|-----------------|
| **Development** | `development` | `http://localhost:3001` | `false` (opcional) | `false` (opcional) |
| **Production** | `production` | `http://epymodel.uaa.edu.py:3001` | `false` | `true` (recomendado) |
| **Test** | `test` | `http://localhost:3001` | `false` | `false` |

> **Nota importante**: La `API_URL` se configura automáticamente según `NODE_ENV`. No necesitas definirla manualmente a menos que necesites usar una URL diferente.

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto | Requerido |
|----------|-------------|-------------------|-----------|
| `NEXT_PUBLIC_API_URL` | URL del backend API | **Automático según NODE_ENV**<br>- Development: `http://localhost:3001`<br>- Production: `http://epymodel.uaa.edu.py:3001` | No |
| `NEXT_PUBLIC_API_TIMEOUT` | Timeout de requests API (ms) | `30000` | No |
| `NEXT_PUBLIC_API_RETRY_ATTEMPTS` | Intentos de retry para requests fallidos | `3` | No |
| `NEXT_PUBLIC_DEBUG_LOGS` | Habilitar logs de debug | `false` | No |
| `NEXT_PUBLIC_ERROR_REPORTING` | Habilitar reporte de errores | `false` | No |
| `NODE_ENV` | Modo de ejecución | Automático (Next.js lo configura)<br>- `development` (yarn dev)<br>- `production` (yarn build) | No |

**Nota importante**: La `API_URL` se configura automáticamente según el entorno. Solo necesitas definir `NEXT_PUBLIC_API_URL` si deseas usar una URL diferente a la predeterminada.

### Configuración de Next.js

El archivo `next.config.js` contiene la configuración de Next.js:

```javascript
const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: false,
  i18n,
};
```

### Configuración de TypeScript

El archivo `tsconfig.json` contiene la configuración de TypeScript. Se recomienda habilitar el modo estricto para mejor type safety.

### Configuración de Tailwind CSS

El archivo `tailwind.config.js` contiene la configuración de Tailwind CSS con temas personalizados.

---

## 💻 Uso

### Página Principal (Gráficos)

La página principal muestra gráficos de proyecciones epidemiológicas:

- **Casos Reportados**: Proyección de casos reportados de COVID-19
- **Hospitalizados**: Proyección de casos hospitalizados
- **Cuidados Intensivos (UCI)**: Proyección de casos en UCI
- **Fallecimientos**: Proyección de fallecimientos

#### Características de los Gráficos

- **Selección de Líneas**: Mostrar/ocultar diferentes líneas de datos
- **Configuración de Visualización**:
  - Suavizado de líneas
  - Mostrar/ocultar incertidumbre
  - Mostrar/ocultar puntos de datos
- **Rango de Fechas**: Seleccionar rango de fechas para visualizar
- **Exportación**: Descargar datos en formato CSV

### Página de Simulador

La página de simulador permite ejecutar simulaciones con parámetros personalizados:

#### Parámetros de Simulación

1. **Rt (Número Reproductivo)**
   - Valor único: Número decimal
   - Serie temporal: Lista de valores separados por comas

2. **UCI Threshold**
   - Umbral de capacidad de cuidados intensivos

3. **V Filtered**
   - Parámetro de filtración

4. **Lambda I to H**
   - Tasa de transición de infectados a hospitalizados

#### Ejecutar Simulación

1. Ingresa los parámetros en el formulario
2. Haz clic en "Ejecutar Simulación"
3. Espera a que se complete la simulación
4. Visualiza los resultados en los gráficos

#### Gráficos de Simulación

Los siguientes gráficos se generan automáticamente:

- **Cumulative**: Casos acumulados
- **Cumulative Deaths**: Fallecimientos acumulados
- **Exposed**: Casos expuestos
- **Hospitalized**: Casos hospitalizados
- **Immune**: Casos inmunes
- **Infectious**: Casos infecciosos
- **Susceptible**: Casos susceptibles
- **UCI**: Casos en cuidados intensivos

---

## 🏗️ Arquitectura

Para información detallada sobre la arquitectura del proyecto, consulta el documento [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

### Resumen de Arquitectura

El proyecto sigue una arquitectura en capas:

1. **Capa de Presentación**: Componentes React
2. **Capa de Lógica de Negocio**: Hooks y Reducers
3. **Capa de Servicios**: Cliente API
4. **Capa de Datos**: Tipos y Estado

### Flujo de Datos

```
API Service → Redux Action → Reducer → Selector → Component
```

### Patrones de Diseño

- **Container/Presentational Pattern**: Separación de lógica y presentación
- **Custom Hooks Pattern**: Lógica reutilizable
- **Service Layer Pattern**: Cliente API centralizado
- **Redux Toolkit Slice Pattern**: Gestión de estado

---

## 📂 Estructura del Proyecto

```
epimodel-next/
├── components/          # Componentes React
│   ├── ErrorBoundary/  # Manejo de errores
│   ├── Layout/         # Layout components
│   ├── MainGraph/      # Gráficos principales
│   ├── SimulationGraph/# Gráficos de simulación
│   └── utils/          # Componentes utilitarios
│
├── pages/              # Páginas de Next.js
│   ├── _app.tsx       # Configuración global
│   ├── index.tsx      # Página principal
│   └── Simulador.tsx  # Página de simulador
│
├── store/              # Redux store
│   ├── store.ts       # Configuración del store
│   └── reducers/      # Reducers
│
├── services/           # Servicios API
│   └── api.ts         # Cliente HTTP
│
├── hooks/              # Custom hooks
│   ├── useApi.ts      # Hook para API
│   └── ...            # Otros hooks
│
├── types/              # Tipos TypeScript
│   └── api.ts         # Tipos de API
│
├── utils/              # Utilidades
│   ├── constants.ts   # Constantes
│   └── ...            # Otras utilidades
│
├── config/             # Configuración
│   └── environment.ts # Variables de entorno
│
├── docs/               # Documentación
│   ├── ARCHITECTURE.md            # Arquitectura del proyecto
│   ├── CODE_QUALITY.md            # Reporte de calidad de código
│   └── IMPLEMENTATION_SUMMARY.md  # Resumen de implementación
│
├── styles/             # Estilos
│   └── globals.css    # Estilos globales
│
├── public/             # Archivos estáticos
│   ├── assets/        # Imágenes e iconos
│   └── locales/       # Traducciones
│
└── nginx/              # Configuración Nginx
```

---

## 📜 Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
yarn dev

# Construir para producción
yarn build

# Iniciar servidor de producción
yarn start

# Ejecutar linter
yarn lint
```

### Producción

```bash
# Construir aplicación
yarn build

# Iniciar servidor de producción
yarn start
```

---

## 🐳 Despliegue

### Docker

El proyecto incluye configuración de Docker para despliegue en contenedores.

#### Construir Imagen

```bash
docker build -t epimodel-next .
```

#### Ejecutar Contenedor

**Sin variables de entorno (usa configuración automática):**
```bash
docker run -p 3000:3000 epimodel-next
```

**Con variables de entorno personalizadas:**
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_DEBUG_LOGS=false \
  -e NEXT_PUBLIC_ERROR_REPORTING=true \
  -e NEXT_PUBLIC_API_TIMEOUT=30000 \
  epimodel-next
```

**Con archivo .env.production:**
```bash
docker run -p 3000:3000 --env-file .env.production epimodel-next
```

#### Docker Compose

```bash
# Usa las variables de entorno definidas en docker-compose.yml
docker-compose up -d
```

**docker-compose.yml ejemplo:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_DEBUG_LOGS=false
      - NEXT_PUBLIC_ERROR_REPORTING=true
    # La API_URL se configura automáticamente
```

### Vercel

El proyecto está configurado para despliegue en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en **Settings → Environment Variables**:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   NEXT_PUBLIC_API_TIMEOUT=30000
   NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
   ```
   > **Nota**: `NODE_ENV` y `NEXT_PUBLIC_API_URL` se configuran automáticamente
3. Despliega automáticamente

**Configuración automática en Vercel:**
- `NODE_ENV=production` se establece automáticamente durante el build
- `NEXT_PUBLIC_API_URL` se configura automáticamente como `http://epymodel.uaa.edu.py:3001`

### Otras Plataformas

El proyecto puede desplegarse en cualquier plataforma que soporte Next.js:

#### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en **Site settings → Build & deploy → Environment**:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   ```
3. Build command: `yarn build`
4. Publish directory: `.next`
5. `NODE_ENV` y `NEXT_PUBLIC_API_URL` se configuran automáticamente

#### AWS Amplify

1. Conecta tu repositorio a AWS Amplify
2. Agrega variables de entorno en la consola de Amplify:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   ```
3. Build settings (automático para Next.js)
4. `NODE_ENV=production` se establece automáticamente

#### Azure App Service

1. Crea una App Service en Azure
2. Configura las variables de entorno en **Configuration → Application settings**:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   ```
3. `NODE_ENV=production` se establece automáticamente

#### Heroku

1. Crea una app en Heroku
2. Configura variables de entorno:
   ```bash
   heroku config:set NEXT_PUBLIC_DEBUG_LOGS=false
   heroku config:set NEXT_PUBLIC_ERROR_REPORTING=true
   heroku config:set NODE_ENV=production
   ```
3. Despliega:
   ```bash
   git push heroku main
   ```

#### Servidor VPS (Linux)

1. Clona el repositorio en el servidor
2. Instala dependencias: `yarn install`
3. Crea archivo `.env.production`:
   ```bash
   nano .env.production
   ```
4. Agrega las variables de entorno:
   ```env
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   NEXT_PUBLIC_API_TIMEOUT=30000
   NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
   ```
5. Construye y ejecuta:
   ```bash
   yarn build
   NODE_ENV=production yarn start
   ```
6. Usa PM2 para proceso persistente:
   ```bash
   npm install -g pm2
   pm2 start npm --name "epimodel-next" -- start
   pm2 save
   pm2 startup
   ```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests en modo watch
yarn test:watch

# Ejecutar tests con cobertura
yarn test:coverage
```

### Estructura de Tests

```
__tests__/
├── components/    # Tests de componentes
├── hooks/         # Tests de hooks
├── services/      # Tests de servicios
└── utils/         # Tests de utilidades
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Contribución

- Sigue las convenciones de código del proyecto
- Escribe tests para nuevas features
- Actualiza la documentación
- Mantén los commits descriptivos

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Nery Cano** - [LinkedIn](https://www.linkedin.com/in/nery-cano-dev/)

---

## 🙏 Agradecimientos

- Universidad Autónoma de Asunción (UAA)
- Equipo de desarrollo del backend
- Comunidad de Next.js
- Contribuidores de las librerías utilizadas

---

## 📞 Contacto

Para preguntas o sugerencias, por favor contacta a:

- **Email**: [tu-email@example.com](mailto:tu-email@example.com)
- **Website**: [http://epymodel.uaa.edu.py](http://epymodel.uaa.edu.py)

---

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Redux Toolkit](https://redux-toolkit.js.org/)
- [Documentación de D3.js](https://d3js.org/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## 📚 Documentación Adicional

Para más información sobre el proyecto, consulta la documentación adicional en la carpeta `docs/`:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Documentación completa de la arquitectura del proyecto
- **[CODE_QUALITY.md](./docs/CODE_QUALITY.md)** - Reporte de calidad de código y métricas
- **[IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Resumen de implementación y mejoras

> **Nota**: Para información sobre la API, consulta la sección de [Arquitectura](#-arquitectura) y el archivo `services/api.ts` que contiene la documentación completa del servicio API.

---

## 📊 Estadísticas del Proyecto

![GitHub stars](https://img.shields.io/github/stars/tu-usuario/epimodel-next?style=social)
![GitHub forks](https://img.shields.io/github/forks/tu-usuario/epimodel-next?style=social)
![GitHub issues](https://img.shields.io/github/issues/tu-usuario/epimodel-next)
![GitHub pull requests](https://img.shields.io/github/issues-pr/tu-usuario/epimodel-next)

---

<div align="center">

**Hecho con ❤️ para la comunidad**

⭐ Si te gusta este proyecto, dale una estrella ⭐

</div>
