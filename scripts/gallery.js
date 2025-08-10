

// Afficher un aperçu de l'image sélectionnée
function previewImage(input) {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = ''; // vide l'aperçu précédent
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '300px';
      img.style.maxHeight = '200px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Gestion de la soumission du formulaire galerie
document.getElementById('galleryForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();

  // Récupérer les champs texte
  formData.append('title', form.title.value);
  formData.append('category', form.category.value);
  formData.append('description', form.description.value);

  // Récupérer le fichier image
  const fileInput = form.querySelector('input[type="file"]');
  if (fileInput.files.length > 0) {
    formData.append('image', fileInput.files[0]);
  }

  try {
    const res = await fetch(`${API_URL}/api/gallery`, {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      alert('Image ajoutée à la galerie avec succès !');
      form.reset();
      document.getElementById('imagePreview').innerHTML = '';
      loadGalleryItems();  // rafraîchit la galerie
    } else {
      alert('Erreur : ' + (result.error || 'Impossible d\'ajouter l\'image'));
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
});

// Exemple simple pour charger les images depuis le backend (à adapter)
async function loadGalleryItems() {
  try {
    const res = await fetch(`${API_URL}/api/gallery`);
    if (!res.ok) throw new Error('Erreur chargement galerie');
    const items = await res.json();

    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    items.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('gallery-item');

      // Construire chemin image complet, adapte selon backend
      const imgSrc = item.imageUrl
        ? `${API_URL}${item.imageUrl}`  // note : pas de '/' car imageUrl commence par '/'
        : 'https://via.placeholder.com/200x150?text=Image+indisponible';

      div.innerHTML = `
        <img src="${imgSrc}" alt="${item.title}">
        <div class="gallery-item-actions">
          <button class="action-btn bg-warning text-dark" onclick="editGalleryItem('${item._id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn bg-danger text-white" onclick="deleteGalleryItem('${item._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="gallery-item-info">
          <h6>${item.title}</h6>
          <small class="text-muted">Catégorie: ${item.category}</small>
        </div>
      `;
      grid.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// Modifier un élément de la galerie (exemple simple : pré-remplit le formulaire)
async function editGalleryItem(id) {
  try {
    const res = await fetch(`${API_URL}/api/gallery/${id}`);
    if (!res.ok) throw new Error('Erreur chargement de l\'image');
    const item = await res.json();

    const form = document.getElementById('galleryForm');
    form.title.value = item.title;
    form.category.value = item.category;
    form.description.value = item.description || '';

    // Affiche l'image actuelle dans l'aperçu
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    if (item.imageUrl) {
      const img = document.createElement('img');
      img.src = `${API_URL}${item.imageUrl}`;
      img.style.maxWidth = '300px';
      img.style.maxHeight = '200px';
      preview.appendChild(img);
    }

    // Remplacer la fonction submit pour faire un update
    form.onsubmit = async function(e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append('title', form.title.value);
      formData.append('category', form.category.value);
      formData.append('description', form.description.value);

      const fileInput = form.querySelector('input[type="file"]');
      if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
      }

      try {
        const updateRes = await fetch(`${API_URL}/api/gallery/${id}`, {
          method: 'PUT',
          body: formData,
        });
        const result = await updateRes.json();

        if (updateRes.ok) {
          alert('Image mise à jour avec succès !');
          form.reset();
          preview.innerHTML = '';
          loadGalleryItems();

          // Remet le comportement original du formulaire
          form.onsubmit = null;
          form.addEventListener('submit', galleryFormSubmitHandler);
        } else {
          alert('Erreur : ' + (result.error || 'Impossible de mettre à jour l\'image'));
        }
      } catch (err) {
        alert('Erreur réseau ou serveur');
        console.error(err);
      }
    };

  } catch (err) {
    alert('Erreur chargement image');
    console.error(err);
  }
}

// Suppression d'un élément de la galerie
async function deleteGalleryItem(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

  try {
    const res = await fetch(`${API_URL}/api/gallery/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Image supprimée avec succès !');
      loadGalleryItems();
    } else {
      const result = await res.json();
      alert('Erreur : ' + (result.error || 'Impossible de supprimer l\'image'));
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
}

// Garde le handler d'origine pour la soumission du formulaire (pour le reset après edition)
function galleryFormSubmitHandler(e) {
  e.preventDefault();
  // Replacer par ton code initial de soumission du formulaire
  // Ou ré-appeler la fonction initiale que tu as
}


// Appel initial pour afficher la galerie
window.addEventListener('DOMContentLoaded', loadGalleryItems);
