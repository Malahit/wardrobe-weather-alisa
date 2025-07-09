import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  loading?: boolean;
  loadingText?: string;
}

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({ 
  children, 
  ariaLabel, 
  ariaDescribedBy, 
  loading = false, 
  loadingText = "Загрузка...",
  disabled,
  className,
  ...props 
}, ref) => {
  return (
    <Button
      ref={ref}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      disabled={disabled || loading}
      className={cn(
        // Улучшенный фокус для клавиатурной навигации
        "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        // Минимальный размер для touch targets
        "min-h-[44px] min-w-[44px]",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
});

AccessibleButton.displayName = "AccessibleButton";