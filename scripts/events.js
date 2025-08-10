// events.js

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

// Fonction pour afficher la liste des événements dans le tableau
async function loadEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events`);
    if (!res.ok) throw new Error('Erreur chargement événements');
    const events = await res.json();

    const tbody = document.querySelector('#eventsTable tbody');
    tbody.innerHTML = ''; // vide la table

    events.forEach(event => {
      const tr = document.createElement('tr');

      // Statut avec classe CSS selon statut
      let statusClass = '';
      switch (event.status) {
        case 'upcoming': statusClass = 'status-pending'; break;
        case 'ongoing': statusClass = 'status-active'; break;
        case 'completed': statusClass = 'status-completed'; break;
        default: statusClass = '';
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
      // Création
      res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        body: formData,
      });
    } else {
      // Mise à jour
      res = await fetch(`${API_URL}/api/events/${currentEditId}`, {
        method: 'PUT',
        body: formData,
      });
    }

    const result = await res.json();

    if (res.ok) {
      alert(currentEditId ? 'Événement mis à jour avec succès !' : 'Événement créé avec succès !');
      form.reset();
      currentEditId = null;
      // Remettre le bouton à son texte initial
      document.querySelector('#eventForm button[type="submit"]').textContent = "Créer l'événement";
      loadEvents(); // recharge la liste des événements
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
    const res = await fetch(`${API_URL}/api/events/${id}`, {
      method: 'DELETE',
    });
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

// Edition d’un événement - préremplit le formulaire avec les données existantes
async function editEvent(id) {
  try {
    const res = await fetch(`${API_URL}/api/events/${id}`);
    if (!res.ok) throw new Error('Erreur lors de la récupération de l\'événement');
    const event = await res.json();

    const form = document.getElementById('eventForm');
    form.title.value = event.title || '';
    form.date.value = event.date ? event.date.substring(0, 10) : ''; // format yyyy-mm-dd
    form.location.value = event.location || '';
    form.description.value = event.description || '';
    form.status.value = event.status || 'upcoming';

    // Note: Impossible de préremplir le champ fichier (image) pour raisons de sécurité.

    // Activer le mode édition
    currentEditId = id;
    document.querySelector('#eventForm button[type="submit"]').textContent = "Mettre à jour l'événement";

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

// Chargement initial des événements au chargement de la page
window.addEventListener('DOMContentLoaded', loadEvents);
