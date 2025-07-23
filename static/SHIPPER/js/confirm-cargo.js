       // Sidebar collapse functionality
       const collapseBtn = document.querySelector('.collapse-btn');
       const sidebar = document.querySelector('.sidebar');
       const mainContent = document.querySelector('.main-content');
       
       function isSidebarCollapsed() {
           return localStorage.getItem('sidebarCollapsed') === 'true';
       }

       if (isSidebarCollapsed()) {
           sidebar.classList.add('sidebar-collapsed');
           mainContent.classList.add('expanded');
       }

       collapseBtn.addEventListener('click', () => {
           sidebar.classList.toggle('sidebar-collapsed');
           mainContent.classList.toggle('expanded');
           localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('sidebar-collapsed'));
       });
       
       // Table filtering functionality
       document.getElementById('vesselFilter').addEventListener('change', filterTable);
       document.getElementById('statusFilter').addEventListener('change', filterTable);
       
       function filterTable() {
           const vesselFilter = document.getElementById('vesselFilter').value;
           const statusFilter = document.getElementById('statusFilter').value;
           const tableRows = document.querySelectorAll('.cargo-table tbody tr');
           
           tableRows.forEach(row => {
               const vessel = row.cells[3].textContent;
               const status = row.cells[4].textContent.trim();
               
               const vesselMatch = !vesselFilter || vessel === vesselFilter;
               const statusMatch = !statusFilter || status === statusFilter;
               
               if (vesselMatch && statusMatch) {
                   row.style.display = '';
           } else {
                   row.style.display = 'none';
               }
           });
       }
       
       // Mark as delivered functionality
       function markAsDelivered(cargoId) {
           if (confirm(`Are you sure you want to mark cargo ${cargoId} as delivered?`)) {
               // Find the row with this cargo ID
               const tableRows = document.querySelectorAll('.cargo-table tbody tr');
               tableRows.forEach(row => {
                   if (row.cells[0].textContent === cargoId) {
                       // Update status
                       const statusCell = row.cells[4];
                       statusCell.innerHTML = '<span class="status-badge delivered">Delivered</span>';
                       
                       // Update action button
                       const actionCell = row.cells[5];
                       const button = actionCell.querySelector('.btn-deliver');
                       button.className = 'btn-deliver completed';
                       button.disabled = true;
                       button.innerHTML = '<i class="fas fa-check-double"></i>';
                       button.title = 'Already Delivered';
                       
                       // Show success message
                       showNotification(`Cargo ${cargoId} has been marked as delivered successfully!`, 'success');
                   }
               });
           }
       }
       
       // Notification function
       function showNotification(message, type = 'info') {
           // Create notification element
           const notification = document.createElement('div');
           notification.className = `notification notification-${type}`;
           notification.style.cssText = `
               position: fixed;
               top: 20px;
               right: 20px;
               padding: 1rem 1.5rem;
               border-radius: 6px;
               color: white;
               font-weight: 500;
               z-index: 1000;
               animation: slideIn 0.3s ease;
               max-width: 300px;
           `;
           
           if (type === 'success') {
               notification.style.backgroundColor = 'var(--accent)';
           } else if (type === 'error') {
               notification.style.backgroundColor = 'var(--danger)';
           } else {
               notification.style.backgroundColor = 'var(--light-blue)';
           }
           
           notification.textContent = message;
           
           // Add to page
           document.body.appendChild(notification);
           
           // Remove after 3 seconds
           setTimeout(() => {
               notification.style.animation = 'slideOut 0.3s ease';
               setTimeout(() => {
                   if (notification.parentNode) {
                       notification.parentNode.removeChild(notification);
                   }
               }, 300);
           }, 3000);
       }
       
       // Add CSS animations for notifications
       const style = document.createElement('style');
       style.textContent = `
           @keyframes slideIn {
               from { transform: translateX(100%); opacity: 0; }
               to { transform: translateX(0); opacity: 1; }
           }
           @keyframes slideOut {
               from { transform: translateX(0); opacity: 1; }
               to { transform: translateX(100%); opacity: 0; }
           }
       `;
       document.head.appendChild(style);

       // Generalized Submenu functionality
       document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(mainLink => {
           const subMenuId = mainLink.dataset.targetSubmenu;
           const subMenu = document.getElementById(subMenuId);
           
           if (!subMenu) { 
               return; 
           }
           
           const chevronIcon = mainLink.querySelector('.fa-chevron-down'); 

           const setChevronVisibility = (linkElement, menuElement) => {
               const currentChevron = linkElement.querySelector('.fa-chevron-down');
               if (currentChevron) { 
                   if (menuElement.classList.contains('open')) {
                       currentChevron.style.display = 'none';
                   } else {
                       currentChevron.style.display = ''; 
                   }
               }
           };

           let isAnySubLinkActive = false;
           subMenu.querySelectorAll('.nav-link.active').forEach(() => {
               isAnySubLinkActive = true;
           });

           if (mainLink.classList.contains('active') || isAnySubLinkActive) {
               if (isAnySubLinkActive && !mainLink.classList.contains('active')) {
                   mainLink.classList.add('active');
               }
               mainLink.classList.add('open');
               subMenu.classList.add('open');
               subMenu.style.maxHeight = subMenu.scrollHeight + "px";
           }
           if (chevronIcon) { 
               setChevronVisibility(mainLink, subMenu);
           }

           mainLink.addEventListener('click', (e) => {
               e.preventDefault();

               const clickedMainLink = mainLink;
               const clickedSubMenu = subMenu;
               const clickedChevronIcon = clickedMainLink.querySelector('.fa-chevron-down'); 

               const isClickedSubMenuAlreadyOpen = clickedSubMenu.classList.contains('open');

               document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(otherML => {
                   if (otherML !== clickedMainLink) {
                       otherML.classList.remove('active'); 
                       otherML.classList.remove('open');
                       const otherSM_id = otherML.dataset.targetSubmenu;
                       const otherSM = document.getElementById(otherSM_id);
                       const otherChevronIcon = otherML.querySelector('.fa-chevron-down');
                       if (otherSM) {
                           otherSM.classList.remove('open');
                           otherSM.style.maxHeight = null;
                           if (otherChevronIcon) { 
                               setChevronVisibility(otherML, otherSM);
                           }
                       }
                   }
               });
               
               clickedMainLink.classList.add('active');

               if (isClickedSubMenuAlreadyOpen) {
                   clickedMainLink.classList.remove('open');
                   clickedSubMenu.classList.remove('open');
                   clickedSubMenu.style.maxHeight = null;
               } else {
                   clickedMainLink.classList.add('open');
                   clickedSubMenu.classList.add('open');
                   clickedSubMenu.style.maxHeight = clickedSubMenu.scrollHeight + "px";
               }
               
               if (clickedChevronIcon) { 
                   setChevronVisibility(clickedMainLink, clickedSubMenu);
               }
           });
       });

       // Replace the check-circle icon with a check icon in the table
       // (Do this in the HTML table rows: <i class="fas fa-check"></i> instead of fa-check-circle)

       // Store the selected cargo row for modal actions
       let selectedCargoRow = null;
       let selectedCargoId = null;

       // Update all action buttons to use the modal
       function setupActionButtons() {
         document.querySelectorAll('.btn-deliver').forEach(btn => {
           btn.onclick = function(e) {
             e.preventDefault();
             const row = btn.closest('tr');
             selectedCargoRow = row;
             selectedCargoId = row.cells[0].textContent;
             showConfirmModal(row);
           };
         });
       }
       setupActionButtons();

       function showConfirmModal(row) {
         // Fill modal details with a table for consistency
         const detailsHtml = `
           <table style="width:100%; border-collapse:collapse; color:var(--primary); font-size:1rem;">
             <tr><td style='font-weight:600; padding:0.2rem 0;'>Cargo ID:</td><td>${row.cells[0].textContent}</td></tr>
             <tr><td style='font-weight:600; padding:0.2rem 0;'>Description:</td><td>${row.cells[1].textContent}</td></tr>
             <tr><td style='font-weight:600; padding:0.2rem 0;'>Quantity:</td><td>${row.cells[2].textContent}</td></tr>
             <tr><td style='font-weight:600; padding:0.2rem 0;'>Vessel:</td><td>${row.cells[3].textContent}</td></tr>
             <tr><td style='font-weight:600; padding:0.2rem 0;'>Status:</td><td>${row.cells[4].textContent.replace(/<[^>]+>/g, '').trim()}</td></tr>
           </table>
         `;
         document.getElementById('modalDetails').innerHTML = detailsHtml;
         document.getElementById('modalRemarks').value = '';
         document.getElementById('confirmModal').classList.add('show');
       }

       document.getElementById('modalCancel').onclick = function() {
         document.getElementById('confirmModal').classList.remove('show');
         selectedCargoRow = null;
         selectedCargoId = null;
       };

       document.getElementById('modalConfirm').onclick = function() {
         if (!selectedCargoRow) return;
         // Mark as delivered in the table
         const statusCell = selectedCargoRow.cells[4];
         statusCell.innerHTML = '<span class="status-badge delivered">Delivered</span>';
         const actionCell = selectedCargoRow.cells[5];
         const button = actionCell.querySelector('.btn-deliver');
         button.className = 'btn-deliver completed';
         button.disabled = true;
         button.innerHTML = '<i class="fas fa-check-double"></i>';
         button.title = 'Already Delivered';
         document.getElementById('confirmModal').classList.remove('show');
         showNotification(`Cargo ${selectedCargoId} has been marked as delivered!`, 'success');
         selectedCargoRow = null;
         selectedCargoId = null;
       };

       // If you dynamically add rows, call setupActionButtons() again.