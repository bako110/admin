// Variable globale pour suivre l'édition en cours
let currentEditId = null;

// Fonction pour formater la date en jj/mm/aaaa
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Aperçu de l'image/vidéo sélectionnée
function previewEventMedia(input) {
  const preview = document.getElementById('eventMediaPreview');
  preview.innerHTML = '';
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
      } else if (fileType.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = e.target.result;
        video.controls = true;
        video.style.maxWidth = '300px';
        video.style.maxHeight = '200px';
        preview.appendChild(video);
      }
    };

    reader.readAsDataURL(file);
  }
}

// Détecte si l'URL est une vidéo
function isVideo(url) {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// Affiche la liste des événements
async function loadEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events`);
    if (!res.ok) throw new Error('Erreur chargement événements');
    const events = await res.json();

    const tbody = document.querySelector('#eventsTable tbody');
    tbody.innerHTML = '';

    events.forEach(event => {
      const tr = document.createElement('tr');

      let statusClass = '';
      switch (event.status) {
        case 'planned': statusClass = 'status-pending'; break;
        case 'ongoing': statusClass = 'status-active'; break;
        case 'completed': statusClass = 'status-completed'; break;
      }

      tr.innerHTML = `
        <td>${event.title}</td>
        <td>${formatDate(event.date)}</td>
        <td><span class="status-badge ${statusClass}">${event.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editEvent('${event._id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent('${event._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert('Erreur lors du chargement des événements.');
  }
}

// Soumission du formulaire
document.getElementById('eventForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  try {
    let res;
    if (!currentEditId) {
      res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        body: formData,
      });
    } else {
      res = await fetch(`${API_URL}/api/events/${currentEditId}`, {
        method: 'PUT',
        body: formData,
      });
    }

    const result = await res.json();

    if (res.ok) {
      alert(currentEditId ? 'Événement mis à jour avec succès !' : 'Événement créé avec succès !');
      form.reset();
      document.getElementById('eventMediaPreview').innerHTML = '';
      currentEditId = null;
      document.querySelector('#eventForm button[type="submit"]').textContent = "Créer l'événement";
      loadEvents();
    } else {
      alert('Erreur : ' + (result.error || 'Impossible de traiter l\'événement'));
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
});

// Suppression d'un événement
async function deleteEvent(id) {
  if (!confirm('Confirmer la suppression de cet événement ?')) return;
  try {
    const res = await fetch(`${API_URL}/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Événement supprimé');
      loadEvents();
    } else {
      alert('Erreur lors de la suppression');
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
}

// Édition d’un événement avec prévisualisation média Cloudinary
async function editEvent(id) {
  try {
    const res = await fetch(`${API_URL}/api/events/${id}`);
    if (!res.ok) throw new Error('Erreur lors de la récupération de l\'événement');
    const event = await res.json();

    const form = document.getElementById('eventForm');
    form.title.value = event.title || '';
    form.date.value = event.date ? event.date.substring(0, 10) : '';
    form.location.value = event.location || '';
    form.description.value = event.description || '';
    form.status.value = event.status || 'upcoming';

    // Prévisualisation média existant
    const preview = document.getElementById('eventMediaPreview');
    preview.innerHTML = '';
    if (event.image) {
      if (isVideo(event.image)) {
        const video = document.createElement('video');
        video.src = event.image;
        video.controls = true;
        video.style.maxWidth = '300px';
        video.style.maxHeight = '200px';
        preview.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = event.image;
        img.style.maxWidth = '300px';
        img.style.maxHeight = '200px';
        preview.appendChild(img);
      }
    }

    currentEditId = id;
    document.querySelector('#eventForm button[type="submit"]').textContent = "Mettre à jour l'événement";

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

// Prévisualisation live du fichier sélectionné
document.getElementById('eventImage').addEventListener('change', function() {
  previewEventMedia(this);
});

// Chargement initial
window.addEventListener('DOMContentLoaded', loadEvents);
