import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ARENA ErrorBoundary] Caught render error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--bg-dark, #0f1117)',
            color: 'var(--text-main, #e2e8f0)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--error, #ef4444)' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', maxWidth: '500px', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            An unexpected error occurred while rendering this page. This is not a blank page — it's a caught error.
          </p>
          {this.state.error && (
            <pre
              style={{
                background: 'var(--bg-surface, #1e2130)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--error, #ef4444)',
                maxWidth: '600px',
                overflow: 'auto',
                marginBottom: '1.5rem',
                textAlign: 'left',
                border: '1px solid var(--border-color, #2d3748)',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              background: 'var(--primary, #3b82f6)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
