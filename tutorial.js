class TutorialController {
    constructor() {
        this.tutorials = {
            beginner: [
                {
                    id: 'platform-basics',
                    title: 'Platform Basics',
                    status: 'completed',
                    progress: 100,
                    duration: 5
                },
                {
                    id: 'sports-stocks',
                    title: 'Understanding Sports Stocks',
                    status: 'completed',
                    progress: 100,
                    duration: 10
                },
                {
                    id: 'first-trade',
                    title: 'Making Your First Trade',
                    status: 'in-progress',
                    progress: 50,
                    duration: 15
                }
            ],
            intermediate: [
                {
                    id: 'portfolio-management',
                    title: 'Portfolio Management',
                    status: 'locked',
                    progress: 0,
                    duration: 20,
                    requirement: 'Complete all beginner tutorials'
                }
            ],
            advanced: [
                {
                    id: 'market-analysis',
                    title: 'Market Analysis',
                    status: 'locked',
                    progress: 0,
                    duration: 30,
                    requirement: 'Complete all intermediate tutorials'
                }
            ]
        };

        this.currentTutorial = null;
        this.userProgress = this.loadProgress();
        this.initializeEventListeners();
        this.updateProgressDisplay();
    }

    initializeEventListeners() {
        // Tutorial card clicks
        document.querySelectorAll('.tutorial-card').forEach(card => {
            card.querySelector('button')?.addEventListener('click', (e) => {
                const tutorialId = card.getAttribute('data-tutorial-id');
                if (card.classList.contains('locked')) {
                    this.showRequirementMessage(tutorialId);
                } else if (card.classList.contains('completed')) {
                    this.reviewTutorial(tutorialId);
                } else {
                    this.startOrContinueTutorial(tutorialId);
                }
            });
        });

        // Help options
        document.querySelectorAll('.help-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = option.getAttribute('data-action');
                this.handleHelpAction(action);
            });
        });
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('tutorialProgress');
        return savedProgress ? JSON.parse(savedProgress) : {
            completedTutorials: [],
            currentTutorial: null,
            totalProgress: 0
        };
    }

    saveProgress() {
        localStorage.setItem('tutorialProgress', JSON.stringify(this.userProgress));
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        // Update overall progress bar
        const totalTutorials = Object.values(this.tutorials)
            .flat()
            .filter(t => t.status !== 'locked').length;
        
        const completedTutorials = this.userProgress.completedTutorials.length;
        const progressPercentage = (completedTutorials / totalTutorials) * 100;

        const progressBar = document.querySelector('.progress-bar .progress');
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }

        // Update progress stat
        const statValue = document.querySelector('.stat-value');
        if (statValue) {
            statValue.textContent = `${completedTutorials}/${totalTutorials}`;
        }

        // Update individual tutorial cards
        document.querySelectorAll('.tutorial-card').forEach(card => {
            const tutorialId = card.getAttribute('data-tutorial-id');
            const tutorial = this.findTutorial(tutorialId);
            
            if (tutorial) {
                this.updateTutorialCard(card, tutorial);
            }
        });
    }

    updateTutorialCard(card, tutorial) {
        // Update progress circle if tutorial is in progress
        if (tutorial.status === 'in-progress') {
            const circle = card.querySelector('.progress-circle path:last-child');
            if (circle) {
                const dashArray = 100;
                const dashOffset = dashArray * (1 - tutorial.progress / 100);
                circle.style.strokeDasharray = `${dashArray}`;
                circle.style.strokeDashoffset = dashOffset;
            }
        }
    }

    startOrContinueTutorial(tutorialId) {
        const tutorial = this.findTutorial(tutorialId);
        if (!tutorial) return;

        // Store current tutorial
        this.currentTutorial = tutorialId;
        this.userProgress.currentTutorial = tutorialId;
        this.saveProgress();

        // Launch tutorial experience
        this.launchTutorialExperience(tutorial);
    }

    launchTutorialExperience(tutorial) {
        // Create modal for tutorial content
        const modal = document.createElement('div');
        modal.className = 'tutorial-modal';
        modal.innerHTML = `
            <div class="tutorial-modal-content">
                <div class="tutorial-modal-header">
                    <h2>${tutorial.title}</h2>
                    <button class="close-button">&times;</button>
                </div>
                <div class="tutorial-modal-body">
                    Loading tutorial content...
                </div>
                <div class="tutorial-modal-footer">
                    <button class="button button--secondary">Previous</button>
                    <div class="tutorial-progress">Step 1 of 5</div>
                    <button class="button button--primary">Next</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-button').addEventListener('click', () => {
            this.closeTutorialModal(modal);
        });
    }

    closeTutorialModal(modal) {
        // Save current progress before closing
        this.saveProgress();
        modal.remove();
    }

    reviewTutorial(tutorialId) {
        // Similar to startTutorial but in review mode
        this.launchTutorialExperience({
            ...this.findTutorial(tutorialId),
            mode: 'review'
        });
    }

    showRequirementMessage(tutorialId) {
        const tutorial = this.findTutorial(tutorialId);
        if (!tutorial) return;

        this.showNotification(tutorial.requirement, 'warning');
    }

    handleHelpAction(action) {
        switch(action) {
            case 'guide':
                window.location.href = '/guide.html';
                break;
            case 'community':
                window.location.href = '/community.html';
                break;
            case 'support':
                this.openSupportChat();
                break;
        }
    }

    findTutorial(tutorialId) {
        return Object.values(this.tutorials)
            .flat()
            .find(t => t.id === tutorialId);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    openSupportChat() {
        this.showNotification('Support chat opening...', 'info');
        // Implement actual support chat integration
    }
}

// Initialize tutorial system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tutorialSystem = new TutorialController();

    // Handle page visibility changes to save progress
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            tutorialSystem.saveProgress();
        }
    });
});