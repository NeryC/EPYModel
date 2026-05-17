# 📊 EPIModel Next - Epidemiological Model Visualization System

<div align="center">

![EPIModel Logo](public/logo.png)

**Web system for visualization and simulation of COVID-19 epidemiological models in Paraguay**

[![Next.js](https://img.shields.io/badge/Next.js-12.1.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-4.2.0-purple?style=for-the-badge&logo=redux)](https://redux.js.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.4.4-orange?style=for-the-badge&logo=d3.js)](https://d3js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.24-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📑 Table of Contents

- [Description](#-description)
- [Features](#-features)
- [Technologies](#-technologies)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Production Configuration](#-production-configuration)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Additional Documentation](#-additional-documentation)

---

## 🎯 Description

**EPIModel Next** is a modern web application developed to visualize and simulate COVID-19 epidemiological models in Paraguay. The application allows users to:

- **Visualize projections** of reported cases, hospitalizations, intensive care, and deaths
- **Simulate scenarios** with different epidemiological parameters (Rt, UCI threshold, V filtered, lambda I to H)
- **Analyze data** through interactive charts built with D3.js
- **Export data** in CSV format for external analysis

The application is built with Next.js 12, TypeScript, Redux Toolkit for state management, and D3.js for data visualization. It includes multi-language support (Spanish and English) and is optimized for performance and accessibility.

---

## ✨ Features

### 📈 Data Visualization

- **Interactive Charts**: Visualization of epidemiological data with D3.js
- **Multiple Scenarios**: Comparison of different epidemiological scenarios
- **Filters and Configuration**: Customization of visualizations with multiple options
- **Date Ranges**: Selection of time ranges for analysis
- **Uncertainty**: Visualization of uncertainty intervals in projections

### 🧪 Model Simulation

- **Customizable Parameters**:
  - **Rt (Reproductive Number)**: Single value or time series
  - **UCI Threshold**: Intensive care capacity threshold
  - **V Filtered**: Filtration parameter
  - **Lambda I to H**: Transition rate from infected to hospitalized
- **Real-Time Execution**: Simulations executed on the backend
- **Result Visualization**: Multiple simultaneous simulation charts

### 🌐 Internationalization

- **Multi-Language Support**: Spanish and English
- **Dynamic Change**: Language change without page reload
- **Localized Formatting**: Dates and numbers formatted according to language

### 🎨 User Interface

- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Consistent Theme**: Coherent design with Tailwind CSS
- **Accessibility**: WCAG standards compliance
- **Error Handling**: Robust error handling with user-friendly messages

### ⚡ Performance

- **Server-Side Rendering**: Server-side rendering for better SEO
- **Code Splitting**: On-demand component loading
- **Image Optimization**: Automatic image optimization
- **Caching**: Intelligent API request caching

---

## 🛠️ Technologies

### Core

- **[Next.js 12.1.5](https://nextjs.org/)** - React framework for production
- **[React 18.1.0](https://reactjs.org/)** - UI library
- **[TypeScript 5.0.0](https://www.typescriptlang.org/)** - Typed programming language

### State and Data

- **[Redux Toolkit 1.8.3](https://redux-toolkit.js.org/)** - State management
- **[Axios 0.27.2](https://axios-http.com/)** - HTTP client
- **[D3.js 7.4.4](https://d3js.org/)** - Data visualization

### Styles and UI

- **[Tailwind CSS 3.0.24](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Headless UI 1.6.0](https://headlessui.com/)** - Unstyled UI components
- **[Heroicons 1.0.6](https://heroicons.com/)** - SVG icons
- **[Font Awesome 6.1.1](https://fontawesome.com/)** - Additional icons

### Internationalization

- **[next-i18next 12.0.1](https://github.com/isaachinman/next-i18next)** - Internationalization for Next.js

### Utilities

- **[Lodash 4.17.21](https://lodash.com/)** - JavaScript utilities
- **[file-saver 2.0.5](https://github.com/eligrey/FileSaver.js/)** - File saving
- **[react-csv 2.2.2](https://github.com/react-csv/react-csv)** - CSV export
- **[js-cookie 3.0.1](https://github.com/js-cookie/js-cookie)** - Cookie handling

---

## 📋 Prerequisites

Before starting, make sure you have installed:

- **Node.js** 16.x or higher
- **Yarn** 1.x or higher (package manager)
- **Git** for version control

### Verify Installation

```bash
node --version  # Should be v16.x or higher
yarn --version  # Should be 1.x or higher
git --version   # Any recent version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tu-usuario/epimodel-next.git
cd epimodel-next
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Configure Environment Variables (Optional)

> **Note**: The `API_URL` is automatically configured based on `NODE_ENV`:
>
> - **Development** (`yarn dev`): `http://localhost:3001`
> - **Production** (`yarn build && yarn start`): `http://epymodel.uaa.edu.py:3001`
>
> You only need to create `.env.local` if you want to customize the configuration.

Create a `.env.local` file in the project root (optional):

```bash
cp .env.example .env.local
```

Edit `.env.local` only if you need to customize values:

```env
# API Configuration (Optional - automatically determined by NODE_ENV)
# NEXT_PUBLIC_API_URL=http://localhost:3001  # Only if you need to override
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3

# Environment (automatic - no need to configure)
# NODE_ENV=development  # Next.js configures this automatically

# Feature Flags
NEXT_PUBLIC_DEBUG_LOGS=false
NEXT_PUBLIC_ERROR_REPORTING=false
```

### 4. Start Development Server

```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 🚀 Production Configuration

### Create Production Environment File

For production, you can create a `.env.production` file or configure environment variables on your deployment platform.

#### Option 1: `.env.production` File (Local)

Create a `.env.production` file in the project root:

```bash
cp .env.example .env.production
```

Edit `.env.production` with production values:

```env
# API Configuration
# API_URL is automatically configured as http://epymodel.uaa.edu.py:3001
# when NODE_ENV=production, but you can override if necessary
# NEXT_PUBLIC_API_URL=http://epymodel.uaa.edu.py:3001

# API request timeout (ms)
NEXT_PUBLIC_API_TIMEOUT=30000

# Retry attempts
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3

# Production Feature Flags
NEXT_PUBLIC_DEBUG_LOGS=false
NEXT_PUBLIC_ERROR_REPORTING=true

# NODE_ENV is automatically set when running yarn build
# No need to define it manually
```

#### Option 2: Environment Variables on Deployment Platform

**Vercel:**

1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add the variables:
   - `NEXT_PUBLIC_API_URL` (optional, automatically configured)
   - `NEXT_PUBLIC_API_TIMEOUT` (optional)
   - `NEXT_PUBLIC_API_RETRY_ATTEMPTS` (optional)
   - `NEXT_PUBLIC_DEBUG_LOGS=false`
   - `NEXT_PUBLIC_ERROR_REPORTING=true`
   - `NODE_ENV=production` (automatic)

**Netlify:**

1. Go to Site settings → Build & deploy → Environment
2. Add environment variables (same as Vercel)

**Docker:**

```bash
# Use environment variables when running the container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_DEBUG_LOGS=false \
  -e NEXT_PUBLIC_ERROR_REPORTING=true \
  epimodel-next
```

**VPS/Cloud Server:**

```bash
# Create .env.production file
nano .env.production

# Or export variables before running
export NODE_ENV=production
export NEXT_PUBLIC_DEBUG_LOGS=false
export NEXT_PUBLIC_ERROR_REPORTING=true

# Then run
yarn build
yarn start
```

### Build and Deploy for Production

```bash
# 1. Build the application (NODE_ENV is automatically set to 'production')
yarn build

# 2. Start production server
yarn start

# The application will automatically use:
# - API_URL: http://epymodel.uaa.edu.py:3001
# - NODE_ENV: production
```

### Verify Production Configuration

To verify that the configuration is correct:

```bash
# In development, you will see in the logs:
# API_URL: http://localhost:3001

# In production, you will see in the logs:
# Production mode: Using API URL: http://epymodel.uaa.edu.py:3001
```

### Configuration Summary by Environment

| Environment     | NODE_ENV      | API_URL                           | Debug Logs         | Error Reporting      |
| --------------- | ------------- | --------------------------------- | ------------------ | -------------------- |
| **Development** | `development` | `http://localhost:3001`           | `false` (optional) | `false` (optional)   |
| **Production**  | `production`  | `http://epymodel.uaa.edu.py:3001` | `false`            | `true` (recommended) |
| **Test**        | `test`        | `http://localhost:3001`           | `false`            | `false`              |

> **Important note**: The `API_URL` is automatically configured based on `NODE_ENV`. You don't need to define it manually unless you need to use a different URL.

---

## ⚙️ Configuration

### Environment Variables

| Variable                         | Description                        | Default Value                                                                                                                | Required |
| -------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_URL`            | Backend API URL                    | **Automatic based on NODE_ENV**<br>- Development: `http://localhost:3001`<br>- Production: `http://epymodel.uaa.edu.py:3001` | No       |
| `NEXT_PUBLIC_API_TIMEOUT`        | API request timeout (ms)           | `30000`                                                                                                                      | No       |
| `NEXT_PUBLIC_API_RETRY_ATTEMPTS` | Retry attempts for failed requests | `3`                                                                                                                          | No       |
| `NEXT_PUBLIC_DEBUG_LOGS`         | Enable debug logs                  | `false`                                                                                                                      | No       |
| `NEXT_PUBLIC_ERROR_REPORTING`    | Enable error reporting             | `false`                                                                                                                      | No       |
| `NODE_ENV`                       | Execution mode                     | Automatic (Next.js configures it)<br>- `development` (yarn dev)<br>- `production` (yarn build)                               | No       |

**Important note**: The `API_URL` is automatically configured based on the environment. You only need to define `NEXT_PUBLIC_API_URL` if you want to use a different URL than the default.

### Next.js Configuration

The `next.config.js` file contains the Next.js configuration:

```javascript
const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: false,
  i18n,
};
```

### TypeScript Configuration

The `tsconfig.json` file contains the TypeScript configuration. It is recommended to enable strict mode for better type safety.

### Tailwind CSS Configuration

The `tailwind.config.js` file contains the Tailwind CSS configuration with custom themes.

---

## 💻 Usage

### Main Page (Charts)

The main page displays epidemiological projection charts:

- **Reported Cases**: Projection of reported COVID-19 cases
- **Hospitalized**: Projection of hospitalized cases
- **Intensive Care (UCI)**: Projection of UCI cases
- **Deaths**: Projection of deaths

#### Chart Features

- **Line Selection**: Show/hide different data lines
- **Visualization Configuration**:
  - Line smoothing
  - Show/hide uncertainty
  - Show/hide data points
- **Date Range**: Select date range to visualize
- **Export**: Download data in CSV format

### Simulator Page

The simulator page allows executing simulations with custom parameters:

#### Simulation Parameters

1. **Rt (Reproductive Number)**
   - Single value: Decimal number
   - Time series: Comma-separated list of values

2. **UCI Threshold**
   - Intensive care capacity threshold

3. **V Filtered**
   - Filtration parameter

4. **Lambda I to H**
   - Transition rate from infected to hospitalized

#### Execute Simulation

1. Enter parameters in the form
2. Click "Execute Simulation"
3. Wait for the simulation to complete
4. View results in the charts

#### Simulation Charts

The following charts are automatically generated:

- **Cumulative**: Cumulative cases
- **Cumulative Deaths**: Cumulative deaths
- **Exposed**: Exposed cases
- **Hospitalized**: Hospitalized cases
- **Immune**: Immune cases
- **Infectious**: Infectious cases
- **Susceptible**: Susceptible cases
- **UCI**: Intensive care cases

---

## 🏗️ Architecture

For detailed information about the project architecture, see the [ARCHITECTURE.md](./docs/ARCHITECTURE.md) document.

### Architecture Summary

The project follows a layered architecture:

1. **Presentation Layer**: React components
2. **Business Logic Layer**: Hooks and Reducers
3. **Service Layer**: API client
4. **Data Layer**: Types and State

### Data Flow

```
API Service → Redux Action → Reducer → Selector → Component
```

### Design Patterns

- **Container/Presentational Pattern**: Separation of logic and presentation
- **Custom Hooks Pattern**: Reusable logic
- **Service Layer Pattern**: Centralized API client
- **Redux Toolkit Slice Pattern**: State management

---

## 📂 Project Structure

```
epimodel-next/
├── components/          # React components
│   ├── ErrorBoundary/  # Error handling
│   ├── Layout/         # Layout components
│   ├── MainGraph/      # Main charts
│   ├── SimulationGraph/# Simulation charts
│   └── utils/          # Utility components
│
├── pages/              # Next.js pages
│   ├── _app.tsx       # Global configuration
│   ├── index.tsx      # Main page
│   └── Simulador.tsx  # Simulator page
│
├── store/              # Redux store
│   ├── store.ts       # Store configuration
│   └── reducers/      # Reducers
│
├── services/           # API services
│   └── api.ts         # HTTP client
│
├── hooks/              # Custom hooks
│   ├── useApi.ts      # API hook
│   └── ...            # Other hooks
│
├── types/              # TypeScript types
│   └── api.ts         # API types
│
├── utils/              # Utilities
│   ├── constants.ts   # Constants
│   └── ...            # Other utilities
│
├── config/             # Configuration
│   └── environment.ts # Environment variables
│
├── docs/               # Documentation
│   ├── ARCHITECTURE.md            # Project architecture
│   ├── CODE_QUALITY.md            # Code quality report
│   └── IMPLEMENTATION_SUMMARY.md  # Implementation summary
│
├── styles/             # Styles
│   └── globals.css    # Global styles
│
├── public/             # Static files
│   ├── assets/        # Images and icons
│   └── locales/       # Translations
│
└── nginx/              # Nginx configuration
```

---

## 📜 Available Scripts

### Development

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint
```

### Production

```bash
# Build application
yarn build

# Start production server
yarn start
```

---

## 🐳 Deployment

### Docker

The project includes Docker configuration for container deployment.

#### Build Image

```bash
docker build -t epimodel-next .
```

#### Run Container

**Without environment variables (uses automatic configuration):**

```bash
docker run -p 3000:3000 epimodel-next
```

**With custom environment variables:**

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_DEBUG_LOGS=false \
  -e NEXT_PUBLIC_ERROR_REPORTING=true \
  -e NEXT_PUBLIC_API_TIMEOUT=30000 \
  epimodel-next
```

**With .env.production file:**

```bash
docker run -p 3000:3000 --env-file .env.production epimodel-next
```

#### Docker Compose

```bash
# Uses environment variables defined in docker-compose.yml
docker-compose up -d
```

**docker-compose.yml example:**

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_DEBUG_LOGS=false
      - NEXT_PUBLIC_ERROR_REPORTING=true
    # API_URL is automatically configured
```

### Vercel

The project is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables in **Settings → Environment Variables**:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   NEXT_PUBLIC_API_TIMEOUT=30000
   NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
   ```
   > **Note**: `NODE_ENV` and `NEXT_PUBLIC_API_URL` are automatically configured
3. Deploy automatically

**Automatic configuration on Vercel:**

- `NODE_ENV=production` is automatically set during build
- `NEXT_PUBLIC_API_URL` is automatically configured as `http://epymodel.uaa.edu.py:3001`

### Other Platforms

The project can be deployed on any platform that supports Next.js:

#### Netlify

1. Connect your repository to Netlify
2. Configure environment variables in **Site settings → Build & deploy → Environment**:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   ```
3. Build command: `yarn build`
4. Publish directory: `.next`
5. `NODE_ENV` and `NEXT_PUBLIC_API_URL` are automatically configured

#### AWS Amplify

1. Connect your repository to AWS Amplify
2. Add environment variables in the Amplify console:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   ```
3. Build settings (automatic for Next.js)
4. `NODE_ENV=production` is automatically set

#### Azure App Service

1. Create an App Service in Azure
2. Configure environment variables in **Configuration → Application settings**:
   ```
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   ```
3. `NODE_ENV=production` is automatically set

#### Heroku

1. Create an app in Heroku
2. Configure environment variables:
   ```bash
   heroku config:set NEXT_PUBLIC_DEBUG_LOGS=false
   heroku config:set NEXT_PUBLIC_ERROR_REPORTING=true
   heroku config:set NODE_ENV=production
   ```
3. Deploy:
   ```bash
   git push heroku main
   ```

#### VPS Server (Linux)

1. Clone the repository on the server
2. Install dependencies: `yarn install`
3. Create `.env.production` file:
   ```bash
   nano .env.production
   ```
4. Add environment variables:
   ```env
   NEXT_PUBLIC_DEBUG_LOGS=false
   NEXT_PUBLIC_ERROR_REPORTING=true
   NEXT_PUBLIC_API_TIMEOUT=30000
   NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
   ```
5. Build and run:
   ```bash
   yarn build
   NODE_ENV=production yarn start
   ```
6. Use PM2 for persistent process:
   ```bash
   npm install -g pm2
   pm2 start npm --name "epimodel-next" -- start
   pm2 save
   pm2 startup
   ```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Test Structure

```
__tests__/
├── components/    # Component tests
├── hooks/         # Hook tests
├── services/      # Service tests
└── utils/         # Utility tests
```

---

## 🤝 Contributing

Contributions are welcome. Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guide

- Follow the project's code conventions
- Write tests for new features
- Update documentation
- Keep commits descriptive

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## 👥 Authors

- **Nery Cano** - [LinkedIn](https://www.linkedin.com/in/nery-cano-dev/)

---

## 🙏 Acknowledgments

- Universidad Autónoma de Asunción (UAA)
- Backend development team
- Next.js community
- Contributors of the libraries used

---

## 📞 Contact

For questions or suggestions, please contact:

- **Email**: [tu-email@example.com](mailto:tu-email@example.com)
- **Website**: [http://epymodel.uaa.edu.py](http://epymodel.uaa.edu.py)

---

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [D3.js Documentation](https://d3js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📚 Additional Documentation

For more information about the project, see the additional documentation in the `docs/` folder:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Complete project architecture documentation
- **[CODE_QUALITY.md](./docs/CODE_QUALITY.md)** - Code quality report and metrics
- **[IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Implementation summary and improvements

> **Note**: For API information, see the [Architecture](#-architecture) section and the `services/api.ts` file which contains complete API service documentation.

---
