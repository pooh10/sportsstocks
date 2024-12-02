class OnboardingController {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;

        // Check if we should redirect to dashboard
        if (localStorage.getItem('onboardingComplete') === 'true') {
            window.location.replace('./index.html');
            return;
        }

        this.setupEventListeners();
        this.updateProgressBar();
        this.loadSavedProgress();
    }

    setupEventListeners() {
        // Welcome page start button
        const startButton = document.querySelector('.start-journey');
        if (startButton) {
            startButton.addEventListener('click', () => this.nextStep());
        }

        // Navigation buttons
        document.querySelectorAll('.next-step').forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });

        document.querySelectorAll('.prev-step').forEach(button => {
            button.addEventListener('click', () => this.previousStep());
        });

        // Practice trade form
        const tradeForm = document.querySelector('.trade-form');
        if (tradeForm) {
            const tradeInput = tradeForm.querySelector('.trade-amount');
            if (tradeInput) {
                tradeInput.addEventListener('input', (e) => this.updateSharesPreview(e.target.value));
            }

            tradeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.executePracticeTrade();
            });
        }

        // Final step button
        const enterPlatformBtn = document.querySelector('.enter-platform');
        if (enterPlatformBtn) {
            enterPlatformBtn.addEventListener('click', () => this.completeOnboarding());
        }

        // Save progress before user leaves
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('onboardingStep', this.currentStep.toString());
        });
    }

    loadSavedProgress() {
        const savedStep = localStorage.getItem('onboardingStep');
        if (savedStep) {
            const step = parseInt(savedStep);
            if (step > 1 && step <= this.totalSteps) {
                this.jumpToStep(step);
            }
        }
    }

    jumpToStep(step) {
        // Hide all sections
        document.querySelectorAll('[data-step]').forEach(section => {
            section.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.querySelector(`[data-step="${step}"]`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentStep = step;
            this.updateProgressBar();
        }
    }

    updateProgressBar() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressBar = document.querySelector('.progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Hide current section
            const currentSection = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (currentSection) {
                currentSection.classList.add('hidden');
            }

            // Show next section
            this.currentStep++;
            const nextSection = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (nextSection) {
                nextSection.classList.remove('hidden');
                this.updateProgressBar();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            // Hide current section
            const currentSection = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (currentSection) {
                currentSection.classList.add('hidden');
            }

            // Show previous section
            this.currentStep--;
            const prevSection = document.querySelector(`[data-step="${this.currentStep}"]`);
            if (prevSection) {
                prevSection.classList.remove('hidden');
                this.updateProgressBar();
            }
        }
    }

    updateSharesPreview(amount) {
        const sharePrice = 245.75;
        const shares = parseFloat(amount) / sharePrice;
        const sharesPreview = document.querySelector('.shares-preview');
        if (sharesPreview && !isNaN(shares)) {
            sharesPreview.textContent = `${shares.toFixed(3)} shares`;
        }
    }

    executePracticeTrade() {
        const amountInput = document.querySelector('.trade-amount');
        const amount = parseFloat(amountInput?.value || '0');

        if (!amount || amount < 10 || amount > 1000) {
            this.showNotification('Please enter an amount between $10 and $1000', 'error');
            return;
        }

        this.showNotification('Processing trade...', 'info');
        
        // Simulate trade execution
        setTimeout(() => {
            this.showNotification('Practice trade successful!', 'success');
            setTimeout(() => this.nextStep(), 1500);
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('notification--visible');
        });

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('notification--visible');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, 3000);
    }

    completeOnboarding() {
        // Show loading state
        this.showNotification('Setting up your account...', 'info');

        // Set completion flags
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('userExperience', 'beginner');
        
        // Clean up temporary state
        localStorage.removeItem('onboardingStep');

        // Redirect to main dashboard
        setTimeout(() => {
            window.location.replace('./index.html');
        }, 1000);
    }
}

// Initialize controller
document.addEventListener('DOMContentLoaded', () => {
    window.onboardingController = new OnboardingController();
});