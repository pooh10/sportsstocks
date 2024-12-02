// Insights Page Controller
class InsightsController {
    constructor() {
        this.charts = {};
        this.marketData = {
            summary: {
                marketCap: 1.2e9,
                volume: 45.6e6,
                activeTraders: 25400,
                changes: {
                    marketCap: 5.2,
                    volume: 12.8,
                    activeTraders: -2.1
                }
            },
            metrics: {
                volatility: 32.5,
                sentiment: 0.75,
                risk: 0.45
            },
            topMovers: {
                gainers: [
                    {
                        name: "Victor Wembanyama",
                        change: 15.4,
                        volume: 2.3e6,
                        price: 245.75
                    }
                ],
                losers: [
                    {
                        name: "Player XYZ",
                        change: -8.2,
                        volume: 1.1e6,
                        price: 125.30
                    }
                ]
            }
        };

        this.insights = [
            {
                type: "Analysis",
                title: "Impact of Injuries on Market Volatility",
                content: "Detailed analysis of injury impacts...",
                timestamp: new Date(Date.now() - 7200000),
                readTime: "5 min"
            }
        ];

        this.alerts = [
            {
                type: "high",
                title: "High Volume Alert",
                message: "Unusual trading volume detected",
                timestamp: new Date(Date.now() - 300000)
            }
        ];

        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    initializeCharts() {
        // Market Trend Chart
        const marketTrendCtx = document.getElementById('marketTrendChart');
        if (marketTrendCtx) {
            this.charts.marketTrend = new Chart(marketTrendCtx, {
                type: 'line',
                data: {
                    labels: this.generateTimeLabels(30),
                    datasets: [{
                        label: 'Market Price',
                        data: this.generateMarketData(30),
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
                            beginAtZero: false,
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

        // Volatility Chart
        const volatilityCtx = document.getElementById('volatilityChart');
        if (volatilityCtx) {
            this.charts.volatility = new Chart(volatilityCtx, {
                type: 'line',
                data: {
                    labels: this.generateTimeLabels(12),
                    datasets: [{
                        data: this.generateVolatilityData(12),
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            display: false
                        },
                        x: {
                            display: false
                        }
                    }
                }
            });
        }

        // Sentiment Chart
        const sentimentCtx = document.getElementById('sentimentChart');
        if (sentimentCtx) {
            this.charts.sentiment = new Chart(sentimentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Positive', 'Negative'],
                    datasets: [{
                        data: [75, 25],
                        backgroundColor: ['#10b981', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Performance Distribution
        const performanceCtx = document.getElementById('performanceDistribution');
        if (performanceCtx) {
            this.charts.performance = new Chart(performanceCtx, {
                type: 'bar',
                data: {
                    labels: ['<-20%', '-20%-10%', '-10-0%', '0-10%', '10-20%', '>20%'],
                    datasets: [{
                        data: this.generateDistributionData(),
                        backgroundColor: '#3b82f6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    setupEventListeners() {
        // Time period selection
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.updateTimeframe(e.target.textContent.toLowerCase());
            });
        });

        // View selection
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.updateView(e.target.textContent.toLowerCase());
            });
        });

        // Category tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabGroup = e.target.closest('.category-tabs, .analytics-tabs');
                tabGroup.querySelectorAll('.tab-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.updateCategory(e.target.textContent.toLowerCase());
            });
        });

        // Alert settings
        const settingsBtn = document.querySelector('.settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openAlertSettings());
        }

        // Chart controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.querySelector('i').classList.contains('fa-expand') 
                    ? 'expand' 
                    : 'download';
                const chartId = e.target.closest('.analytics-card').querySelector('canvas').id;
                this.handleChartControl(action, chartId);
            });
        });
    }

    updateTimeframe(timeframe) {
        const days = {
            'today': 1,
            'week': 7,
            'month': 30,
            'quarter': 90
        }[timeframe] || 30;

        if (this.charts.marketTrend) {
            this.charts.marketTrend.data.labels = this.generateTimeLabels(days);
            this.charts.marketTrend.data.datasets[0].data = this.generateMarketData(days);
            this.charts.marketTrend.update();
        }
    }

    updateView(view) {
        // Update chart data based on selected view
        switch(view) {
            case 'price action':
                this.updateChartForPriceAction();
                break;
            case 'volume':
                this.updateChartForVolume();
                break;
            case 'sentiment':
                this.updateChartForSentiment();
                break;
        }
    }

    updateCategory(category) {
        // Update displayed data based on selected category
        const moversGrid = document.getElementById('moversGrid');
        if (!moversGrid) return;

        const data = category === 'gainers' ? 
            this.marketData.topMovers.gainers : 
            this.marketData.topMovers.losers;

        moversGrid.innerHTML = data.map(mover => this.renderMoverCard(mover)).join('');
    }

    renderMoverCard(mover) {
        return `
            <div class="mover-card">
                <div class="mover-header">
                    <h3>${mover.name}</h3>
                    <div class="price-change ${mover.change >= 0 ? 'positive' : 'negative'}">
                        ${mover.change >= 0 ? '+' : ''}${mover.change}%
                    </div>
                </div>
                <div class="mover-details">
                    <div class="price">$${mover.price.toFixed(2)}</div>
                    <div class="volume">Vol: ${this.formatNumber(mover.volume)}</div>
                </div>
            </div>
        `;
    }

    startRealTimeUpdates() {
        // Update market data every 5 seconds
        setInterval(() => {
            this.updateMarketData();
        }, 5000);

        // Update charts every minute
        setInterval(() => {
            this.updateCharts();
        }, 60000);
    }

    updateMarketData() {
        // Simulate real-time market updates
        this.marketData.summary.marketCap *= (1 + (Math.random() - 0.5) * 0.01);
        this.marketData.summary.volume *= (1 + (Math.random() - 0.5) * 0.02);
        this.marketData.metrics.volatility += (Math.random() - 0.5) * 2;

        this.updateSummaryDisplay();
    }

    updateSummaryDisplay() {
        // Update DOM elements with new market data
        document.querySelectorAll('.summary-card').forEach(card => {
            const type = card.dataset.type;
            if (!type) return;

            const valueElement = card.querySelector('.value');
            const changeElement = card.querySelector('.change');

            if (valueElement && this.marketData.summary[type]) {
                valueElement.textContent = this.formatNumber(this.marketData.summary[type]);
            }

            if (changeElement && this.marketData.summary.changes[type]) {
                const change = this.marketData.summary.changes[type];
                changeElement.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
                changeElement.innerHTML = `
                    <i class="fas fa-arrow-${change >= 0 ? 'up' : 'down'}"></i>
                    ${Math.abs(change).toFixed(1)}%
                `;
            }
        });
    }

    generateTimeLabels(days) {
        const labels = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return labels;
    }

    generateMarketData(days) {
        const data = [];
        let value = 100;
        for (let i = 0; i < days; i++) {
            value *= (1 + (Math.random() - 0.5) * 0.02);
            data.push(parseFloat(value.toFixed(2)));
        }
        return data;
    }

    generateVolatilityData(points) {
        return Array(points).fill(0).map(() => Math.random() * 50 + 25);
    }

    generateDistributionData() {
        return Array(6).fill(0).map(() => Math.random() * 100);
    }

    formatNumber(number) {
        if (number >= 1e9) {
            return `$${(number / 1e9).toFixed(1)}B`;
        }
        if (number >= 1e6) {
            return `$${(number / 1e6).toFixed(1)}M`;
        }
        if (number >= 1e3) {
            return `$${(number / 1e3).toFixed(1)}K`;
        }
        return `$${number.toFixed(2)}`;
    }

    handleChartControl(action, chartId) {
        if (action === 'expand') {
            this.openAnalyticsModal(chartId);
        } else {
            this.downloadChartData(chartId);
        }
    }

    openAnalyticsModal(chartId) {
        const modal = document.getElementById('analyticsModal');
        if (!modal) return;

        // Clone and resize chart for modal
        const originalCanvas = document.getElementById(chartId);
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = '<canvas id="modalChart"></canvas>';
        const modalCanvas = document.getElementById('modalChart');
        
        const modalChart = new Chart(modalCanvas, {
            ...this.charts[chartId].config,
            options: {
                ...this.charts[chartId].config.options,
                maintainAspectRatio: false
            }
        });

        modal.classList.add('active');
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
}

// Initialize insights controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const insights = new InsightsController();
});