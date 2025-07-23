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
        
        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        const incidentCards = document.querySelectorAll('.incident-card');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            applyFilters();
        });
        
        // Filter functionality
        const severityFilter = document.getElementById('severityFilter');
        const typeFilter = document.getElementById('typeFilter');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        severityFilter.addEventListener('change', applyFilters);
        typeFilter.addEventListener('change', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        dateFilter.addEventListener('change', applyFilters);
        
        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const severityValue = severityFilter.value.toLowerCase();
            const typeValue = typeFilter.value.toLowerCase();
            const statusValue = statusFilter.value.toLowerCase();
            const dateValue = dateFilter.value.toLowerCase();
            
            incidentCards.forEach(card => {
                const title = card.querySelector('.incident-title').textContent.toLowerCase();
                const description = card.querySelector('.incident-description').textContent.toLowerCase();
                const severity = card.getAttribute('data-severity');
                const type = card.getAttribute('data-type');
                const status = card.getAttribute('data-status');
                const date = card.getAttribute('data-date');
                
                // Search filter
                const matchesSearch = searchTerm === '' || 
                    title.includes(searchTerm) || 
                    description.includes(searchTerm);
                
                // Severity filter
                const matchesSeverity = severityValue === '' || severity === severityValue;
                
                // Type filter
                const matchesType = typeValue === '' || type === typeValue;
                
                // Status filter
                const matchesStatus = statusValue === '' || status === statusValue;
                
                // Date filter
                let matchesDate = true;
                if (dateValue !== 'all') {
                    const incidentDate = new Date(date);
                    const today = new Date();
                    const oneDay = 24 * 60 * 60 * 1000;
                    
                    if (dateValue === 'today') {
                        matchesDate = incidentDate.toDateString() === today.toDateString();
                    } else if (dateValue === 'week') {
                        const diffDays = Math.round(Math.abs((today - incidentDate) / oneDay));
                        matchesDate = diffDays <= 7;
                    } else if (dateValue === 'month') {
                        matchesDate = incidentDate.getMonth() === today.getMonth() && 
                                     incidentDate.getFullYear() === today.getFullYear();
                    } else if (dateValue === 'quarter') {
                        const diffDays = Math.round(Math.abs((today - incidentDate) / oneDay));
                        matchesDate = diffDays <= 90;
                    }
                }
                
                // Show or hide based on all filters
                if (matchesSearch && matchesSeverity && matchesType && matchesStatus && matchesDate) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Generalized Submenu functionality
        document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(mainLink => {
            const subMenuId = mainLink.dataset.targetSubmenu;
            const subMenu = document.getElementById(subMenuId);
            
            if (!subMenu) {
                return; 
            }

            // --- Initial State Setup (Page Load) ---
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

            // --- Click Event Handler for Main Navigation Links ---
            mainLink.addEventListener('click', (e) => {
                e.preventDefault();

                const clickedMainLink = mainLink;
                const clickedSubMenu = subMenu;
                const isClickedSubMenuAlreadyOpen = clickedSubMenu.classList.contains('open');

                document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(otherML => {
                    if (otherML !== clickedMainLink) {
                        otherML.classList.remove('active'); 
                        otherML.classList.remove('open');
                        const otherSM_id = otherML.dataset.targetSubmenu;
                        const otherSM = document.getElementById(otherSM_id);
                        if (otherSM) {
                            otherSM.classList.remove('open');
                            otherSM.style.maxHeight = null;
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
            });
        });