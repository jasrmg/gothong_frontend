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

        // Modal logic
        const confirmationModal = document.getElementById('confirmationModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modalOkBtn = document.getElementById('modalOkBtn');

        function showModal() {
            confirmationModal.style.display = 'flex';
        }
        function hideModal() {
            confirmationModal.style.display = 'none';
        }
        closeModalBtn.addEventListener('click', hideModal);
        modalOkBtn.addEventListener('click', hideModal);
        confirmationModal.addEventListener('click', function(e) {
            if (e.target === confirmationModal) hideModal();
        });

        // Form submission handling
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            // If all required fields are filled, show modal
            showModal();
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

        // Others card modal logic
        const othersCard = document.getElementById('othersCard');
        const othersModal = document.getElementById('othersModal');
        const closeOthersModal = document.getElementById('closeOthersModal');
        const otherDocFile = document.getElementById('otherDocFile');
        const customModalUploadLabel = document.querySelector('.custom-modal-upload-label');
        const submitOtherDocBtn = document.getElementById('submitOtherDocBtn');

        // Main document cards modal logic
        const billOfLadingCard = document.getElementById('billOfLadingCard');
        const commercialInvoiceCard = document.getElementById('commercialInvoiceCard');
        const packingListCard = document.getElementById('packingListCard');
        const certificateOriginCard = document.getElementById('certificateOriginCard');
        const uploadModal = document.getElementById('uploadModal');
        const closeUploadModal = document.getElementById('closeUploadModal');
        const uploadModalTitle = document.getElementById('uploadModalTitle');
        const mainDocFile = document.getElementById('mainDocFile');
        const submitMainDocBtn = document.getElementById('submitMainDocBtn');

        function openUploadModal(title) {
          uploadModalTitle.textContent = `Upload ${title}`;
          uploadModal.style.display = 'flex';
          mainDocFile.value = '';
        }
        function closeUploadModalFunc() {
          uploadModal.style.display = 'none';
        }
        billOfLadingCard.addEventListener('click', function() {
          openUploadModal('Bill of Lading');
        });
        commercialInvoiceCard.addEventListener('click', function() {
          openUploadModal('Commercial Invoice');
        });
        packingListCard.addEventListener('click', function() {
          openUploadModal('Packing List');
        });
        certificateOriginCard.addEventListener('click', function() {
          openUploadModal('Certificate of Origin');
        });
        closeUploadModal.addEventListener('click', closeUploadModalFunc);
        uploadModal.addEventListener('click', function(e) {
          if (e.target === uploadModal) closeUploadModalFunc();
        });
        submitMainDocBtn.addEventListener('click', function() {
          const files = mainDocFile.files;
          if (!files || files.length === 0) {
            alert('Please select at least one file.');
            return;
          }
          // Here you would typically send the data to your backend
          // For demonstration, we'll just show an alert
          alert(`Submitting document: Files - ${files.length}`);
          uploadModal.style.display = 'none';
        });

        othersCard.addEventListener('click', function() {
          othersModal.style.display = 'flex';
        });
        closeOthersModal.addEventListener('click', function() {
          othersModal.style.display = 'none';
        });
        othersModal.addEventListener('click', function(e) {
          if (e.target === othersModal) othersModal.style.display = 'none';
        });
        customModalUploadLabel.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            otherDocFile.click();
          }
        });
        customModalUploadLabel.addEventListener('click', function() {
          otherDocFile.click();
        });

        // Submit button for others modal
        submitOtherDocBtn.addEventListener('click', function() {
            const label = document.getElementById('otherDocLabel').value;
            const files = otherDocFile.files;

            if (!label || files.length === 0) {
                alert('Please enter a label and select at least one file.');
                return;
            }

            // Here you would typically send the data to your backend
            // For demonstration, we'll just show an alert
            alert(`Submitting document: Label - ${label}, Files: ${files.length}`);
            othersModal.style.display = 'none'; // Close modal after submission
        });