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
        const tableRows = document.querySelectorAll('tbody tr');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            tableRows.forEach(row => {
                const vesselName = row.cells[0].textContent.toLowerCase();
                const vesselType = row.cells[1].textContent.toLowerCase();
                const origin = row.cells[2].textContent.toLowerCase();
                const destination = row.cells[3].textContent.toLowerCase();
                
                if (vesselName.includes(searchTerm) || 
                    vesselType.includes(searchTerm) || 
                    origin.includes(searchTerm) || 
                    destination.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
        
        // Filter functionality
        const filterSelects = document.querySelectorAll('.filter-select');
        
        filterSelects.forEach(select => {
            select.addEventListener('change', applyFilters);
        });
        
        function applyFilters() {
            const typeFilter = document.querySelector('.filter-select:nth-child(1)').value.toLowerCase();
            const statusFilter = document.querySelector('.filter-select:nth-child(2)').value.toLowerCase();
            const originFilter = document.querySelector('.filter-select:nth-child(3)').value.toLowerCase();
            const destinationFilter = document.querySelector('.filter-select:nth-child(4)').value.toLowerCase();
            
            tableRows.forEach(row => {
                const vesselType = row.cells[1].textContent.toLowerCase();
                const status = row.cells[4].textContent.toLowerCase();
                const origin = row.cells[2].textContent.toLowerCase();
                const destination = row.cells[3].textContent.toLowerCase();
                
                const typeMatch = typeFilter === '' || vesselType.includes(typeFilter);
                const statusMatch = statusFilter === '' || status.includes(statusFilter);
                const originMatch = originFilter === '' || origin.includes(originFilter);
                const destinationMatch = destinationFilter === '' || destination.includes(destinationFilter);
                
                if (typeMatch && statusMatch && originMatch && destinationMatch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
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