// Parallax Background System
class ParallaxManager {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetCx = 0.5;
        this.targetCy = 0.5;
        this.smoothCx = 0.5;
        this.smoothCy = 0.5;
        this.focusX = 0.5;
        this.focusY = 0.5;
        this.smoothBlobX = 0.5;
        this.smoothBlobY = 0.5;
        this.focusBlend = 0;
        this.lavaFocusActive = false;
        this.rafId = null;
        this.parallaxLayers = [];
    }

    init() {
        this.parallaxLayers = Array.from(document.querySelectorAll('#parallax-root [data-depth]'));
        this.bindEvents();
        this.startAnimation();
    }

    bindEvents() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.targetCx = this.mouseX / window.innerWidth;
            this.targetCy = this.mouseY / window.innerHeight;
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
        });
    }

    startAnimation() {
        const animate = () => {
            this.updateParallax();
            this.rafId = requestAnimationFrame(animate);
        };
        animate();
    }

    updateParallax() {
        // Smooth follow (lerp) so blobs are not glued to the cursor
        const ease = 0.1;
        this.smoothCx += (this.targetCx - this.smoothCx) * ease;
        this.smoothCy += (this.targetCy - this.smoothCy) * ease;

        // Blobs target: mouse or focused card center
        const blobTargetX = this.lavaFocusActive ? this.focusX : this.targetCx;
        const blobTargetY = this.lavaFocusActive ? this.focusY : this.targetCy;
        const blobEase = 0.12;
        this.smoothBlobX += (blobTargetX - this.smoothBlobX) * blobEase;
        this.smoothBlobY += (blobTargetY - this.smoothBlobY) * blobEase;

        // Mezcla suave entre modo libre y concentrado
        const focusEase = 0.12;
        this.focusBlend += ((this.lavaFocusActive ? 1 : 0) - this.focusBlend) * focusEase;

        const scrollY = window.scrollY || 0;

        this.parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth') || '0');
            const tx = (this.smoothCx - 0.5) * depth * 50;
            const ty = (this.smoothCy - 0.5) * depth * 50 + scrollY * depth * 0.3;
            
            layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

            // Mover los centros de los blobs con mezcla suave
            const free1x = 10 + this.smoothBlobX * 80;
            const free1y = 15 + this.smoothBlobY * 70;
            const free2x = 90 - this.smoothBlobX * 70;
            const free2y = 85 - this.smoothBlobY * 60;
            const free3x = 20 + (1 - this.smoothBlobX) * 60;
            const free3y = 20 + this.smoothBlobY * 60;
            const baseX = 12 + this.smoothBlobX * 76;
            const baseY = 12 + this.smoothBlobY * 76;

            const inv = 1 - this.focusBlend;
            const c1x = free1x * inv + baseX * this.focusBlend;
            const c1y = free1y * inv + baseY * this.focusBlend;
            const c2x = free2x * inv + baseX * this.focusBlend;
            const c2y = free2y * inv + baseY * this.focusBlend;
            const c3x = free3x * inv + baseX * this.focusBlend;
            const c3y = free3y * inv + baseY * this.focusBlend;

            layer.style.setProperty('--c1x', c1x + '%');
            layer.style.setProperty('--c1y', c1y + '%');
            layer.style.setProperty('--c2x', c2x + '%');
            layer.style.setProperty('--c2y', c2y + '%');
            layer.style.setProperty('--c3x', c3x + '%');
            layer.style.setProperty('--c3y', c3y + '%');
        });
    }

    setFocusToElement(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        this.focusX = (rect.left + rect.width / 2) / window.innerWidth;
        this.focusY = (rect.top + rect.height / 2) / window.innerHeight;
        this.lavaFocusActive = true;
    }

    clearFocus() {
        this.lavaFocusActive = false;
    }

    // Method to be called when hovering over category cards
    focusOnCategory(categoryId) {
        const trigger = document.querySelector(`.modal-trigger[data-modal="${categoryId}"]`);
        if (trigger) {
            this.setFocusToElement(trigger);
        }
    }

    // Method to be called when leaving category cards
    unfocusCategory() {
        this.clearFocus();
    }
}

// Initialize parallax manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const parallaxManager = new ParallaxManager();
    parallaxManager.init();
    
    // Make parallax manager globally available
    window.parallaxManager = parallaxManager;
});
