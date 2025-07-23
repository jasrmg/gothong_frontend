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
        const searchInput = document.getElementById('searchInput');
        const tableRows = document.querySelectorAll('tbody tr');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            applyFilters();
        });
        
        // Filter functionality
        const statusFilter = document.getElementById('statusFilter');
        const originFilter = document.getElementById('originFilter');
        const destinationFilter = document.getElementById('destinationFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        statusFilter.addEventListener('change', applyFilters);
        originFilter.addEventListener('change', applyFilters);
        destinationFilter.addEventListener('change', applyFilters);
        dateFilter.addEventListener('change', applyFilters);
        
        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const statusValue = statusFilter.value;
            const originValue = originFilter.value;
            const destinationValue = destinationFilter.value;
            const dateValue = dateFilter.value;
            
            tableRows.forEach(row => {
                const rowData = Array.from(row.cells).map(cell => cell.textContent.toLowerCase());
                const status = row.getAttribute('data-status');
                const origin = row.getAttribute('data-origin');
                const destination = row.getAttribute('data-destination');
                const date = row.getAttribute('data-date');
                
                // Search filter
                const matchesSearch = rowData.some(text => text.includes(searchTerm));
                
                // Status filter
                const matchesStatus = statusValue === '' || status === statusValue;
                
                // Origin filter
                const matchesOrigin = originValue === '' || origin === originValue;
                
                // Destination filter
                const matchesDestination = destinationValue === '' || destination === destinationValue;
                
                // Date filter
                let matchesDate = true;
                if (dateValue !== '') {
                    const shipmentDate = new Date(date);
                    const today = new Date();
                    
                    if (dateValue === 'today') {
                        matchesDate = shipmentDate.toDateString() === today.toDateString();
                    } else if (dateValue === 'week') {
                        const weekAgo = new Date();
                        weekAgo.setDate(today.getDate() - 7);
                        matchesDate = shipmentDate >= weekAgo;
                    } else if (dateValue === 'month') {
                        const monthAgo = new Date();
                        monthAgo.setMonth(today.getMonth() - 1);
                        matchesDate = shipmentDate >= monthAgo;
                    } else if (dateValue === 'quarter') {
                        const quarterAgo = new Date();
                        quarterAgo.setMonth(today.getMonth() - 3);
                        matchesDate = shipmentDate >= quarterAgo;
                    }
                }
                
                // Show or hide based on all filters
                if (matchesSearch && matchesStatus && matchesOrigin && matchesDestination && matchesDate) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        // Sorting functionality
        let currentSortColumn = -1;
        let currentSortDirection = 'asc';
        
        function sortTable(columnIndex) {
            const table = document.querySelector('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Update sort direction
            if (currentSortColumn === columnIndex) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortDirection = 'asc';
                currentSortColumn = columnIndex;
            }
            
            // Sort the rows
            rows.sort((a, b) => {
                let aValue = a.cells[columnIndex].textContent;
                let bValue = b.cells[columnIndex].textContent;
                
                // Handle date sorting
                if (columnIndex === 5) { // Estimated Arrival column
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }
                
                // Compare values based on sort direction
                let comparison = 0;
                if (aValue > bValue) {
                    comparison = 1;
                } else if (aValue < bValue) {
                    comparison = -1;
                }
                
                return currentSortDirection === 'asc' ? comparison : -comparison;
            });
            
            // Re-append rows in the sorted order
            rows.forEach(row => tbody.appendChild(row));
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

        // --- Submanifest Data and Card/Detail Logic ---
        const submanifests = [
            {
                id: 'SMF-2024-001',
                consignee: 'ABC Trading Co.',
                createdAt: '2024-05-20',
                status: 'Completed',
                customClearance: 'Cleared',
                relatedDocs: ['Bill of Lading.pdf', 'Packing List.pdf', 'Invoice.pdf']
            },
            {
                id: 'SMF-2024-002',
                consignee: 'XYZ Logistics',
                createdAt: '2024-05-18',
                status: 'In Transit',
                customClearance: 'Pending',
                relatedDocs: ['Bill of Lading.pdf', 'Cargo Manifest.pdf']
            }
            // Add more sample submanifests as needed
        ];

        function renderSubmanifestCards() {
            const grid = document.getElementById('submanifest-cards-grid');
            grid.innerHTML = '';
            submanifests.forEach((sm, idx) => {
                const card = document.createElement('div');
                card.className = 'submanifest-card';
                card.setAttribute('data-index', idx);
                // Status badge color
                let statusBadgeClass = 'badge-other';
                if (sm.status.toLowerCase() === 'completed') statusBadgeClass = 'badge-completed';
                else if (sm.status.toLowerCase() === 'in transit') statusBadgeClass = 'badge-in-transit';
                else if (sm.status.toLowerCase() === 'processing') statusBadgeClass = 'badge-processing';
                else if (sm.status.toLowerCase() === 'pending') statusBadgeClass = 'badge-pending';
                // Clearance badge color
                let clearanceBadgeClass = 'badge-other';
                if (sm.customClearance.toLowerCase() === 'cleared') clearanceBadgeClass = 'badge-cleared';
                else if (sm.customClearance.toLowerCase() === 'pending') clearanceBadgeClass = 'badge-pending-clearance';
                card.innerHTML = `
                    <div class="submanifest-card-header">
                        <div class="submanifest-card-icon"><i class="fas fa-file-invoice"></i></div>
                        <div class="submanifest-card-title">
                            <h3>${sm.id}</h3>
                            <p>${sm.consignee}</p>
                        </div>
                    </div>
                    <div class="submanifest-card-info"><strong>Created At:</strong>&nbsp;${sm.createdAt}</div>
                    <div class="submanifest-card-info">
                        <strong>Status:</strong>
                        <span class="submanifest-badge ${statusBadgeClass}">${sm.status}</span>
                    </div>
                    <div class="submanifest-card-info">
                        <strong>Custom Clearance:</strong>
                        <span class="submanifest-badge ${clearanceBadgeClass}">${sm.customClearance}</span>
                    </div>
                `;
                card.addEventListener('click', () => showSubmanifestDetail(idx));
                grid.appendChild(card);
            });
        }

        function showSubmanifestDetail(idx) {
            const sm = submanifests[idx];
            document.getElementById('detail-submanifest-id').textContent = `Submanifest ID: ${sm.id}`;
            document.getElementById('detail-consignee').textContent = sm.consignee;
            document.getElementById('detail-created-at').textContent = sm.createdAt;
            document.getElementById('detail-status').textContent = sm.status;
            document.getElementById('detail-custom-clearance').textContent = sm.customClearance;
            const docsList = document.getElementById('detail-related-docs');
            docsList.innerHTML = '';
            sm.relatedDocs.forEach(doc => {
                const li = document.createElement('li');
                li.textContent = doc;
                docsList.appendChild(li);
            });
            document.getElementById('submanifest-list-section').style.display = 'none';
            document.getElementById('submanifest-detail-section').style.display = 'block';
            window.scrollTo(0, 0);
        }

        document.getElementById('back-to-list-btn').addEventListener('click', function() {
            document.getElementById('submanifest-detail-section').style.display = 'none';
            document.getElementById('submanifest-list-section').style.display = 'block';
        });

        // Initial render
        renderSubmanifestCards();