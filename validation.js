// validation.js
class ValidationSystem {
    constructor() {
        this.rules = {
            // Trading rules
            trade: {
                minAmount: 10,
                maxAmount: {
                    beginner: 1000,
                    intermediate: 5000,
                    advanced: null // no limit
                },
                maxPortfolioPercentage: 0.25, // max 25% of portfolio in one asset
                minQuantity: 0.01 // minimum shares
            },
            
            // Account rules
            account: {
                password: {
                    minLength: 8,
                    requireNumbers: true,
                    requireSpecialChars: true,
                    requireUppercase: true
                },
                email: {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                }
            }
        };

        this.errorMessages = {
            trade: {
                insufficientFunds: 'Insufficient funds for this trade',
                belowMinimum: 'Minimum trade amount is $10',
                aboveMaximum: 'Maximum trade amount exceeded for your level',
                invalidQuantity: 'Invalid quantity specified',
                portfolioLimit: 'This trade would exceed portfolio diversity limits',
                marketClosed: 'Market is currently closed'
            },
            account: {
                invalidEmail: 'Please enter a valid email address',
                weakPassword: 'Password must be at least 8 characters with numbers, special characters, and uppercase letters',
                passwordMismatch: 'Passwords do not match'
            }
        };

        this.initializeValidation();
    }

    initializeValidation() {
        // Add validation to trade forms
        document.querySelectorAll('.trade-form').forEach(form => {
            this.setupTradeValidation(form);
        });

        // Add validation to account forms
        document.querySelectorAll('.account-form').forEach(form => {
            this.setupAccountValidation(form);
        });
    }

    setupTradeValidation(form) {
        const quantityInput = form.querySelector('.trade-amount');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (quantityInput && submitButton) {
            quantityInput.addEventListener('input', (e) => {
                const result = this.validateTradeAmount(e.target.value);
                this.updateFormStatus(form, result);
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = parseFloat(quantityInput.value);
                const result = this.validateTradeAmount(amount);
                
                if (result.valid) {
                    this.processTrade(form, amount);
                } else {
                    this.showError(form, result.errors[0]);
                }
            });
        }
    }

    validateTradeAmount(amount, userLevel = 'beginner') {
        const errors = [];
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount)) {
            errors.push('Please enter a valid number');
            return { valid: false, errors };
        }

        // Check minimum
        if (numAmount < this.rules.trade.minAmount) {
            errors.push(this.errorMessages.trade.belowMinimum);
        }

        // Check maximum based on user level
        const maxAmount = this.rules.trade.maxAmount[userLevel];
        if (maxAmount && numAmount > maxAmount) {
            errors.push(this.errorMessages.trade.aboveMaximum);
        }

        // Check portfolio percentage (if portfolio data available)
        const portfolioValue = this.getPortfolioValue();
        if (portfolioValue && (numAmount / portfolioValue) > this.rules.trade.maxPortfolioPercentage) {
            errors.push(this.errorMessages.trade.portfolioLimit);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    setupAccountValidation(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const passwordInput = form.querySelector('input[type="password"]');
        const confirmPasswordInput = form.querySelector('input[name="confirm-password"]');

        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                const result = this.validateEmail(e.target.value);
                this.updateInputStatus(emailInput, result);
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                const result = this.validatePassword(e.target.value);
                this.updateInputStatus(passwordInput, result);
            });
        }

        if (confirmPasswordInput && passwordInput) {
            confirmPasswordInput.addEventListener('input', (e) => {
                const result = this.validatePasswordMatch(passwordInput.value, e.target.value);
                this.updateInputStatus(confirmPasswordInput, result);
            });
        }
    }

    validateEmail(email) {
        if (!this.rules.account.email.pattern.test(email)) {
            return {
                valid: false,
                error: this.errorMessages.account.invalidEmail
            };
        }
        return { valid: true };
    }

    validatePassword(password) {
        const rules = this.rules.account.password;
        const errors = [];

        if (password.length < rules.minLength) {
            errors.push(`Password must be at least ${rules.minLength} characters`);
        }
        if (rules.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (rules.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        if (rules.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    updateFormStatus(form, validationResult) {
        const submitButton = form.querySelector('button[type="submit"]');
        const errorDisplay = this.getOrCreateErrorDisplay(form);

        if (validationResult.valid) {
            submitButton.removeAttribute('disabled');
            errorDisplay.textContent = '';
            errorDisplay.classList.add('hidden');
        } else {
            submitButton.setAttribute('disabled', 'true');
            errorDisplay.textContent = validationResult.errors[0];
            errorDisplay.classList.remove('hidden');
        }
    }

    updateInputStatus(input, validationResult) {
        const errorDisplay = this.getOrCreateErrorDisplay(input.parentElement);
        
        if (validationResult.valid) {
            input.classList.remove('input--error');
            input.classList.add('input--valid');
            errorDisplay.textContent = '';
            errorDisplay.classList.add('hidden');
        } else {
            input.classList.add('input--error');
            input.classList.remove('input--valid');
            errorDisplay.textContent = validationResult.error || validationResult.errors[0];
            errorDisplay.classList.remove('hidden');
        }
    }

    getOrCreateErrorDisplay(container) {
        let errorDisplay = container.querySelector('.error-message');
        if (!errorDisplay) {
            errorDisplay = document.createElement('div');
            errorDisplay.className = 'error-message hidden';
            container.appendChild(errorDisplay);
        }
        return errorDisplay;
    }

    getPortfolioValue() {
        // Implementation to get current portfolio value
        // This should be connected to your actual portfolio data
        return 10000; // Example value
    }

    processTrade(form, amount) {
        // Implementation for processing the trade
        // This should be connected to your trade execution system
        console.log('Processing trade:', amount);
    }

    showError(form, message) {
        const errorDisplay = this.getOrCreateErrorDisplay(form);
        errorDisplay.textContent = message;
        errorDisplay.classList.remove('hidden');

        // Clear error after 3 seconds
        setTimeout(() => {
            errorDisplay.classList.add('hidden');
        }, 3000);
    }
}

// Initialize validation system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.validationSystem = new ValidationSystem();
});