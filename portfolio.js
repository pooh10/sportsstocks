// Portfolio Controller
class PortfolioController {
    constructor() {
        this.performanceChart = null;
        this.portfolioData = {
            holdings: [
                {
                    id: 1,
                    name: "Victor Wembanyama",
                    team: "San Antonio Spurs",
                    position: "PF/C",
                    quantity: 5.2,
                    avgPrice: 225.50,
                    currentPrice: 245.75,
                    totalValue: 1277.90,
                    return: 8.98
                },
                {
                    id: 2,
                    name: "Chet Holmgren",
                    team: "Oklahoma City Thunder",
                    position: "PF/C",
                    quantity: 3.8,
                    avgPrice: 185.25,
                    currentPrice: 198.50,
                    totalValue: 754.30,
                    return: 7.15
                }
            ],
            activities: [
                {
                    type: 'buy',
                    player: 'Victor Wembanyama',
                    quantity: 1.5,
                    price: 245.75,
                    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                    value: -368.63
                },
                {
                    type: 'sell',
                    player: 'Chet Holmgren',
                    quantity: 2.0,
                    price: 198.50,
                    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
                    value: 397.00
                }
            ]
        };

        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    initializeCharts() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Portfolio Value',
                    data: this.generatePerformanceData('1W'),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'white',
                        titleColor: '#1f2937',
                        bodyColor: '#1f2937',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            display: true,
                            drawBorder: false,
                            color: '#f3f4f6'
                        },
                        ticks: {
                            callback: value => `$${value}`
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0
                        }
                    }
                }
            }
        });
    }

    generatePerformanceData(timeframe) {
        const data = [];
        const intervals = {
            '1D': 24,
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '1Y': 365,
            'ALL': 365
        };

        const days = intervals[timeframe] || 7;
        let value = 12000; // Starting value
        const now = new Date();

        for (let i = 0; i < days; i++) {
            value *= (1 + (Math.random() - 0.5) * 0.02); // Random fluctuation
            const date = new Date(now);
            date.setDate(date.getDate() - (days - i));
            
            data.push({
                x: date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                }),
                y: parseFloat(value.toFixed(2))
            });
        }
        return data;
    }

    setupEventListeners() {
        // Timeframe selection
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.updateChartTimeframe(e.target.textContent);
            });
        });

        // View options for holdings
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.toggleHoldingsView(e.target.textContent.trim());
            });
        });

        // Trade buttons
        document.querySelectorAll('.holdings-table .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const playerId = row.dataset.playerId;
                this.openTradeModal(playerId);
            });
        });
    }

    updateChartTimeframe(timeframe) {
        if (!this.performanceChart) return;

        const newData = this.generatePerformanceData(timeframe);
        this.performanceChart.data.datasets[0].data = newData;
        this.performanceChart.update();
    }

    toggleHoldingsView(view) {
        const holdingsContainer = document.querySelector('.holdings-table');
        if (view === 'Distribution') {
            this.renderHoldingsDistribution(holdingsContainer);
        } else {
            this.renderHoldingsTable(holdingsContainer);
        }
    }

    renderHoldingsDistribution(container) {
        // Create a pie chart for holdings distribution
        container.innerHTML = '<canvas id="holdingsDistribution"></canvas>';
        const ctx = document.getElementById('holdingsDistribution');
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.portfolioData.holdings.map(h => h.name),
                datasets: [{
                    data: this.portfolioData.holdings.map(h => h.totalValue),
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(96, 165, 250, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    renderHoldingsTable(container) {
        // Restore the original table view
        this.refreshHoldingsTable();
    }

    refreshHoldingsTable() {
        const tbody = document.querySelector('.holdings-table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.portfolioData.holdings.map(holding => `
            <tr data-player-id="${holding.id}">
                <td>
                    <div class="player-info">
                        <img src="/api/placeholder/32/32" alt="${holding.name}" class="player-avatar">
                        <div>
                            <div class="player-name">${holding.name}</div>
                            <div class="player-team">${holding.team}</div>
                        </div>
                    </div>
                </td>
                <td>${holding.position}</td>
                <td>${holding.quantity.toFixed(1)}</td>
                <td>$${holding.avgPrice.toFixed(2)}</td>
                <td>$${holding.currentPrice.toFixed(2)}</td>
                <td>$${holding.totalValue.toFixed(2)}</td>
                <td class="return ${holding.return >= 0 ? 'positive' : 'negative'}">
                    ${holding.return >= 0 ? '+' : ''}${holding.return.toFixed(2)}%
                </td>
                <td>
                    <button class="action-btn small">Trade</button>
                </td>
            </tr>
        `).join('');
    }

    startRealTimeUpdates() {
        // Update prices every 5 seconds
        setInterval(() => {
            this.portfolioData.holdings = this.portfolioData.holdings.map(holding => ({
                ...holding,
                currentPrice: holding.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                totalValue: holding.quantity * holding.currentPrice,
                return: ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100
            }));
            this.refreshHoldingsTable();
        }, 5000);

        // Update chart every minute
        setInterval(() => {
            this.updateChartTimeframe(
                document.querySelector('.timeframe-btn.active')?.textContent || '1W'
            );
        }, 60000);
    }

    openTradeModal(playerId) {
        const holding = this.portfolioData.holdings.find(h => h.id === parseInt(playerId));
        if (!holding) return;

        // Implement trade modal logic here
        console.log('Opening trade modal for:', holding.name);
    }

    formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval > 1) {
                return `${interval} ${unit}s ago`;
            } else if (interval === 1) {
                return `${interval} ${unit} ago`;
            }
        }
        return 'just now';
    }
}

// Initialize portfolio controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new PortfolioController();
});

