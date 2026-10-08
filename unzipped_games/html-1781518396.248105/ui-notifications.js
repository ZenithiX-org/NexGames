export class UINotifications {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.modal = document.getElementById('custom-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalButtons = document.getElementById('modal-buttons');
    }

    showToast(message, type = 'info', duration = 3000) {
        if (!this.container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = message;
        
        this.container.appendChild(toast);
        
        // Trigger reflow for animation
        toast.offsetHeight; 
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Wait for transition
        }, duration);
    }

    showModal(title, message, buttons = [{ text: 'OK', onClick: null }]) {
        if (!this.modal) return;
        
        this.modalTitle.innerHTML = title;
        this.modalMessage.innerHTML = message;
        this.modalButtons.innerHTML = '';
        
        buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.textContent = btnConfig.text;
            btn.className = btnConfig.className || 'btn-primary';
            btn.onclick = () => {
                this.closeModal();
                if (btnConfig.onClick) btnConfig.onClick();
            };
            this.modalButtons.appendChild(btn);
        });
        
        this.modal.classList.remove('hidden');
        // Add show class for animation
        setTimeout(() => this.modal.classList.add('show'), 10);
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('show');
        setTimeout(() => this.modal.classList.add('hidden'), 300); 
    }

    /**
     * Shows a floating text animation over a specific DOM element (like the truck)
     * @param {string} text - The text to show (e.g. "+$500")
     * @param {string} type - 'money' or 'xp'
     */
    showFloatingText(text, type = 'money') {
        const floatingEl = document.createElement('div');
        floatingEl.classList.add('floating-text');
        if (type === 'xp') {
            floatingEl.classList.add('xp');
        }
        floatingEl.innerHTML = text;

        // Position it loosely near the center of the viewport (over the truck in top-down view)
        floatingEl.style.left = '50%';
        floatingEl.style.top = '40%';
        floatingEl.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(floatingEl);

        setTimeout(() => {
            if(floatingEl.parentNode) {
                floatingEl.parentNode.removeChild(floatingEl);
            }
        }, 1500); // Wait for CSS animation to finish
    }
}
