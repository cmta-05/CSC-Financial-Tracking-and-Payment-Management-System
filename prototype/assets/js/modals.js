// Universal Modal Initialization Script
// This ensures all modals work properly after common_modals.html is loaded

(function() {
  'use strict';

  // Initialize modals after DOM is ready
  function initializeModals() {
    // Wait for Bootstrap to be available
    if (typeof bootstrap === 'undefined') {
      setTimeout(initializeModals, 100);
      return;
    }

    // Find all modal triggers
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    
    modalTriggers.forEach(trigger => {
      // Remove any existing event listeners by cloning
      const newTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(newTrigger, trigger);
      
      // Add click event listener
      newTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const targetId = this.getAttribute('data-bs-target');
        if (!targetId) return;
        
        const targetModal = document.querySelector(targetId);
        if (targetModal) {
          const bsModal = new bootstrap.Modal(targetModal, {
            backdrop: true,
            keyboard: true
          });
          bsModal.show();
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModals);
  } else {
    initializeModals();
  }

  // Re-initialize after modals are loaded (for dynamically loaded content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        initializeModals();
      }
    });
  });

  // Observe the commonModals container
  const commonModalsContainer = document.getElementById('commonModals');
  if (commonModalsContainer) {
    observer.observe(commonModalsContainer, {
      childList: true,
      subtree: true
    });
  }

  // Also initialize after a short delay to catch dynamically loaded modals
  setTimeout(initializeModals, 500);
  setTimeout(initializeModals, 1000);
  setTimeout(initializeModals, 2000);
})();









