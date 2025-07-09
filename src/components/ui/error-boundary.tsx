import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-8 bg-red-50 border-red-200 text-center">
          <div className="flex flex-col items-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Что-то пошло не так
              </h2>
              <p className="text-red-600 mb-4">
                Произошла ошибка при загрузке этого компонента
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-red-100 p-4 rounded-lg mb-4">
                  <summary className="cursor-pointer font-medium">
                    Детали ошибки
                  </summary>
                  <pre className="mt-2 text-sm overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <Button onClick={this.handleRetry} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}