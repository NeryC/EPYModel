import { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import { ApiServiceError } from '../../services/api';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorUIProps {
  error: Error | null;
  onRetry: () => void;
}

/** Componente funcional para la UI del error — puede usar hooks de i18n */
function ErrorUI({ error, onRetry }: ErrorUIProps) {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen flex items-center justify-center bg-back py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Ícono de alerta */}
        <div className="mx-auto h-14 w-14 text-red-500">
          <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-black">{t('error-boundary-title')}</h1>
        <p className="text-text-secondary">{t('error-boundary-desc')}</p>

        {/* Detalle de error de API */}
        {error instanceof ApiServiceError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-left text-sm text-red-700">
            <p className="font-semibold mb-1">{t('error-api-title')}:</p>
            <p>{error.message}</p>
            {error.status && (
              <p className="text-xs mt-1 text-red-500">Status: {error.status}</p>
            )}
          </div>
        )}

        {/* Detalle técnico en desarrollo */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
            <summary className="font-semibold cursor-pointer">Detalle técnico</summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap">{error.stack}</pre>
          </details>
        )}

        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-2 bg-deep-blue text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          {t('error-boundary-retry')}
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorUI error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
