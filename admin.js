  
        // Toggle sidebar
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-open');
        }
        // Show specific section
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            // aUpdate active menu item
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            event.currentTarget.classList.add('active');
            // Hide sidebar after selection
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            sidebar.classList.remove('active');
            mainContent.classList.remove('sidebar-open');
        }
        // Image preview for gallery
        function previewImage(input) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = '';
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'image-preview';
                    preview.appendChild(img);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        // Image preview for partner logo
        function previewPartnerLogo(input) {
            const preview = document.getElementById('partnerLogoPreview');
            preview.innerHTML = '';
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'image-preview';
                    preview.appendChild(img);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        // Edit gallery item
        function editGalleryItem(id) {
            alert('Modification de l\'élément de galerie #' + id);
            // Ici vous pourriez ouvrir un modal ou remplir le formulaire avec les données existantes
        }
        // Delete gallery item
        function deleteGalleryItem(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                alert('Élément #' + id + ' supprimé');
                // Ici vous pourriez faire une requête AJAX pour supprimer l'élément de la base de données
            }
        }
        // Logout function
        function logout() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                alert('Déconnexion réussie');
                // Ici vous pourriez rediriger vers la page de login
                // window.location.href = 'login.html';
            }
        }
