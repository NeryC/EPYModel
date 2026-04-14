import { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';

const MODEL_KEYS = [
  'model-s',
  'model-e',
  'model-i',
  'model-r',
  'model-h',
  'model-u',
  'model-f',
] as const;

/**
 * Footer component that displays the SEIR-H model info and project link
 */
const Footer: FC = () => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  return (
    <footer className="bg-back px-2 pb-10 text-default-text" aria-label="Información del proyecto">
      {/* Sección colapsable del modelo SEIR-H */}
      <div className="max-w-screen-2xl mx-auto mb-6 border border-gray-theme rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex justify-between items-center px-4 py-3 font-bold text-left hover:bg-gray-50"
          aria-expanded={open}
          aria-controls="model-info-panel"
        >
          <span>{t('model-info-title')}</span>
          <span aria-hidden="true">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div id="model-info-panel" className="px-4 pb-4 text-sm space-y-3">
            <p className="text-text-secondary leading-relaxed">{t('model-info-intro')}</p>
            <p className="font-semibold">{t('model-compartments-title')}</p>
            <ul className="space-y-1 list-none">
              {MODEL_KEYS.map((key) => (
                <li key={key} className="pl-3 border-l-2 border-deep-blue text-text-secondary">
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Enlace al artículo científico */}
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
