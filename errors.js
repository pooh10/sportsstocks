// errors.js
class ErrorHandlingSystem {
    constructor() {
        this.errorTypes = {
            TRADE: {
                MARKET_CLOSED: {
                    code: 'T001',
                    message: 'Market is currently closed',
                    action: 'Try again during market hours: 9:30 AM - 4:00 PM ET',
                    severity: 'warning'
                },
                INSUFFICIENT_FUNDS: {
                    code: 'T002',
                    message: 'Insufficient funds for this trade',
                    action: 'Add funds to your account or reduce trade amount',
                    severity: 'error'
                },
                QUANTITY_ERROR: {
                    code: 'T003',
                    message: 'Invalid trade quantity',
                    action: 'Enter a valid quantity above 0.01 shares',
                    severity: 'error'
                },
                PRICE_CHANGED: {
                    code: 'T004',
                    message: 'Price has changed since your last quote',
                    action: 'Review the new price and confirm your trade',
                    severity: 'warning'
                }
            },
            PORTFOLIO: {
                SYNC_ERROR: {
                    code: 'P001',
                    message: 'Unable to sync portfolio data',
                    action: 'Refresh the page or try again later',
                    severity: 'warning'
                },
                UPDATE_FAILED: {
                    code: 'P002',
                    message: 'Portfolio update failed',
                    action: 'Check your connection and try again',
                    severity: 'error'
                }
            },
            NETWORK: {
                CONNECTION_LOST: {
                    code: 'N001',
                    message: 'Connection lost',
                    action: 'Check your internet connection',
                    severity: 'error'
                },
                TIMEOUT: {
                    code: 'N002',
                    message: 'Request timed out',
                    action: 'Please try again',
                    severity: 'warning'
                }
            },
            AUTH: {
                SESSION_EXPIRED: {
                    code: 'A001',
                    message: 'Your session has expired',
                    action: 'Please log in again',
                    severity: 'error'
                },
                UNAUTHORIZED: {
                    code: 'A002',
                    message: 'Unauthorized action',
                    action: 'Please check your permissions',
                    severity: 'error'
                }
            }
        };

        this.initializeErrorHandling();
    }

    initializeErrorHandling() {
        // Global error handling
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event);
        });

        // Promise rejection handling
        window.addEventListener('unhandledrejection', (event) => {
            this.handlePromiseRejection(event);
        });

        // Network error handling
        this.setupNetworkErrorHandling();
    }

    handleError(errorType, errorCode, customMessage = null) {
        const error = this.getErrorConfig(errorType, errorCode);
        if (!error) return;

        const errorData = {
            ...error,
            message: customMessage || error.message,
            timestamp: new Date().toISOString()
        };

        this.logError(errorData);
        this.showErrorNotification(errorData);

        return errorData;
    }

    getErrorConfig(type, code) {
        return this.errorTypes[type]?.[code];
    }

    showErrorNotification(error) {
        const notification = document.createElement('div');
        notification.className = `error-notification error-notification--${error.severity}`;
        
        notification.innerHTML = `
            <div class="error-notification__content">
                <div class="error-notification__header">
                    <span class="error-notification__title">${error.message}</span>
                    <button class="error-notification__close">×</button>
                </div>
                <div class="error-notification__body">
                    <p class="error-notification__action">${error.action}</p>
                    ${error.code ? `<span class="error-notification__code">${error.code}</span>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Add close button functionality
        notification.querySelector('.error-notification__close')
            .addEventListener('click', () => {
                this.removeNotification(notification);
            });

        // Auto remove after delay for warnings
        if (error.severity === 'warning') {
            setTimeout(() => {
                this.removeNotification(notification);
            }, 5000);
        }

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('error-notification--visible');
        });
    }

    removeNotification(notification) {
        notification.classList.remove('error-notification--visible');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }

    setupNetworkErrorHandling() {
        // Monitor connection status
        window.addEventListener('online', () => {
            this.showErrorNotification({
                message: 'Connection restored',
                action: 'Your connection is back online',
                severity: 'success'
            });
        });

        window.addEventListener('offline', () => {
            this.handleError('NETWORK', 'CONNECTION_LOST');
        });

        // Intercept fetch calls
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            } catch (error) {
                if (!navigator.onLine) {
                    this.handleError('NETWORK', 'CONNECTION_LOST');
                } else {
                    this.handleError('NETWORK', 'TIMEOUT');
                }
                throw error;
            }
        };
    }

    handleGlobalError(event) {
        console.error('Global error:', event.error);
        this.showErrorNotification({
            message: 'An unexpected error occurred',
            action: 'Please try again or contact support if the problem persists',
            severity: 'error'
        });
    }

    handlePromiseRejection(event) {
        console.error('Promise rejection:', event.reason);
        this.showErrorNotification({
            message: 'Operation failed',
            action: 'Please try again',
            severity: 'error'
        });
    }

    logError(error) {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error:', error);
        }

        // In production, you might want to send to a logging service
        // this.sendToLoggingService(error);
    }
}

// Initialize error handling system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.errorSystem = new ErrorHandlingSystem();
});