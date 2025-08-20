// Aperçu d'image ou vidéo
function previewMedia(input) {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = ''; // vide l'aperçu précédent
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const fileType = file.type;

      if (fileType.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '300px';
        img.style.maxHeight = '200px';
        preview.appendChild(img);
      }
      else if (fileType.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = e.target.result;
        video.controls = true;
        video.style.maxWidth = '300px';
        video.style.maxHeight = '200px';
        preview.appendChild(video);
      }
      else {
        preview.innerHTML = '<p>Type de fichier non supporté.</p>';
      }
    };

    reader.readAsDataURL(file);
  }
}

// Détection si c’est une vidéo (par extension)
function isVideo(url) {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// Soumission du formulaire galerie
async function galleryFormSubmitHandler(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();

  formData.append('title', form.title.value);
  formData.append('category', form.category.value);
  formData.append('description', form.description.value);

  const fileInput = form.querySelector('input[type="file"]');
  if (fileInput.files.length > 0) {
    formData.append('media', fileInput.files[0]);
  }

  try {
    const res = await fetch(`${API_URL}/api/gallery`, {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      alert('Fichier ajouté à la galerie avec succès !');
      form.reset();
      document.getElementById('imagePreview').innerHTML = '';
      loadGalleryItems();
    } else {
      alert('Erreur : ' + (result.error || 'Impossible d\'ajouter le fichier'));
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
}

// Charger la galerie
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

      let mediaHtml = '';
      if (item.imageUrl) {
        if (isVideo(item.imageUrl)) {
          mediaHtml = `<video src="${item.imageUrl}" controls style="max-width:100%; max-height:200px;"></video>`;
        } else {
          mediaHtml = `<img src="${item.imageUrl}" alt="${item.title}" style="max-width:100%; max-height:200px;">`;
        }
      } else {
        mediaHtml = '<img src="https://via.placeholder.com/200x150?text=Indisponible">';
      }

      div.innerHTML = `
        ${mediaHtml}
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

// Modifier un élément
async function editGalleryItem(id) {
  try {
    const res = await fetch(`${API_URL}/api/gallery/${id}`);
    if (!res.ok) throw new Error('Erreur chargement du fichier');
    const item = await res.json();

    const form = document.getElementById('galleryForm');
    form.title.value = item.title;
    form.category.value = item.category;
    form.description.value = item.description || '';

    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    if (item.imageUrl) {
      if (isVideo(item.imageUrl)) {
        const video = document.createElement('video');
        video.src = item.imageUrl;
        video.controls = true;
        video.style.maxWidth = '300px';
        video.style.maxHeight = '200px';
        preview.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.style.maxWidth = '300px';
        img.style.maxHeight = '200px';
        preview.appendChild(img);
      }
    }

    form.onsubmit = async function(e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append('title', form.title.value);
      formData.append('category', form.category.value);
      formData.append('description', form.description.value);

      const fileInput = form.querySelector('input[type="file"]');
      if (fileInput.files.length > 0) {
        formData.append('media', fileInput.files[0]);
      }

      try {
        const updateRes = await fetch(`${API_URL}/api/gallery/${id}`, {
          method: 'PUT',
          body: formData,
        });
        const result = await updateRes.json();

        if (updateRes.ok) {
          alert('Fichier mis à jour avec succès !');
          form.reset();
          preview.innerHTML = '';
          loadGalleryItems();
          form.onsubmit = galleryFormSubmitHandler;
        } else {
          alert('Erreur : ' + (result.error || 'Impossible de mettre à jour le fichier'));
        }
      } catch (err) {
        alert('Erreur réseau ou serveur');
        console.error(err);
      }
    };

  } catch (err) {
    alert('Erreur chargement fichier');
    console.error(err);
  }
}

// Suppression
async function deleteGalleryItem(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

  try {
    const res = await fetch(`${API_URL}/api/gallery/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Fichier supprimé avec succès !');
      loadGalleryItems();
    } else {
      const result = await res.json();
      alert('Erreur : ' + (result.error || 'Impossible de supprimer le fichier'));
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
}

// Initialisation
document.getElementById('galleryForm').addEventListener('submit', galleryFormSubmitHandler);
window.addEventListener('DOMContentLoaded', loadGalleryItems);
