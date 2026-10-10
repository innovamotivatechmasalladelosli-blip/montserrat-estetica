import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6 text-brand-espresso">
          <div className="max-w-md w-full rounded-3xl border border-brand-border bg-brand-surface-container p-8 text-center shadow-xl">
            <h1 className="font-serif text-2xl font-semibold mb-3">Estamos recuperando la experiencia</h1>
            <p className="text-sm text-brand-muted mb-6">Ocurrió un problema temporal al cargar esta sección. Tus datos de navegación siguen a salvo.</p>
            <button onClick={this.handleRetry} className="rounded-full bg-brand-espresso px-5 py-3 text-sm font-semibold text-white hover:bg-brand-espresso/90">Reintentar</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
