// Learn Page Controller
class LearnController {
    constructor() {
        this.courses = {
            beginner: [
                {
                    id: 1,
                    title: "Introduction to Sports Trading",
                    description: "Learn the basics of sports trading and how player values are determined.",
                    duration: "2 hours",
                    progress: 60,
                    modules: [
                        { id: 1, title: "Understanding Sports Markets", completed: true },
                        { id: 2, title: "Player Valuation Basics", completed: true },
                        { id: 3, title: "Making Your First Trade", completed: false },
                        { id: 4, title: "Risk Management Fundamentals", completed: false }
                    ]
                }
            ],
            intermediate: [
                {
                    id: 2,
                    title: "Performance Analysis",
                    description: "Master the art of analyzing player statistics and predicting performance trends.",
                    duration: "3 hours",
                    progress: 0,
                    modules: [
                        { id: 1, title: "Statistical Analysis Basics", completed: false },
                        { id: 2, title: "Performance Metrics", completed: false },
                        { id: 3, title: "Trend Analysis", completed: false },
                        { id: 4, title: "Predictive Modeling", completed: false }
                    ]
                }
            ],
            advanced: [
                {
                    id: 3,
                    title: "Portfolio Management",
                    description: "Advanced strategies for building and managing a diverse sports portfolio.",
                    duration: "4 hours",
                    progress: 0,
                    locked: true,
                    requirements: ["Introduction to Sports Trading", "Performance Analysis"]
                }
            ]
        };

        this.userProgress = {
            completedCourses: 3,
            totalCourses: 12,
            currentPath: "Fundamentals",
            achievements: [],
            lastActivity: new Date()
        };

        this.guides = [
            {
                id: 1,
                title: "Understanding Player Values",
                duration: "5 min read",
                content: "Detailed guide on player valuation..."
            },
            {
                id: 2,
                title: "Calculating Returns",
                duration: "3 min read",
                content: "Step-by-step guide on calculating investment returns..."
            }
        ];

        this.communityPosts = [
            {
                id: 1,
                user: "John Doe",
                avatar: "/api/placeholder/32/32",
                title: "Understanding Rookie Valuations",
                content: "Great insights on how to value upcoming rookie players...",
                comments: 24,
                likes: 156,
                timestamp: new Date(Date.now() - 7200000)
            }
        ];

        this.initializeEventListeners();
        this.updateProgressDisplay();
        this.checkForUnlockedContent();
    }

    initializeEventListeners() {
        // Course card interactions
        document.querySelectorAll('.course-card').forEach(card => {
            const continueBtn = card.querySelector('.continue-btn');
            const startBtn = card.querySelector('.start-btn');

            if (continueBtn) {
                continueBtn.addEventListener('click', (e) => {
                    const courseId = card.dataset.courseId;
                    this.continueCourse(courseId);
                });
            }

            if (startBtn) {
                startBtn.addEventListener('click', (e) => {
                    const courseId = card.dataset.courseId;
                    this.startCourse(courseId);
                });
            }
        });

        // Learning path filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.filterLearningPaths(e.target.textContent.toLowerCase());
            });
        });

        // Quick guide interactions
        document.querySelectorAll('.guide-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const guideId = e.target.closest('.guide-card').dataset.guideId;
                this.openGuide(guideId);
            });
        });

        // Community interactions
        document.querySelectorAll('.discussion-card').forEach(card => {
            const likeBtn = card.querySelector('.fa-heart').parentElement;
            if (likeBtn) {
                likeBtn.addEventListener('click', (e) => {
                    const postId = card.dataset.postId;
                    this.likePost(postId);
                });
            }
        });

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    }

    continueCourse(courseId) {
        const course = this.findCourse(courseId);
        if (!course) return;

        this.openCourseModal(course);
    }

    startCourse(courseId) {
        const course = this.findCourse(courseId);
        if (!course) return;

        if (this.canStartCourse(course)) {
            this.openCourseModal(course);
        } else {
            this.showRequirementsModal(course);
        }
    }

    findCourse(courseId) {
        for (const level in this.courses) {
            const course = this.courses[level].find(c => c.id === parseInt(courseId));
            if (course) return course;
        }
        return null;
    }

    canStartCourse(course) {
        if (!course.requirements) return true;
        return course.requirements.every(req => 
            this.userProgress.completedCourses.includes(req)
        );
    }

    openCourseModal(course) {
        const modal = document.getElementById('courseModal');
        if (!modal) return;

        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="course-overview">
                <h2>${course.title}</h2>
                <p>${course.description}</p>
                <div class="course-modules">
                    ${this.renderCourseModules(course)}
                </div>
                <div class="course-actions">
                    <button class="action-btn primary">
                        ${course.progress > 0 ? 'Continue' : 'Start'} Course
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    renderCourseModules(course) {
        return course.modules.map(module => `
            <div class="module ${module.completed ? 'completed' : ''}">
                <div class="module-header">
                    <span class="module-title">${module.title}</span>
                    ${module.completed ? 
                        '<i class="fas fa-check"></i>' : 
                        '<i class="fas fa-circle"></i>'
                    }
                </div>
            </div>
        `).join('');
    }

    filterLearningPaths(filter) {
        const paths = document.querySelectorAll('.path-card');
        paths.forEach(path => {
            const pathLevel = path.dataset.level;
            path.style.display = 
                filter === 'all' || pathLevel === filter ? 'flex' : 'none';
        });
    }

    openGuide(guideId) {
        const guide = this.guides.find(g => g.id === parseInt(guideId));
        if (!guide) return;

        const modal = document.getElementById('courseModal');
        if (!modal) return;

        modal.querySelector('.modal-body').innerHTML = `
            <article class="guide-content">
                <h2>${guide.title}</h2>
                <div class="guide-meta">
                    <span>${guide.duration}</span>
                </div>
                <div class="guide-text">
                    ${guide.content}
                </div>
            </article>
        `;

        modal.classList.add('active');
    }

    likePost(postId) {
        const post = this.communityPosts.find(p => p.id === parseInt(postId));
        if (!post) return;

        post.likes++;
        this.updatePostDisplay(postId);
    }

    updatePostDisplay(postId) {
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (!postElement) return;

        const likesElement = postElement.querySelector('.fa-heart').parentElement;
        const post = this.communityPosts.find(p => p.id === parseInt(postId));
        
        if (likesElement && post) {
            likesElement.textContent = `${post.likes} likes`;
        }
    }

    updateProgressDisplay() {
        const progressElement = document.querySelector('.progress');
        if (!progressElement) return;

        const percentage = (this.userProgress.completedCourses / 
            this.userProgress.totalCourses) * 100;
        progressElement.style.width = `${percentage}%`;

        // Update progress stats
        const completedElement = document.querySelector('.stat-number');
        if (completedElement) {
            completedElement.textContent = 
                `${this.userProgress.completedCourses}/${this.userProgress.totalCourses}`;
        }
    }

    checkForUnlockedContent() {
        const lockedCards = document.querySelectorAll('.course-card');
        lockedCards.forEach(card => {
            const courseId = card.dataset.courseId;
            const course = this.findCourse(courseId);
            
            if (course && this.canStartCourse(course)) {
                card.querySelector('.locked-content')?.remove();
                const startBtn = document.createElement('button');
                startBtn.className = 'start-btn';
                startBtn.textContent = 'Start Course';
                card.querySelector('.course-content').appendChild(startBtn);
            }
        });
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
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

// Initialize learn controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const learn = new LearnController();
});