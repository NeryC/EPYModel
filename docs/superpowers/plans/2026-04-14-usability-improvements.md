# Usability Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar 6 mejoras de usabilidad identificadas en la evaluación heurística del sitio EPIModel, abordando los problemas 1, 4, 5, 6, 11 y 12.

**Architecture:** Cada mejora es independiente y toca archivos distintos. Las mejoras de texto se aplican en los archivos de traducción i18n (`public/locales/es/common.json`, `public/locales/en/common.json`). Las mejoras de UI se aplican en componentes React existentes sin crear nuevos archivos salvo donde sea necesario.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS, next-i18next, Redux Toolkit

---

## Nota sobre Problema 9 (etiquetas abreviadas)

Las abreviaturas h→u, i→h, u→f del sitio antiguo **ya no existen** en esta versión. El SimulationGraph divide cada compartimento en un gráfico individual con nombre completo traducido via i18n (susceptible, exposed, infectious, etc.). Este problema está resuelto por rediseño.

---

## Files Modified

| Archivo | Razón |
|---------|-------|
| `public/locales/es/common.json` | Claves nuevas para P1, P5, P11, P12 |
| `public/locales/en/common.json` | Claves nuevas para P1, P5, P11, P12 |
| `components/TitleSection.tsx` | P1: segundo párrafo con funcionalidades |
| `components/MainGraph/index.tsx` | P4: ícono de ayuda en título de gráfico |
| `components/utils/DownloadButton.tsx` | P5: info de período junto al botón de descarga |
| `components/MainGraph/SettingsComponent/index.tsx` | P6: texto con rango completo de fechas disponibles |
| `components/Layout/Footer/index.tsx` | P11: sección expandible del modelo SEIR-H |
| `pages/index.tsx` | P12: estado de carga con mensajes descriptivos |

---

## Task 1: Problema 1 — Mejorar descripción del sitio

**Files:**
- Modify: `public/locales/es/common.json`
- Modify: `public/locales/en/common.json`
- Modify: `components/TitleSection.tsx`

- [ ] **Step 1: Actualizar clave `home-description` en español**

En `public/locales/es/common.json`, reemplazar la línea 41:
```json
"home-description": "La publicación se realizó dentro del proyecto PINV20-40 cofinanciado por el Consejo Nacional de Ciencia y Tecnología (CONACYT) con recursos de la FEEI",
```
Por:
```json
"home-description": "Visualizador de modelos epidemiológicos de COVID-19 para Paraguay. Aquí puede explorar proyecciones de casos, hospitalizaciones, UCI y fallecidos, seleccionar escenarios de transmisión y descargar los datos.",
"home-description-source": "Proyecto PINV20-40, cofinanciado por CONACYT con recursos de la FEEI.",
```

- [ ] **Step 2: Actualizar clave `home-description` en inglés**

En `public/locales/en/common.json`, reemplazar la línea 41:
```json
"home-description": "The publication was made within the PINV20-40 project co-financed by the National Council of Science, and Technology (CONACYT) with resources from the FEEI",
```
Por:
```json
"home-description": "Epidemiological model visualizer for COVID-19 in Paraguay. Explore projections of cases, hospitalizations, ICU, and deaths, select transmission scenarios, and download the data.",
"home-description-source": "PINV20-40 project, co-financed by CONACYT with FEEI resources.",
```

- [ ] **Step 3: Actualizar TitleSection para mostrar ambas líneas**

En `components/TitleSection.tsx`, el `useMemo` actualmente concatena `home-description` + fecha. Cambiar para manejar la fuente como segundo párrafo separado.

Reemplazar el contenido del componente:
```tsx
import { useMemo } from "react";
import { selectLastUpdateDate } from "../store/reducers/graphInfoSlice";
import { useDateFormat } from "../hooks/useDateFormat";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

interface TitleSectionProps {
  tab?: "main" | "simulation";
}

export function TitleSection({ tab = "main" }: TitleSectionProps) {
  const { t } = useTranslation("common");
  const { formatDate } = useDateFormat();
  const lastUpdateDate = useSelector(selectLastUpdateDate);
  const isMainGraph = tab === "main";

  const { title, description, source, containerClass, borderClass } = useMemo(() => {
    const title = isMainGraph ? t("home-title") : t("simulation-title");
    let description = isMainGraph ? t("home-description") : t("simulation-description");
    const source = isMainGraph ? t("home-description-source") : "";

    if (isMainGraph && lastUpdateDate) {
      const formattedDate = formatDate(lastUpdateDate);
      description += ` — ${t("updated-until")} ${formattedDate}`;
    }

    const borderClass = `text-lg md:text-xl ${isMainGraph ? "border-b border-gray-theme pb-5" : ""}`;
    const containerClass = `flex flex-col mt-3 mb-5 ${!isMainGraph ? "grow justify-center" : ""}`;

    return { title, description, source, containerClass, borderClass };
  }, [isMainGraph, t, lastUpdateDate, formatDate]);

  return (
    <div className={containerClass}>
      <h1 className="font-bold text-black text-2xl mb-2">{title}</h1>
      <p className={borderClass}>
        {description}
        {source && (
          <span className="block text-sm text-text-secondary mt-1">{source}</span>
        )}
      </p>
    </div>
  );
}

export default TitleSection;
```

- [ ] **Step 4: Verificar en dev**

```bash
yarn dev
```
Abrir `http://localhost:3000` y confirmar que:
- El primer párrafo explica qué hace el sitio
- El segundo párrafo (gris, más pequeño) muestra la fuente CONACYT
- La fecha de actualización sigue apareciendo al final del primer párrafo

- [ ] **Step 5: Commit**

```bash
git add public/locales/es/common.json public/locales/en/common.json components/TitleSection.tsx
git commit -m "feat(p1): mejorar descripción del sitio con información de funcionalidades"
```

---

## Task 2: Problema 4 — Ícono de ayuda en títulos de gráficos

**Files:**
- Modify: `components/MainGraph/index.tsx`
- Modify: `components/utils/Subtitle.tsx`

Los subtítulos descriptivos ya existen para los 4 gráficos principales. Esta tarea agrega visualmente que el usuario sabe que puede leer más. El `Subtitle` ya muestra el texto — solo necesita un ícono de información opcional junto al título del gráfico.

- [ ] **Step 1: Agregar ícono de información junto al h2 en MainGraph**

En `components/MainGraph/index.tsx`, reemplazar el `<h2>`:
```tsx
<h2 className="text-2xl">{t(`${type}-title`)}</h2>
```
Por:
```tsx
<div className="flex items-center gap-2">
  <h2 className="text-2xl">{t(`${type}-title`)}</h2>
  <span
    title={t(`${type}-subtitle`)}
    aria-label={t(`${type}-subtitle`)}
    className="text-text-secondary text-sm cursor-help select-none"
  >
    ⓘ
  </span>
</div>
```

- [ ] **Step 2: Verificar en dev**

Abrir `http://localhost:3000`, pasar el cursor sobre el ícono ⓘ de cada gráfico y confirmar que el tooltip muestra la descripción.

- [ ] **Step 3: Commit**

```bash
git add components/MainGraph/index.tsx
git commit -m "feat(p4): agregar ícono de ayuda con descripción en títulos de gráficos"
```

---

## Task 3: Problema 5 — Info de período en botón de descarga

**Files:**
- Modify: `public/locales/es/common.json`
- Modify: `public/locales/en/common.json`
- Modify: `components/utils/DownloadButton.tsx`

- [ ] **Step 1: Agregar claves de traducción**

En `public/locales/es/common.json`, agregar antes del último `}`:
```json
"download-info-period": "Período: {{start}} – {{end}}",
"download-format-svg": "Imagen vectorial (SVG) del gráfico actual",
"download-format-csv": "Datos numéricos en formato CSV"
```

En `public/locales/en/common.json`, agregar antes del último `}`:
```json
"download-info-period": "Period: {{start}} – {{end}}",
"download-format-svg": "Vector image (SVG) of the current chart",
"download-format-csv": "Numerical data in CSV format"
```

- [ ] **Step 2: Pasar los datos de rango de fecha al DownloadButton desde MainGraph**

En `components/MainGraph/index.tsx`, el componente ya tiene acceso a `data` (variable local). Agregar prop `dataRange` al `DownloadButton`:

Primero obtener las fechas extremas del data:
```tsx
const dataRange = useMemo(() => {
  if (!data || data.length === 0) return null;
  return { start: data[0].fecha as string, end: data[data.length - 1].fecha as string };
}, [data]);
```

Luego pasar al DownloadButton:
```tsx
<DownloadButton page={"main"} type={type} dataRange={dataRange} />
```

- [ ] **Step 3: Actualizar DownloadButton para aceptar y mostrar el rango**

En `components/utils/DownloadButton.tsx`:

Agregar `dataRange` a la interface:
```tsx
interface DownloadButtonProps {
  page: "main" | "simulation";
  type: MainSubtitleType | SimulationSubtitleType;
  data?: DataPoint[];
  dataRange?: { start: string; end: string } | null;
}
```

Actualizar la firma del componente:
```tsx
function DownloadButtonComponent({ page, type, data, dataRange }: DownloadButtonProps) {
```

Dentro del return, reemplazar el `<ul>` del dropdown para mostrar info antes de las opciones:
```tsx
<ul
  role="menu"
  aria-label={t("download-graph")}
  className={`
    w-56
    dropdown-menu
    absolute
    bg-white
    z-50
    py-2
    list-none
    rounded-lg
    shadow-complete-box
    ${!showDropdown && "hidden"}
    my-2
    bg-clip-padding
    border-none
  `}
>
  {dataRange && (
    <li role="none" className="px-4 py-1 text-xs text-gray-500 border-b border-gray-100 mb-1">
      {t("download-info-period", { start: dataRange.start, end: dataRange.end })}
    </li>
  )}
  <DownloadOption
    text={`svg — ${t("download-format-svg")}`}
    onClick={() => downloadGraph()}
  />
  <DownloadCSVOption />
</ul>
```

- [ ] **Step 4: Verificar en dev**

Abrir `http://localhost:3000`, hacer clic en "Descargar gráfico" en cualquier gráfico y verificar que el dropdown muestra el período de datos arriba de las opciones SVG/CSV.

- [ ] **Step 5: Commit**

```bash
git add public/locales/es/common.json public/locales/en/common.json components/utils/DownloadButton.tsx components/MainGraph/index.tsx
git commit -m "feat(p5): mostrar período de datos disponibles en menú de descarga"
```

---

## Task 4: Problema 6 — Rango completo de fechas disponibles

**Files:**
- Modify: `public/locales/es/common.json`
- Modify: `public/locales/en/common.json`
- Modify: `components/MainGraph/SettingsComponent/index.tsx`

- [ ] **Step 1: Agregar clave de traducción**

En `public/locales/es/common.json`, agregar:
```json
"available-data-range": "Datos disponibles: {{start}} – {{end}}"
```

En `public/locales/en/common.json`, agregar:
```json
"available-data-range": "Available data: {{start}} – {{end}}"
```

- [ ] **Step 2: Pasar `data` al SettingsComponent desde MainGraph**

En `components/MainGraph/SettingsComponent/index.tsx`, el componente ya recibe `data: any[]`. Agregar texto informativo debajo del label de "Rango de fechas" con el rango total disponible.

Dentro del `<div className="flex flex-col mb-11 w-full">`, después del `MultiRangeSlider`, agregar:
```tsx
{data.length > 0 && (
  <p className="text-xs text-gray-400 mt-1 text-center">
    {t("available-data-range", {
      start: data[0].fecha,
      end: data[data.length - 1].fecha,
    })}
  </p>
)}
```

- [ ] **Step 3: Verificar en dev**

Abrir `http://localhost:3000`, abrir la configuración de un gráfico (ícono de sliders) y verificar que debajo del slider de rango de fechas aparece el texto "Datos disponibles: YYYY-MM-DD – YYYY-MM-DD".

- [ ] **Step 4: Commit**

```bash
git add public/locales/es/common.json public/locales/en/common.json components/MainGraph/SettingsComponent/index.tsx
git commit -m "feat(p6): mostrar rango completo de fechas disponibles junto al slider"
```

---

## Task 5: Problema 11 — Sección informativa del modelo SEIR-H

**Files:**
- Modify: `public/locales/es/common.json`
- Modify: `public/locales/en/common.json`
- Modify: `components/Layout/Footer/index.tsx`

- [ ] **Step 1: Agregar claves de traducción del modelo**

En `public/locales/es/common.json`, agregar:
```json
"model-info-title": "Acerca del modelo SEIR-H",
"model-info-intro": "EPIModel utiliza un modelo compartimental SEIR-H para proyectar la evolución de la pandemia de COVID-19 en Paraguay. El modelo divide la población en compartimentos según su estado epidemiológico y simula las transiciones entre ellos.",
"model-compartments-title": "Compartimentos del modelo",
"model-s": "S — Susceptibles: personas sin inmunidad, expuestas a contagio.",
"model-e": "E — Expuestos: infectados pero aún no infecciosos (período de incubación).",
"model-i": "I — Infecciosos: personas que pueden contagiar a otras.",
"model-r": "R — Recuperados/Inmunes: personas que superaron la infección.",
"model-h": "H — Hospitalizados: fracción de infectados que requieren hospitalización.",
"model-u": "U — UCI: hospitalizados que requieren cuidados intensivos.",
"model-f": "F — Fallecidos: muertes acumuladas por la infección.",
"model-article-label": "Ver artículo científico completo"
```

En `public/locales/en/common.json`, agregar:
```json
"model-info-title": "About the SEIR-H model",
"model-info-intro": "EPIModel uses a SEIR-H compartmental model to project the evolution of the COVID-19 pandemic in Paraguay. The model divides the population into compartments based on their epidemiological status and simulates transitions between them.",
"model-compartments-title": "Model compartments",
"model-s": "S — Susceptible: people without immunity, exposed to contagion.",
"model-e": "E — Exposed: infected but not yet infectious (incubation period).",
"model-i": "I — Infectious: people who can infect others.",
"model-r": "R — Recovered/Immune: people who recovered from the infection.",
"model-h": "H — Hospitalized: fraction of infected requiring hospitalization.",
"model-u": "U — ICU: hospitalized patients requiring intensive care.",
"model-f": "F — Deceased: cumulative deaths from the infection.",
"model-article-label": "View full scientific article"
```

- [ ] **Step 2: Rediseñar el Footer con sección colapsable del modelo**

En `components/Layout/Footer/index.tsx`, reemplazar todo el contenido:

```tsx
import { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';

const Footer: FC = () => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  return (
    <footer className="bg-back px-2 pb-10 text-default-text" aria-label="Información del proyecto">
      {/* Sección colapsable del modelo */}
      <div className="max-w-screen-2xl mx-auto mb-6 border border-gray-theme rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex justify-between items-center px-4 py-3 font-bold text-left hover:bg-gray-50"
          aria-expanded={open}
        >
          <span>{t('model-info-title')}</span>
          <span aria-hidden="true">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div className="px-4 pb-4 text-sm space-y-3">
            <p>{t('model-info-intro')}</p>
            <p className="font-semibold">{t('model-compartments-title')}</p>
            <ul className="space-y-1 list-none">
              {(['model-s', 'model-e', 'model-i', 'model-r', 'model-h', 'model-u', 'model-f'] as const).map((key) => (
                <li key={key} className="pl-2 border-l-2 border-deep-blue">
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Enlace al artículo */}
      <div className="text-center font-bold">
        {t('more-information')}
        <a
          className="underline text-blue-600"
          target="_blank"
          href="https://www.mdpi.com/2076-3417/11/20/9726/htm"
          rel="noopener noreferrer"
          aria-label={t('go-here-aria')}
        >
          {t('go-here')}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 3: Verificar en dev**

Abrir `http://localhost:3000`, ir al pie de la página y verificar que:
- El panel "Acerca del modelo SEIR-H" está colapsado por defecto
- Al hacer clic, se expande y muestra la introducción y el glosario de compartimentos
- El enlace al artículo científico sigue visible debajo

- [ ] **Step 4: Commit**

```bash
git add public/locales/es/common.json public/locales/en/common.json components/Layout/Footer/index.tsx
git commit -m "feat(p11): agregar sección colapsable del modelo SEIR-H con glosario"
```

---

## Task 6: Problema 12 — Estado de carga descriptivo en la página principal

**Files:**
- Modify: `pages/index.tsx`
- Modify: `public/locales/es/common.json`
- Modify: `public/locales/en/common.json`

- [ ] **Step 1: Agregar claves de traducción para carga**

En `public/locales/es/common.json`, agregar:
```json
"loading-data": "Cargando datos epidemiológicos...",
"loading-graphs": "Inicializando gráficos interactivos...",
"loading-hint": "Esto puede tardar unos segundos la primera vez."
```

En `public/locales/en/common.json`, agregar:
```json
"loading-data": "Loading epidemiological data...",
"loading-graphs": "Initializing interactive charts...",
"loading-hint": "This may take a few seconds the first time."
```

- [ ] **Step 2: Agregar estado de carga en pages/index.tsx**

En `pages/index.tsx`, el render actual omite mostrar algo cuando `readyGraphs.length === 0`. Agregar un bloque de carga:

Dentro del componente `Graphs`, después de `const readyGraphs = ...`, agregar:
```tsx
const allGraphTypes = ["reported", "hospitalized", "ICU", "deceases"] as const;
const totalGraphs = allGraphTypes.length;
const loadedCount = readyGraphs.length;
const isLoading = dimensions.width > 0 && loadedCount < totalGraphs;
```

Dentro del JSX, reemplazar:
```tsx
{dimensions.width > 0 && readyGraphs.length > 0 && (
  <section aria-label={t("graphs-container")}>
    {readyGraphs.map(({ type }: GraphStatus) => (
      <MainGraph key={type} type={type} dimensions={dimensions} />
    ))}
  </section>
)}
```
Por:
```tsx
{dimensions.width > 0 && (
  <>
    {isLoading && (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-text-secondary">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-deep-blue rounded-full animate-spin" role="status" aria-label={t("loading-data")} />
        <p className="text-base font-medium">
          {loadedCount === 0 ? t("loading-data") : t("loading-graphs")}
        </p>
        {loadedCount > 0 && (
          <p className="text-sm text-gray-400">
            {loadedCount}/{totalGraphs} {t("graphs-container").toLowerCase()}
          </p>
        )}
        <p className="text-xs text-gray-400">{t("loading-hint")}</p>
      </div>
    )}
    {readyGraphs.length > 0 && (
      <section aria-label={t("graphs-container")}>
        {readyGraphs.map(({ type }: GraphStatus) => (
          <MainGraph key={type} type={type} dimensions={dimensions} />
        ))}
      </section>
    )}
  </>
)}
```

- [ ] **Step 3: Verificar en dev**

```bash
yarn dev
```
Abrir `http://localhost:3000` y verificar que:
- Mientras los gráficos cargan aparece el spinner con el texto "Cargando datos epidemiológicos..."
- Una vez cargados los gráficos, el spinner desaparece y los gráficos se muestran

- [ ] **Step 4: Commit**

```bash
git add pages/index.tsx public/locales/es/common.json public/locales/en/common.json
git commit -m "feat(p12): agregar estado de carga descriptivo en la página principal"
```

---

## Verificación Final

- [ ] Ejecutar `yarn lint` y corregir cualquier error
- [ ] Ejecutar `yarn build` y confirmar que compila sin errores
- [ ] Revisar los 6 problemas manualmente en `http://localhost:3000`
