class TooltipSystem {
    constructor() {
        // Dictionary of tooltip content
        this.tooltipContent = {
            // Portfolio tooltips
            'total-value': 'The current combined value of all your athlete investments',
            'realized-gains': 'Profit/loss from completed trades',
            'unrealized-gains': 'Potential profit/loss from current holdings',
            'portfolio-risk': 'Overall risk assessment of your investments',
  			'available-balance': 'Your available funds for making new trades',
  			'risk-level': 'Your portfolio\'s overall risk assessment based on volatility and diversification',
  			'quick-buy': 'Instantly purchase shares of trending athletes',
  			'set-alert': 'Create price and performance alerts for athletes',
  			'view-portfolio': 'See detailed breakdown of your investments',
  			'view-analytics': 'Advanced performance metrics and analysis',
            
            // Trading tooltips
            'market-price': 'Current trading price based on recent performance',
            'trade-shares': 'Number of shares to buy or sell',
            'trade-amount': 'Total value of the trade in dollars',
            'trade-limit': 'Maximum amount you can trade as a new investor',
            
            // Stats tooltips
            'points-avg': 'Average points per game this season',
            'assists-avg': 'Average assists per game this season',
            'rebounds-avg': 'Average rebounds per game this season',
            'performance-trend': 'Player performance trend over last 5 games',
            
            // Risk indicators
            'low-risk': 'Historically stable performance with minimal volatility',
            'medium-risk': 'Moderate performance fluctuations expected',
            'high-risk': 'Higher potential returns but with increased volatility',
            
            // Learning section
            'beginner-track': 'Start here to learn the basics of sports trading',
            'intermediate-track': 'Advanced strategies for experienced traders',
            'advanced-track': 'Expert-level analysis and trading techniques',
            
            // Stats tooltips
			'market-cap': 'The total market value of a company\'s outstanding shares',
			'trading-volume': 'The total number of shares traded within a specific time period',
			'active-traders': 'The number of participants actively buying and selling right now',
			
			// Portfolio tooltips
			'available-balance': 'Your current practice balance available for trades',
			'portfolio-value': 'The total value of your practice investments, including gains or losses',

			// Actions tooltips
			'practice-trade': 'Try trading with virtual funds to learn the process',
			'view-tutorial': 'Open a tutorial to learn more about trading basics',
			'get-help': 'Access resources or contact support for assistance',

			// Stats tooltips
			'athlete-info': 'Basic information about the athlete, including team and position',
			'points-avg': 'Average points per game for the athlete this season',
			'risk-level': 'Indicates the risk of investing in this athlete based on their performance',
			'market-trend': 'The recent trend of the athlete\'s stock price',

			// Price tooltips
			'current-price': 'The current trading price of the athlete\'s stock',
			
			// Stats tooltips
			'basic-concepts': 'An overview of how athlete performance can influence their stock value in the market',
			'trading-basics': 'Essential principles of trading to help you get started with investments',
			'risk-management': 'Strategies for minimizing risks and protecting your investments in the market',

        };

        this.activeTooltip = null;
        this.initializeTooltips();
    }

    initializeTooltips() {
        // Add tooltip triggers
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            // Mouse events
            element.addEventListener('mouseenter', (e) => this.showTooltip(e));
            element.addEventListener('mouseleave', (e) => this.hideTooltip(e));
            
            // Touch events
            element.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: true });
            
            // Accessibility
            element.setAttribute('role', 'tooltip');
            element.setAttribute('tabindex', '0');
            
            // Keyboard events
            element.addEventListener('focus', (e) => this.showTooltip(e));
            element.addEventListener('blur', (e) => this.hideTooltip(e));
        });
    }

    createTooltipElement(content, position = { x: 0, y: 0 }) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                ${content}
            </div>
            <div class="tooltip-arrow"></div>
        `;
        
        document.body.appendChild(tooltip);
        return tooltip;
    }

    positionTooltip(tooltip, target, position) {
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        // Default position above the element
        let top = targetRect.top + scrollY - tooltipRect.height - 10;
        let left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;

        // Check if tooltip would go off screen and adjust if needed
        if (top < scrollY) {
            // Position below if not enough space above
            top = targetRect.bottom + scrollY + 10;
            tooltip.classList.add('tooltip--bottom');
        } else {
            tooltip.classList.add('tooltip--top');
        }

        // Ensure tooltip doesn't exceed screen width
        const maxLeft = window.innerWidth - tooltipRect.width - 10;
        left = Math.min(Math.max(10, left), maxLeft);

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    showTooltip(event) {
        const target = event.target;
        const tooltipId = target.getAttribute('data-tooltip');
        const content = this.tooltipContent[tooltipId];

        if (!content) return;

        // Remove any existing tooltip
        this.hideTooltip(event);

        // Create new tooltip
        const tooltip = this.createTooltipElement(content);
        this.activeTooltip = tooltip;

        // Position the tooltip
        this.positionTooltip(tooltip, target);

        // Add animation class
        requestAnimationFrame(() => {
            tooltip.classList.add('tooltip--visible');
        });
    }

    hideTooltip(event) {
        if (this.activeTooltip) {
            this.activeTooltip.classList.remove('tooltip--visible');
            
            // Remove after animation
            this.activeTooltip.addEventListener('transitionend', () => {
                this.activeTooltip.remove();
            }, { once: true });
            
            this.activeTooltip = null;
        }
    }

    handleTouch(event) {
        event.preventDefault();
        
        if (this.activeTooltip) {
            this.hideTooltip(event);
        } else {
            this.showTooltip(event);
        }
    }

    // Add tooltip programmatically
    addTooltip(elementId, tooltipContent) {
        const element = document.getElementById(elementId);
        if (element) {
            element.setAttribute('data-tooltip', elementId);
            this.tooltipContent[elementId] = tooltipContent;
            this.initializeTooltips();
        }
    }
}

// Initialize tooltips when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tooltipSystem = new TooltipSystem();
});