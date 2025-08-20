// Fonction pour prévisualiser le logo sélectionné ou existant
function previewPartnerLogo(input) {
  const preview = document.getElementById('partnerLogoPreview');
  preview.innerHTML = '';

  // Si un nouveau fichier est sélectionné
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result; // prévisualisation locale
      img.style.maxWidth = '300px';
      img.style.maxHeight = '200px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Charger et afficher les partenaires
async function loadPartners() {
  try {
    const res = await fetch(`${API_URL}/api/partners`);
    if (!res.ok) throw new Error('Erreur lors du chargement des partenaires');
    const partners = await res.json();

    const partnersList = document.getElementById('partnersList');
    partnersList.innerHTML = '';

    const maxPartnersToShow = 4;
    for (let i = 0; i < maxPartnersToShow; i++) {
      const partner = partners[i];
      const col = document.createElement('div');
      col.className = 'col-6 mb-3';

      const partnerItem = document.createElement('div');
      partnerItem.className = 'partner-item bg-light p-3 rounded text-center position-relative';

      if (partner) {
        const logoUrl = partner.logoUrl || '';
        partnerItem.innerHTML = `
          <img src="${logoUrl}" class="img-fluid mb-2" alt="${partner.name}">
          <h6 class="small fw-bold">${partner.name}</h6>
          <small class="text-muted">${capitalize(partner.type)}</small>
          <div class="position-absolute top-0 end-0 m-2">
            <button class="btn btn-sm btn-outline-warning me-1" onclick="editPartner('${partner._id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deletePartner('${partner._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
      } else {
        partnerItem.innerHTML = `
          <img src="" class="img-fluid mb-2" alt="">
          <h6 class="small fw-bold">&nbsp;</h6>
          <small class="text-muted">&nbsp;</small>
          <div class="position-absolute top-0 end-0 m-2"></div>
        `;
      }

      col.appendChild(partnerItem);
      partnersList.appendChild(col);
    }

  } catch (err) {
    console.error(err);
    alert('Erreur lors du chargement des partenaires');
  }
}

// Capitaliser la première lettre
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Réinitialiser le formulaire
function resetForm() {
  const form = document.getElementById('partnerForm');
  form.reset();
  document.getElementById('partnerLogoPreview').innerHTML = '';
  form.onsubmit = submitNewPartner;
}

// Ajouter un partenaire
async function submitNewPartner(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const res = await fetch(`${API_URL}/api/partners`, {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();
    if (res.ok) {
      alert('Partenaire ajouté avec succès');
      resetForm();
      loadPartners();
    } else {
      alert(result.error || 'Erreur lors de l\'ajout');
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
}

// Éditer un partenaire
async function editPartner(id) {
  try {
    const res = await fetch(`${API_URL}/api/partners/${id}`);
    if (!res.ok) throw new Error('Erreur chargement partenaire');
    const partner = await res.json();

    const form = document.getElementById('partnerForm');
    form.name.value = partner.name || '';
    form.type.value = partner.type || '';
    form.website.value = partner.website || '';
    form.description.value = partner.description || '';

    // Prévisualisation du logo existant
    const preview = document.getElementById('partnerLogoPreview');
    preview.innerHTML = '';
    if (partner.logoUrl) {
      const img = document.createElement('img');
      img.src = partner.logoUrl;
      img.style.maxWidth = '300px';
      img.style.maxHeight = '200px';
      preview.appendChild(img);
    }

    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const updateRes = await fetch(`${API_URL}/api/partners/${id}`, {
          method: 'PUT',
          body: formData,
        });
        const result = await updateRes.json();
        if (updateRes.ok) {
          alert('Partenaire mis à jour avec succès');
          resetForm();
          loadPartners();
        } else {
          alert(result.error || 'Erreur lors de la mise à jour');
        }
      } catch (err) {
        alert('Erreur réseau ou serveur');
        console.error(err);
      }
    };

  } catch (err) {
    alert('Erreur chargement partenaire');
    console.error(err);
  }
}

// Supprimer un partenaire
async function deletePartner(id) {
  if (!confirm('Confirmez-vous la suppression de ce partenaire ?')) return;

  try {
    const res = await fetch(`${API_URL}/api/partners/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Partenaire supprimé');
      loadPartners();
    } else {
      const result = await res.json();
      alert(result.error || 'Erreur lors de la suppression');
    }
  } catch (err) {
    alert('Erreur réseau ou serveur');
    console.error(err);
  }
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('partnerForm');
  form.onsubmit = submitNewPartner;

  // Assure que l'input a bien l'ID "partnerLogo"
  const logoInput = document.getElementById('partnerLogo');
  if (logoInput) {
    logoInput.addEventListener('change', function() {
      previewPartnerLogo(this);
    });
  }

  loadPartners();
});
