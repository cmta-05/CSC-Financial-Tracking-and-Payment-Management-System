// Reusable modal + ID utilities for the prototype (Bootstrap 5 required)

// Open a Bootstrap modal by ID
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  const modal = new bootstrap.Modal(el);
  modal.show();
}

// Close a Bootstrap modal by ID
function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  const modal = bootstrap.Modal.getInstance(el);
  if (modal) modal.hide();
}

// Simple random ID generator with prefix
function generateId(prefix) {
  return prefix + "-" + Math.floor(Math.random() * 99999);
}



