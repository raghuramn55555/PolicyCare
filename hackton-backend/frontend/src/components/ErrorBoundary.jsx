import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                    <div className="text-6xl mb-4">🤕</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
                    <p className="text-gray-600 mb-6 max-w-md">
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="bg-india-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-colors"
                    >
                        Refresh Page
                    </button>

                    <details className="mt-8 text-left bg-gray-100 p-4 rounded-lg w-full max-w-2xl overflow-auto text-xs text-red-500 font-mono">
                        <summary className="cursor-pointer font-bold text-gray-500 mb-2">Error Details (For Developers)</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
