// Modal Management System
class ModalManager {
    constructor() {
        this.currentModal = null;
        this.openTimer = null;
        this.closeTimer = null;
        this.isHoveringTrigger = false;
        this.isHoveringModal = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isSticky = false; // New sticky mode
    }

    init() {
        console.log('ModalManager: Initializing...');
        this.createModals();
        this.bindModalEvents();
        this.bindCategoryEvents();
        console.log('ModalManager: Initialized successfully');
    }

    createModals() {
        const modalsContainer = document.getElementById('modals-container');
        if (!modalsContainer) {
            console.error('ModalManager: modals-container not found');
            return;
        }

        // Define which categories should be disabled (no real projects yet)
        const disabledCategories = ['mobile', 'games', 'ai'];
        
        // Only create modals for active categories
        const activeCategories = projectCategories.filter(category => 
            !disabledCategories.includes(category.id)
        );

        console.log('ModalManager: Creating modals for', activeCategories.length, 'active categories');
        
        const modalsHTML = activeCategories.map(category => `
            <div id="${category.id}-modal" class="modal fixed z-50 hidden">
                <div class="modal-content glass-card rounded-xl p-4 w-72 max-h-80 overflow-y-auto relative">
                    <!-- Close Button -->
                    <button class="modal-close absolute top-2 right-2 text-white/60 hover:text-white transition-colors w-6 h-6 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20" onclick="window.modalManager.closeModal('${category.id}')">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    
                    <!-- Header -->
                    <div class="modal-header text-center mb-4">
                        <div class="w-8 h-8 ${category.gradient} rounded-full flex items-center justify-center mx-auto mb-2 bg-white/20 backdrop-blur-sm border border-white/30">
                            <span class="text-lg">${category.icon}</span>
                        </div>
                        <h3 class="text-lg font-bold text-white">${category.name}</h3>
                        <p class="text-white/70 text-xs mt-1">${category.description}</p>
                    </div>
                    
                    <!-- Projects Grid -->
                    <div class="space-y-3">
                        ${category.projects.map(project => `
                            <div class="project-card rounded-lg p-3 hover:scale-102 transition-transform duration-300">
                                <h4 class="text-sm font-semibold mb-1 text-white">${project.title}</h4>
                                <p class="text-white/80 mb-2 text-xs leading-relaxed">${project.description}</p>
                                
                                <!-- Technologies -->
                                <div class="flex flex-wrap gap-1 mb-2">
                                    ${project.technologies.slice(0, 2).map(tech => `
                                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 flex items-center gap-1">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.374 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-3.176 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
                                            </svg>
                                            ${tech}
                                        </span>
                                    `).join('')}
                                    ${project.technologies.length > 2 ? `<span class="px-2 py-1 bg-white/20 rounded-full text-xs text-white/90">+${project.technologies.length - 2}</span>` : ''}
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex space-x-2">
                                    ${project.demoUrl !== '#' ? `
                                        <a href="${project.demoUrl}" target="_blank" class="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-2 py-1 rounded text-center text-xs transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50">
                                            Demo
                                        </a>
                                    ` : ''}
                                    ${project.codeUrl !== '#' ? `
                                        <a href="${project.codeUrl}" target="_blank" class="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 px-2 py-1 rounded text-center text-xs transition-all duration-300 border border-green-500/30 hover:border-green-500/50">
                                            Code
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        modalsContainer.innerHTML = modalsHTML;
        console.log('ModalManager: Modals created successfully for active categories only');
    }

    bindModalEvents() {
        const modals = document.querySelectorAll('.modal');
        console.log('ModalManager: Binding events to', modals.length, 'modals');
        
        modals.forEach(modal => {
            const content = modal.querySelector('.modal-content');
            if (!content) return;

            content.addEventListener('mouseenter', () => {
                console.log('ModalManager: Mouse entered modal');
                this.isHoveringModal = true;
                if (this.closeTimer) clearTimeout(this.closeTimer);
            });

            content.addEventListener('mouseleave', () => {
                console.log('ModalManager: Mouse left modal');
                this.isHoveringModal = false;
                this.scheduleClose();
            });
        });
    }

    bindCategoryEvents() {
        const triggers = document.querySelectorAll('.modal-trigger');
        console.log('ModalManager: Binding events to', triggers.length, 'triggers');
        
        triggers.forEach(trigger => {
            const type = trigger.dataset.modal;
            console.log('ModalManager: Binding events for category:', type);

            // 3D Tilt Effect
            let rect;
            const handleMove = (e) => {
                if (!rect) rect = trigger.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                const rx = (py - 0.5) * -10;
                const ry = (px - 0.5) * 10;
                trigger.style.setProperty('--rx', rx + 'deg');
                trigger.style.setProperty('--ry', ry + 'deg');
                trigger.style.setProperty('--mx', (px * 100) + '%');
                trigger.style.setProperty('--my', (py * 100) + '%');
            };

            const handleEnter = (e) => {
                // Get the card's bounding rectangle
                rect = trigger.getBoundingClientRect();
                
                // Check if mouse is actually within the card boundaries
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                if (mouseX >= rect.left && mouseX <= rect.right && 
                    mouseY >= rect.top && mouseY <= rect.bottom) {
                    
                    console.log('ModalManager: Hovering over category:', type);
                    this.isHoveringTrigger = true;
                    
                    // Clear any existing timers
                    if (this.closeTimer) clearTimeout(this.closeTimer);
                    if (this.openTimer) clearTimeout(this.openTimer);
                    
                    // Immediate visual feedback
                    trigger.style.transform = 'scale(1.02)';
                    trigger.style.transition = 'transform 0.2s ease';
                    
                    // Shorter delay for better responsiveness
                    this.openTimer = setTimeout(() => {
                        console.log('ModalManager: Opening modal for:', type);
                        this.openModal(type);
                    }, 300); // Reduced delay for better responsiveness
                }
            };

            const handleLeave = (e) => {
                // Check if mouse actually left the card
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                if (mouseX < rect.left || mouseX > rect.right || 
                    mouseY < rect.top || mouseY > rect.bottom) {
                    
                    console.log('ModalManager: Left category:', type);
                    rect = null;
                    this.isHoveringTrigger = false;
                    
                    // Smooth reset of card appearance
                    trigger.style.transform = 'scale(1)';
                    trigger.style.setProperty('--rx', '0deg');
                    trigger.style.setProperty('--ry', '0deg');
                    trigger.style.setProperty('--mx', '50%');
                    trigger.style.setProperty('--my', '50%');
                    
                    // Schedule modal close with shorter delay
                    this.scheduleClose();
                }
            };

            trigger.addEventListener('mouseenter', handleEnter);
            trigger.addEventListener('mousemove', handleMove);
            trigger.addEventListener('mouseleave', handleLeave);
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
            console.log('ModalManager: Showing modal:', type);
            
            // Get the trigger element that was hovered
            const trigger = document.querySelector(`[data-modal="${type}"]`);
            if (trigger) {
                // Get the trigger's position
                const triggerRect = trigger.getBoundingClientRect();
                
                // Modal dimensions
                const modalWidth = 288; // w-72 = 288px
                const modalHeight = 320; // max-h-80 = 320px
                
                // Calculate position directly above the trigger, perfectly centered
                let left = triggerRect.left + (triggerRect.width / 2) - (modalWidth / 2);
                let top = triggerRect.top - modalHeight - 15; // 15px above the card
                
                // Ensure modal doesn't go off-screen
                if (left < 10) {
                    left = 10; // Small margin from left edge
                } else if (left + modalWidth > window.innerWidth - 10) {
                    left = window.innerWidth - modalWidth - 10; // Small margin from right edge
                }
                
                // If no space above, show below the card
                if (top < 10) {
                    top = triggerRect.bottom + 15;
                }
                
                // Ensure modal doesn't go below viewport
                if (top + modalHeight > window.innerHeight - 10) {
                    top = window.innerHeight - modalHeight - 10;
                }
                
                // Apply positioning with clean styles
                modal.style.position = 'fixed';
                modal.style.left = left + 'px';
                modal.style.top = top + 'px';
                modal.style.display = 'block';
                modal.style.zIndex = '9999';
                
                // Ensure no background issues
                modal.style.backgroundColor = 'transparent';
                modal.style.boxShadow = 'none';
            }
            
            // Clean modal display
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.pointerEvents = 'auto';
            
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        } else {
            console.error('ModalManager: Modal not found:', type);
        }
    }

    closeModal(type) {
        const modal = document.getElementById(type + '-modal');
        if (modal) {
            console.log('ModalManager: Closing modal:', type);
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

    positionModalAtTrigger(type) {
        const modal = document.getElementById(type + '-modal');
        const trigger = document.querySelector(`.modal-trigger[data-modal="${type}"]`);
        if (!modal || !trigger) return;

        const content = modal.querySelector('.modal-content');
        const rect = trigger.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 16;

        const cw = content ? content.offsetWidth : 0;
        const ch = content ? content.offsetHeight : 0;

        let cx = rect.left + rect.width / 2;
        let cy = rect.top + rect.height / 2;

        const minX = margin + (cw ? cw / 2 : 0);
        const maxX = vw - margin - (cw ? cw / 2 : 0);
        const minY = margin + (ch ? ch / 2 : 0);
        const maxY = vh - margin - (ch ? ch / 2 : 0);

        cx = Math.min(Math.max(cx, minX), maxX);
        cy = Math.min(Math.max(cy, minY), maxY);

        if (content) {
            content.style.left = `${cx}px`;
            content.style.top = `${cy}px`;
        }
    }

    scheduleClose() {
        if (this.closeTimer) clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => {
            if (!this.isHoveringTrigger && !this.isHoveringModal && this.currentModal) {
                console.log('ModalManager: Auto-closing modal:', this.currentModal);
                this.closeModal(this.currentModal);
            }
        }, 400); // Reduced delay for better responsiveness
    }

    isMouseOverElement(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return this.mouseX >= rect.left && this.mouseX <= rect.right && 
               this.mouseY >= rect.top && this.mouseY <= rect.bottom;
    }

    updateMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    handleScroll() {
        if (!this.currentModal) return;
        
        const trigger = document.querySelector(`.modal-trigger[data-modal="${this.currentModal}"]`);
        if (!trigger) {
            this.closeModal(this.currentModal);
            return;
        }

        if (!this.isMouseOverElement(trigger)) {
            this.closeModal(this.currentModal);
        } else {
            this.positionModalAtTrigger(this.currentModal);
        }
    }

    handleResize() {
        if (this.currentModal) {
            this.positionModalAtTrigger(this.currentModal);
        }
    }
}

// Initialize modal manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('ModalManager: DOM ready, initializing...');
    const modalManager = new ModalManager();
    modalManager.init();
    
    // Make modal manager globally available
    window.modalManager = modalManager;
    
    // Bind scroll and resize events
    window.addEventListener('scroll', () => modalManager.handleScroll(), { passive: true });
    window.addEventListener('resize', () => modalManager.handleResize());
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        modalManager.updateMousePosition(e.clientX, e.clientY);
    });
    
    console.log('ModalManager: Setup complete');
});
