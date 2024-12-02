// Market Data and State Management
class MarketData {
    constructor() {
        this.players = [
            {
                id: 1,
                name: "Victor Wembanyama",
                team: "San Antonio Spurs",
                position: "PF/C",
                price: 245.75,
                change: 12.3,
                trend: "Rising Star",
                stats: { points: 20.5, rebounds: 10.2, assists: 3.5 },
                riskLevel: "Moderate",
                holders: 15234
            },
            {
                id: 2,
                name: "Chet Holmgren",
                team: "Oklahoma City Thunder",
                position: "PF/C",
                price: 198.50,
                change: 8.7,
                trend: "Rookie Watch",
                stats: { points: 18.2, rebounds: 8.5, assists: 2.8 },
                riskLevel: "Low",
                holders: 12445
            },
            {
                id: 3,
                name: "Anthony Edwards",
                team: "Minnesota Timberwolves",
                position: "SG",
                price: 312.80,
                change: -5.2,
                trend: "Breakout",
                stats: { points: 26.8, rebounds: 5.5, assists: 5.2 },
                riskLevel: "Low",
                holders: 18921
            }
        ];
        this.portfolioValue = 12458.32;
        this.dailyChange = 623.12;
        this.dailyChangePercent = 5.2;
    }

    // Generate historical price data for charts
    generateTimeframeData(timeframe) {
        const dataPoints = {
            '1D': 24,
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '1Y': 365
        }[timeframe] || 7;

        const data = [];
        let value = 100;
        const now = new Date();

        for (let i = 0; i < dataPoints; i++) {
            value *= (1 + (Math.random() - 0.5) * 0.02);
            const date = new Date(now);
            date.setDate(date.getDate() - (dataPoints - i));
            
            data.push({
                date: date.toLocaleDateString(),
                value: parseFloat(value.toFixed(2))
            });
        }
        return data;
    }

    // Simulate real-time price updates
    updatePrices() {
        this.players = this.players.map(player => ({
            ...player,
            price: parseFloat((player.price * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
            change: parseFloat((player.change + (Math.random() - 0.5) * 2).toFixed(1))
        }));
        return this.players;
    }
}

// UI Controller
class UIController {
    constructor(marketData) {
        this.marketData = marketData;
        this.chart = null;
        this.selectedTimeframe = '1W';
        this.searchTerm = '';
        this.setupEventListeners();
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.checkForFirstVisit();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Timeframe selection
        const timeframeBtns = document.querySelectorAll('.timeframe-btn');
        timeframeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                timeframeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateTimeframe(e.target.dataset.timeframe);
            });
        });

        // Market tabs
        const marketTabs = document.querySelectorAll('.market-tab');
        marketTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                marketTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.filterMarket(e.target.textContent.toLowerCase());
            });
        });

        // Modal handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.trade-btn')) {
                this.openTradeModal(e.target.dataset.playerId);
            }
            if (e.target.matches('.close-btn') || e.target.matches('.modal')) {
                this.closeModal();
            }
        });
    }

    initializeCharts() {
        const ctx = document.getElementById('marketChart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Portfolio Value',
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        this.updateChartData(this.selectedTimeframe);
    }

    updateChartData(timeframe) {
        const data = this.marketData.generateTimeframeData(timeframe);
        
        if (this.chart) {
            this.chart.data.labels = data.map(d => d.date);
            this.chart.data.datasets[0].data = data.map(d => d.value);
            this.chart.update();
        }
    }

    renderPlayers(players = this.marketData.players) {
        const playerGrid = document.getElementById('playerGrid');
        if (!playerGrid) return;

        playerGrid.innerHTML = players.map(player => `
            <div class="player-card ${player.change >= 0 ? 'positive' : 'negative'}" data-player-id="${player.id}">
                <div class="player-header">
                    <div class="player-info">
                        <h3>${player.name}</h3>
                        <p class="player-team">${player.team} • ${player.position}</p>
                        <span class="trend-badge">${player.trend}</span>
                    </div>
                    <div class="player-price">
                        <div class="current-price">$${player.price.toFixed(2)}</div>
                        <div class="price-change ${player.change >= 0 ? 'positive' : 'negative'}">
                            ${player.change >= 0 ? '+' : ''}${player.change}%
                        </div>
                    </div>
                </div>
                <div class="player-stats">
                    <div class="stat">
                        <span class="stat-label">PTS</span>
                        <span class="stat-value">${player.stats.points}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">REB</span>
                        <span class="stat-value">${player.stats.rebounds}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">AST</span>
                        <span class="stat-value">${player.stats.assists}</span>
                    </div>
                </div>
                <div class="player-footer">
                    <div class="holders">
                        <i class="fas fa-users"></i>
                        ${player.holders.toLocaleString()} holders
                    </div>
                    <button class="trade-btn" data-player-id="${player.id}">Trade</button>
                </div>
            </div>
        `).join('');
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPlayers = this.marketData.players.filter(player => 
            player.name.toLowerCase().includes(searchTerm) ||
            player.team.toLowerCase().includes(searchTerm)
        );
        this.renderPlayers(filteredPlayers);
    }

    updateTimeframe(timeframe) {
        this.selectedTimeframe = timeframe;
        this.updateChartData(timeframe);
    }

    filterMarket(filter) {
        let filteredPlayers;
        switch(filter) {
            case 'trending':
                filteredPlayers = this.marketData.players.sort((a, b) => b.change - a.change);
                break;
            case 'rookies':
                filteredPlayers = this.marketData.players.filter(p => p.trend.includes('Rookie'));
                break;
            case 'watchlist':
                // Implement watchlist functionality
                filteredPlayers = this.marketData.players;
                break;
            default:
                filteredPlayers = this.marketData.players;
        }
        this.renderPlayers(filteredPlayers);
    }

    startRealTimeUpdates() {
        // Update prices every 5 seconds
        setInterval(() => {
            const updatedPlayers = this.marketData.updatePrices();
            this.renderPlayers(updatedPlayers);
        }, 5000);

        // Update chart every minute
        setInterval(() => {
            this.updateChartData(this.selectedTimeframe);
        }, 60000);
    }

    openTradeModal(playerId) {
        const player = this.marketData.players.find(p => p.id === parseInt(playerId));
        if (!player) return;

        const modal = document.getElementById('tradeModal');
        const modalTitle = modal.querySelector('#modalTitle');
        const quantityInput = modal.querySelector('#tradeQuantity');
        const totalOutput = modal.querySelector('#tradeTotal');

        modalTitle.textContent = `Trade ${player.name}`;
        modal.classList.add('active');

        // Update total value when quantity changes
        quantityInput.addEventListener('input', () => {
            const quantity = parseInt(quantityInput.value) || 0;
            totalOutput.textContent = `$${(quantity * player.price).toFixed(2)}`;
        });

        // Initialize with quantity of 1
        quantityInput.value = 1;
        totalOutput.textContent = `$${player.price.toFixed(2)}`;
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    checkForFirstVisit() {
        if (!localStorage.getItem('hasVisited')) {
            this.showTutorial();
            localStorage.setItem('hasVisited', 'true');
        }
    }

    showTutorial() {
        const tutorialModal = document.getElementById('tutorialModal');
        if (!tutorialModal) return;

        const tutorialSteps = [
            {
                title: 'Welcome to SportStocks!',
                content: 'Start investing in your favorite athletes and earn returns based on their performance.'
            },
            {
                title: 'Track Performance',
                content: 'Monitor your portfolio value and see how your investments grow over time.'
            },
            {
                title: 'Trade Players',
                content: 'Buy and sell player stocks based on their current form and future potential.'
            },
            {
                title: 'Stay Informed',
                content: 'Use our insights and analytics to make data-driven investment decisions.'
            }
        ];

        const stepsHtml = tutorialSteps.map((step, index) => `
            <div class="tutorial-step">
                <h4>${step.title}</h4>
                <p>${step.content}</p>
                <div class="step-indicator">${index + 1}/${tutorialSteps.length}</div>
            </div>
        `).join('');

        tutorialModal.querySelector('.tutorial-steps').innerHTML = stepsHtml;
        tutorialModal.classList.add('active');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const marketData = new MarketData();
  const ui = new UIController(marketData);
  
  // Initialize new systems
  const tooltipSystem = new TooltipSystem();
  const validationSystem = new ValidationSystem();
  const errorSystem = new ErrorHandlingSystem();
  
  // Check if user is beginner
  const isNewUser = localStorage.getItem('userExperience') === 'beginner';
  if (isNewUser) {
    loadBeginnerDashboard();
  }
  
  // Initialize help system
  initializeHelpSystem();
});

function initializeHelpSystem() {
  const helpTrigger = document.getElementById('helpTrigger');
  if (helpTrigger) {
    helpTrigger.addEventListener('click', () => {
      const helpSystem = new HelpSystem({
        tutorials: true,
        contextual: true
      });
      helpSystem.show();
    });
  }
}