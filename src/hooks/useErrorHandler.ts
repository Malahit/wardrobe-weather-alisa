import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'Произошла неожиданная ошибка'
    } = options;

    // Логирование ошибки
    if (logError) {
      console.error('Error handled:', error);
    }

    // Определяем сообщение об ошибке
    let errorMessage = fallbackMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Показываем toast уведомление
    if (showToast) {
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    }

    return errorMessage;
  }, [toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};