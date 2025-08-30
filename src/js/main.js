// Main Application Controller
class PortfolioApp {
    constructor() {
        this.currentModal = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('PortfolioApp: Starting initialization...');
        
        this.renderCategories();
        this.renderArtPortfolioCard();
        this.bindEvents();
        
        // Ensure modal system is initialized after categories are rendered
        this.initializeModalSystem();
        
        this.isInitialized = true;
        console.log('Portfolio App initialized');
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categories-grid');
        if (!categoriesGrid) {
            console.error('PortfolioApp: categories-grid not found');
            return;
        }

        console.log('PortfolioApp: Rendering categories...');
        const categoriesHTML = projectCategories.map(category => {
            // Define which categories should be disabled (no real projects yet)
            const disabledCategories = ['mobile', 'games', 'ai'];
            const isDisabled = disabledCategories.includes(category.id);
            
            console.log(`PortfolioApp: Category ${category.name} (${category.id}) - isDisabled: ${isDisabled}`);
            
            // Choose appropriate classes based on disabled state
            const cardClasses = isDisabled 
                ? 'glass-card rounded-2xl p-8 bg-gray-700/50 opacity-60 cursor-not-allowed' 
                : `${category.gradient} hover:scale-105 transition-all duration-300 cursor-pointer modal-trigger`;
            
            // Choose appropriate data attributes
            const dataAttributes = isDisabled ? '' : `data-modal="${category.id}"`;
            
            return `
                <div class="${cardClasses}" ${dataAttributes}>
                    <div class="text-center">
                        <div class="w-16 h-16 ${isDisabled ? 'bg-gray-500/30' : 'bg-white/20'} rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="text-3xl">${category.icon}</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 ${isDisabled ? 'text-gray-400' : 'text-white'}">${category.name}</h3>
                        <p class="${isDisabled ? 'text-gray-500' : 'text-white/80'} mb-6">${category.description}</p>
                        <div class="space-y-2">
                            ${category.technologies.map(tech => 
                                `<span class="inline-block px-3 py-1 ${isDisabled ? 'bg-gray-600/50 text-gray-400' : 'bg-white/20'} rounded-full text-sm">${tech}</span>`
                            ).join('')}
                        </div>
                        <div class="mt-4 ${isDisabled ? 'text-gray-500' : 'text-white/60'} text-sm">
                            ${isDisabled ? 'Coming Soon' : 'Hover to see projects'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        categoriesGrid.innerHTML = categoriesHTML;
        
        // Log summary of active vs disabled categories
        const disabledCategories = ['mobile', 'games'];
        const activeCategories = projectCategories.filter(cat => !disabledCategories.includes(cat.id));
        const disabledCount = projectCategories.filter(cat => disabledCategories.includes(cat.id));
        
        console.log('PortfolioApp: Categories rendered successfully');
        console.log('PortfolioApp: Active categories:', activeCategories.map(cat => cat.name));
        console.log('PortfolioApp: Disabled categories:', disabledCount.map(cat => cat.name));
    }

    renderArtPortfolioCard() {
        const artCard = document.getElementById('art-portfolio-card');
        if (!artCard) return;

        artCard.innerHTML = `
            <!-- 3D Multi-Layer Background -->
            <div class="art-3d-layers">
                <div class="art-layer art-layer-1"></div>
                <div class="art-layer art-layer-2"></div>
                <div class="art-layer art-layer-3"></div>
                <div class="art-layer art-layer-4"></div>
            </div>
            
            <!-- Artistic Background Pattern -->
            <div class="art-pattern"></div>
            
            <!-- Floating Artistic Elements -->
            <div class="art-floating-elements">
                <div class="art-element art-element-1"></div>
                <div class="art-element art-element-2"></div>
                <div class="art-element art-element-3"></div>
                <div class="art-element art-element-4"></div>
                <div class="art-element art-element-5"></div>
            </div>
            
            <!-- Content - Horizontal Layout with 3D Depth -->
            <div class="art-content-3d relative z-10 flex items-center gap-6">
                <!-- Icon Section with 3D Effect -->
                <div class="flex-shrink-0 art-icon-3d">
                    <div class="w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500 relative overflow-hidden">
                        <div class="art-icon-glow"></div>
                        <svg class="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                    </div>
                </div>
                
                <!-- Text Content with 3D Depth -->
                <div class="flex-1 art-text-3d">
                    <h3 class="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent art-title-3d">
                        ${artPortfolioData.title}
                    </h3>
                    <p class="text-white/80 mb-4 text-sm leading-relaxed art-description-3d">
                        ${artPortfolioData.description}
                    </p>
                    <div class="flex flex-wrap gap-2 art-tags-3d">
                        ${artPortfolioData.tags.map(tag => 
                            `<span class="px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 rounded-full text-xs text-pink-200 art-tag">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- CTA Button with 3D Effect -->
                <div class="flex-shrink-0 art-button-3d">
                    <div class="art-cta-button bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform group-hover:scale-105 shadow-lg text-sm relative overflow-hidden">
                        <div class="art-button-glow"></div>
                        <span class="relative z-10">View Portfolio →</span>
                    </div>
                </div>
            </div>
            
            <!-- Enhanced Floating Elements with 3D -->
            <div class="art-3d-floating-elements">
                <div class="art-3d-element art-3d-element-1"></div>
                <div class="art-3d-element art-3d-element-2"></div>
                <div class="art-3d-element art-3d-element-3"></div>
                <div class="art-3d-element art-3d-element-4"></div>
                <div class="art-3d-element art-3d-element-5"></div>
                <div class="art-3d-element art-3d-element-6"></div>
            </div>
        `;

        // Add click handler
        artCard.addEventListener('click', () => {
            window.open(artPortfolioData.url, '_blank');
        });
    }

    initializeModalSystem() {
        console.log('PortfolioApp: Initializing modal system...');
        
        // Wait a bit for DOM to be ready, then initialize modals
        setTimeout(() => {
            if (window.modalManager) {
                console.log('PortfolioApp: Modal manager found, reinitializing...');
                window.modalManager.init();
            } else {
                console.error('PortfolioApp: Modal manager not found!');
            }
        }, 100);
    }

    bindEvents() {
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal(this.currentModal);
            }
        });
    }

    openModal(type) {
        if (this.currentModal === type) return;
        
        if (this.currentModal) {
            this.closeModal(this.currentModal);
        }

        this.currentModal = type;
        const modal = document.getElementById(type + '-modal');
        if (modal) {
            modal.style.display = 'block';
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        }
    }

    closeModal(type) {
        const modal = document.getElementById(type + '-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    modal.style.display = 'none';
                    if (this.currentModal === type) {
                        this.currentModal = null;
                    }
                }
            }, 180);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
    
    // Make app globally available for other modules
    window.portfolioApp = app;
});
