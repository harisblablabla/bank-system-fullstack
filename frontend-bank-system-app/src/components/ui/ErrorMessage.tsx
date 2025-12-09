'use client';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-red-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-red-900 font-medium mb-1">Error</h3>
            <p className="text-red-700 text-sm">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 text-sm text-red-700 hover:text-red-900 font-medium underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ 
  message, 
  actionLabel, 
  onAction 
}: { 
  message: string; 
  actionLabel?: string; 
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <svg
          className="mx-auto w-16 h-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-gray-600 mb-4">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}