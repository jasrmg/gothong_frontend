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
        
        // Set default date to today
        document.getElementById('incidentDate').valueAsDate = new Date();
        
        // Severity selection
        function selectSeverity(severity) {
            document.querySelectorAll('.severity-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            document.querySelector(`.severity-option[data-severity="${severity}"]`).classList.add('selected');
            document.getElementById('severityLevel').value = severity;
        }
        
        // File upload styling
        document.getElementById('incidentEvidence').addEventListener('change', function(e) {
            const fileName = this.files.length > 0 ? 
                (this.files.length > 1 ? `${this.files.length} files selected` : this.files[0].name) : 
                "";
            
            const uploadLabel = this.parentElement.querySelector('.file-upload-label');
            
            if (fileName) {
                uploadLabel.style.borderStyle = 'solid';
                uploadLabel.style.borderColor = 'var(--accent)';
                const titleElem = uploadLabel.querySelector('.file-upload-title');
                if (titleElem) titleElem.textContent = fileName;
            }
        });
        
        // Form functions
        function resetForm() {
            document.getElementById('incidentReportForm').reset();
            
            // Reset severity selection
            document.querySelectorAll('.severity-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            document.getElementById('severityLevel').value = '';
            
            // Reset file upload styling
            const uploadLabel = document.querySelector('.file-upload-label');
            uploadLabel.style.borderStyle = 'dashed';
            uploadLabel.style.borderColor = 'var(--gray)';
            document.querySelector('.file-upload-label .file-upload-title').textContent = 'Upload Files';
            
            // Set default date again
            document.getElementById('incidentDate').valueAsDate = new Date();
        }
        
        document.getElementById('incidentReportForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate severity is selected
            if (!document.getElementById('severityLevel').value) {
                alert('Please select an incident severity level.');
                return;
            }
            
            // In a real app, you would submit the form data to a server
            // For demo purposes, just show a success message
            alert('Incident report submitted successfully!');
            window.location.href = 'view-incident-feed.html';
        });

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