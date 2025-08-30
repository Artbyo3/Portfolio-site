// Art Portfolio Card Effects Manager
class ArtCardManager {
    constructor() {
        this.cardRef = null;
        this.rafRef = null;
        this.isHovered = false;
    }

    init() {
        this.cardRef = document.getElementById('art-portfolio-card');
        if (!this.cardRef) return;

        this.bindEvents();
        console.log('Art Card Manager initialized');
    }

    bindEvents() {
        if (!this.cardRef) return;

        let rect = null;

        const handleMouseMove = (e) => {
            if (!rect) rect = this.cardRef.getBoundingClientRect();
            
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            
            // Calculate 3D tilt
            const rx = (py - 0.5) * -12;
            const ry = (px - 0.5) * 10;
            
            // Apply 3D transform to main card
            this.cardRef.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
            
            // Multi-layer parallax effect
            const artLayers = this.cardRef.querySelectorAll('.art-layer');
            artLayers.forEach((layer, index) => {
                const depth = (index + 1) * 5;
                const moveX = (px - 0.5) * depth;
                const moveY = (py - 0.5) * depth;
                layer.style.transform = `translate3d(${moveX}px, ${moveY}px, ${-depth * 2}px)`;
            });
            
            // Floating elements parallax
            const artElements = this.cardRef.querySelectorAll('.art-element, .art-3d-element');
            artElements.forEach((element, index) => {
                const depth = (index % 3 + 1) * 8;
                const moveX = (px - 0.5) * depth * 0.5;
                const moveY = (py - 0.5) * depth * 0.5;
                const currentTransform = element.style.transform;
                const baseTransform = currentTransform.includes('translateZ') ? 
                    currentTransform.replace(/translate3d\([^)]+\)/, '') : 
                    currentTransform;
                element.style.transform = `${baseTransform} translate3d(${moveX}px, ${moveY}px, ${depth}px)`;
            });
            
            // Content 3D depth effect
            const artContent = this.cardRef.querySelector('.art-content-3d');
            if (artContent) {
                const contentDepth = 15;
                const contentMoveX = (px - 0.5) * contentDepth * 0.3;
                const contentMoveY = (py - 0.5) * contentDepth * 0.3;
                artContent.style.transform = `translate3d(${contentMoveX}px, ${contentMoveY}px, ${contentDepth}px)`;
            }
            
            // Individual element depth effects
            const artIcon = this.cardRef.querySelector('.art-icon-3d');
            if (artIcon) {
                const iconDepth = 25;
                const iconMoveX = (px - 0.5) * iconDepth * 0.4;
                const iconMoveY = (py - 0.5) * iconDepth * 0.4;
                artIcon.style.transform = `translate3d(${iconMoveX}px, ${iconMoveY}px, ${iconDepth}px)`;
            }
            
            const artText = this.cardRef.querySelector('.art-text-3d');
            if (artText) {
                const textDepth = 20;
                const textMoveX = (px - 0.5) * textDepth * 0.2;
                const textMoveY = (py - 0.5) * textDepth * 0.2;
                artText.style.transform = `translate3d(${textMoveX}px, ${textMoveY}px, ${textDepth}px)`;
            }
            
            const artButton = this.cardRef.querySelector('.art-button-3d');
            if (artButton) {
                const buttonDepth = 30;
                const buttonMoveX = (px - 0.5) * buttonDepth * 0.5;
                const buttonMoveY = (py - 0.5) * buttonDepth * 0.5;
                artButton.style.transform = `translate3d(${buttonMoveX}px, ${buttonMoveY}px, ${buttonDepth}px)`;
            }
            
            // Tags individual depth
            const artTags = this.cardRef.querySelectorAll('.art-tag');
            artTags.forEach((tag, index) => {
                const tagDepth = 10 + (index * 2);
                const tagMoveX = (px - 0.5) * tagDepth * 0.3;
                const tagMoveY = (py - 0.5) * tagDepth * 0.3;
                tag.style.transform = `translate3d(${tagMoveX}px, ${tagMoveY}px, ${tagDepth}px)`;
            });
        };

        const handleMouseEnter = () => {
            rect = this.cardRef.getBoundingClientRect();
            this.isHovered = true;
            
            // Focus parallax on art card
            if (window.parallaxManager) {
                window.parallaxManager.setFocusToElement(this.cardRef);
            }
            
            // Add hover class for enhanced effects
            this.cardRef.classList.add('art-hover-active');
            
            // Animate layers in
            const artLayers = this.cardRef.querySelectorAll('.art-layer');
            artLayers.forEach((layer, index) => {
                layer.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
                setTimeout(() => {
                    layer.style.filter = `blur(${Math.max(0, 2 - index * 0.5)}px)`;
                }, index * 100);
            });
            
            // Animate floating elements
            const artElements = this.cardRef.querySelectorAll('.art-element, .art-3d-element');
            artElements.forEach((element, index) => {
                element.style.animationPlayState = 'running';
                element.style.animationDuration = `${8 + index * 0.5}s`;
            });
        };

        const handleMouseLeave = () => {
            rect = null;
            this.isHovered = false;
            
            // Reset all transforms
            this.cardRef.style.transform = '';
            const artLayers = this.cardRef.querySelectorAll('.art-layer');
            artLayers.forEach(layer => {
                layer.style.transform = '';
                layer.style.filter = '';
            });
            
            const artElements = this.cardRef.querySelectorAll('.art-element, .art-3d-element');
            artElements.forEach(element => {
                element.style.transform = '';
                element.style.animationPlayState = 'paused';
            });
            
            const artContent = this.cardRef.querySelector('.art-content-3d');
            if (artContent) artContent.style.transform = '';
            
            const artIcon = this.cardRef.querySelector('.art-icon-3d');
            if (artIcon) artIcon.style.transform = '';
            
            const artText = this.cardRef.querySelector('.art-text-3d');
            if (artText) artText.style.transform = '';
            
            const artButton = this.cardRef.querySelector('.art-button-3d');
            if (artButton) artButton.style.transform = '';
            
            const artTags = this.cardRef.querySelectorAll('.art-tag');
            artTags.forEach(tag => tag.style.transform = '');
            
            // Remove hover class
            this.cardRef.classList.remove('art-hover-active');
            
            // Deactivate parallax focus
            if (window.parallaxManager) {
                window.parallaxManager.clearFocus();
            }
        };

        this.cardRef.addEventListener('mousemove', handleMouseMove);
        this.cardRef.addEventListener('mouseenter', handleMouseEnter);
        this.cardRef.addEventListener('mouseleave', handleMouseLeave);
    }
}

// Initialize art card manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const artCardManager = new ArtCardManager();
    artCardManager.init();
    
    // Make art card manager globally available
    window.artCardManager = artCardManager;
});
