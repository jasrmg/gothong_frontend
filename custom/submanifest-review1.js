

  /**
 * Closes a modal by its ID.
 * @param {string} id - The ID of the modal to close.
 */
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

/**
 * Displays a modal by its ID.
 * @param {string} id - The ID of the modal to show.
 */
function showModal(id) {
  document.getElementById(id).style.display = "flex";
}

/**
 * Handles the submission of the rejection reason.
 * Validates input, closes modal, and shows alert.
 */
function submitRejection() {
  const reason = document.getElementById("rejectionReason").value;
  if (!reason.trim()) {
    alert("Please enter a reason.");  // Prevent empty submissions
    return;
  }

  // Log or send rejection reason (can be extended to API/database)
  console.log("Rejection reason:", reason);

  // Close modal and show success message
  closeModal("rejectModal");
  alert("Rejection recorded successfully.");
}

/**
 * Attaches event listeners after the DOM is fully loaded.
 * - Approve button triggers the success modal.
 * - Reject button triggers the reason input modal.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Handle "Approved" button click
  document.querySelector(".print-btn.clear").addEventListener("click", function () {
    showModal("successModal");
  });

  // Handle "Reject" button click
  document.querySelector(".print-btn.reject").addEventListener("click", function () {
    showModal("rejectModal");
  });
});
