import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-persian-cream to-persian-ivory dark:from-dark-bg-primary dark:to-dark-bg-secondary font-persian">
          <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-dark-bg-primary rounded-2xl shadow-xl border border-red-200 dark:border-red-800">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              خطایی رخ داده است
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              متأسفانه مشکلی در نمایش صفحه پیش آمده است. لطفاً صفحه را تازه‌سازی کنید.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-3"
            >
              تازه‌سازی صفحه
            </button>
            
            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  جزئیات خطا (توسعه)
                </summary>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 text-xs">
                  <pre className="whitespace-pre-wrap text-red-800 dark:text-red-200">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;