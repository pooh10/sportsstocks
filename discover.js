// Discover Page Controller
class DiscoverController {
    constructor() {
        this.trendingPlayers = [
            {
                id: 1,
                name: "Victor Wembanyama",
                team: "San Antonio Spurs",
                position: "PF/C",
                price: 245.75,
                change: 12.3,
                trend: "Rising Star",
                stats: {
                    lastGame: { points: 28, rebounds: 12, assists: 4 },
                    season: { ppg: 20.5, rpg: 10.2, apg: 3.5 }
                },
                riskLevel: "Moderate",
                holders: 15234,
                sentiment: 0.85
            },
            // Add more players...
        ];

        this.watchlist = [
            {
                id: 2,
                name: "Chet Holmgren",
                team: "Oklahoma City Thunder",
                price: 198.50,
                change: 8.7,
                alerts: ["Price target reached", "High volume trading"]
            },
            // Add more watchlist items...
        ];

        this.recommendations = [
            {
                id: 3,
                name: "Anthony Edwards",
                team: "Minnesota Timberwolves",
                price: 312.80,
                change: 15.2,
                reason: "Similar to your portfolio holdings",
                matchScore: 92
            },
            // Add more recommendations...
        ];

        this.filters = {
            sport: 'all',
            league: 'all',
            position: 'all',
            advanced: {
                priceRange: [0, 1000],
                riskLevel: 'all',
                experience: 'all'
            }
        };

        this.initializeEventListeners();
        this.renderContent();
        this.startRealTimeUpdates();
    }

    initializeEventListeners() {
        // Filter selections
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.filters[e.target.id.replace('Select', '')] = e.target.value;
                this.applyFilters();
            });
        });

        // Advanced filters button
        const filterBtn = document.querySelector('.filter-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.openFiltersModal());
        }

        // View selectors
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewType = e.target.textContent.toLowerCase();
                this.switchView(viewType);
            });
        });

        // Recommendation tags
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateRecommendations(e.target.textContent);
            });
        });

        // Research tools
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const toolType = e.target.closest('.tool-card').querySelector('h3').textContent;
                this.openResearchTool(toolType);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }
    }

    renderContent() {
        this.renderTrends();
        this.renderWatchlist();
        this.renderRecommendations();
    }

    renderTrends() {
        const trendsGrid = document.getElementById('trendsGrid');
        if (!trendsGrid) return;

        const trendHTML = this.trendingPlayers.map(player => `
            <div class="trend-card" data-player-id="${player.id}">
                <div class="trend-header">
                    <div class="player-info">
                        <h3>${player.name}</h3>
                        <p class="team-info">${player.team} • ${player.position}</p>
                        <span class="trend-badge">${player.trend}</span>
                    </div>
                    <div class="price-info">
                        <div class="current-price">$${player.price.toFixed(2)}</div>
                        <div class="price-change ${player.change >= 0 ? 'positive' : 'negative'}">
                            ${player.change >= 0 ? '+' : ''}${player.change}%
                        </div>
                    </div>
                </div>
                <div class="trend-stats">
                    <div class="stat-group">
                        <div class="stat-label">Last Game</div>
                        <div class="stat-values">
                            <span>${player.stats.lastGame.points} PTS</span>
                            <span>${player.stats.lastGame.rebounds} REB</span>
                            <span>${player.stats.lastGame.assists} AST</span>
                        </div>
                    </div>
                    <div class="stat-group">
                        <div class="stat-label">Season Avg</div>
                        <div class="stat-values">
                            <span>${player.stats.season.ppg} PPG</span>
                            <span>${player.stats.season.rpg} RPG</span>
                            <span>${player.stats.season.apg} APG</span>
                        </div>
                    </div>
                </div>
                <div class="trend-footer">
                    <div class="sentiment-meter" title="Market Sentiment">
                        <div class="meter" style="width: ${player.sentiment * 100}%"></div>
                    </div>
                    <button class="action-btn">Trade</button>
                </div>
            </div>
        `).join('');

        trendsGrid.innerHTML = trendHTML;
    }

    renderWatchlist() {
        const watchlistGrid = document.getElementById('watchlistGrid');
        if (!watchlistGrid) return;

        const watchlistHTML = this.watchlist.map(item => `
            <div class="watchlist-card" data-player-id="${item.id}">
                <div class="watchlist-header">
                    <h3>${item.name}</h3>
                    <div class="price-info">
                        <div class="current-price">$${item.price.toFixed(2)}</div>
                        <div class="price-change ${item.change >= 0 ? 'positive' : 'negative'}">
                            ${item.change >= 0 ? '+' : ''}${item.change}%
                        </div>
                    </div>
                </div>
                <div class="alert-list">
                    ${item.alerts.map(alert => `
                        <div class="alert-item">
                            <i class="fas fa-bell"></i>
                            <span>${alert}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="watchlist-actions">
                    <button class="action-btn">Trade</button>
                    <button class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        watchlistGrid.innerHTML = watchlistHTML;
    }

    renderRecommendations() {
        const recommendationsGrid = document.getElementById('recommendationsGrid');
        if (!recommendationsGrid) return;

        const recommendationsHTML = this.recommendations.map(rec => `
            <div class="recommendation-card" data-player-id="${rec.id}">
                <div class="match-score">
                    <div class="score-circle">
                        <span>${rec.matchScore}%</span>
                        <div class="score-label">Match</div>
                    </div>
                </div>
                <div class="recommendation-content">
                    <h3>${rec.name}</h3>
                    <p class="team-info">${rec.team}</p>
                    <p class="reason">${rec.reason}</p>
                    <div class="price-info">
                        <span>$${rec.price.toFixed(2)}</span>
                        <span class="price-change ${rec.change >= 0 ? 'positive' : 'negative'}">
                            ${rec.change >= 0 ? '+' : ''}${rec.change}%
                        </span>
                    </div>
                    <button class="action-btn">View Details</button>
                </div>
            </div>
        `).join('');

        recommendationsGrid.innerHTML = recommendationsHTML;
    }

    applyFilters() {
        // Filter the displayed players based on current filter settings
        const filteredPlayers = this.trendingPlayers.filter(player => {
            return (this.filters.sport === 'all' || player.sport === this.filters.sport) &&
                   (this.filters.league === 'all' || player.league === this.filters.league) &&
                   (this.filters.position === 'all' || player.position === this.filters.position);
        });

        this.renderTrends(filteredPlayers);
    }

    switchView(viewType) {
        // Update the trends display based on view type
        switch(viewType) {
            case 'trending':
                this.renderTrends(this.trendingPlayers);
                break;
            case 'most traded':
                this.renderTrends(this.trendingPlayers.sort((a, b) => b.holders - a.holders));
                break;
            case 'price changes':
                this.renderTrends(this.trendingPlayers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)));
                break;
        }
    }

    updateRecommendations(type) {
        // Update recommendations based on selected type
        switch(type.toLowerCase()) {
            case 'based on portfolio':
                // Filter recommendations by portfolio similarity
                break;
            case 'similar players':
                // Filter recommendations by player similarity
                break;
            case 'popular':
                // Filter recommendations by popularity
                break;
        }
        this.renderRecommendations();
    }

    openResearchTool(toolType) {
        // Implementation for opening research tools
        console.log(`Opening research tool: ${toolType}`);
    }

    handleSearch(searchTerm) {
        const filteredPlayers = this.trendingPlayers.filter(player => 
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.team.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderTrends(filteredPlayers);
    }

    startRealTimeUpdates() {
        // Update prices and trends every 5 seconds
        setInterval(() => {
            this.trendingPlayers = this.trendingPlayers.map(player => ({
                ...player,
                price: player.price * (1 + (Math.random() - 0.5) * 0.02),
                change: player.change + (Math.random() - 0.5) * 2
            }));
            this.renderTrends();
        }, 5000);
    }

    openFiltersModal() {
        const modal = document.getElementById('filtersModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the discover page controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const discover = new DiscoverController();
});