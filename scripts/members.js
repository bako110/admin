// Formatage date jj/mm/aaaa
function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('fr-FR');
}

// Initiales d’un nom complet
function getInitials(fullName) {
  return fullName.split(' ').map(n => n[0].toUpperCase()).join('').slice(0, 2);
}

// Classe badge selon membershipPlan (en anglais)
function getBadgeClass(membershipPlan) {
  switch (membershipPlan?.toLowerCase()) {
    case 'active': return 'bg-primary';
    case 'bienfaiteur': return 'bg-warning';
    case 'sympathisant': return 'bg-light text-dark';
    default: return 'bg-secondary';
  }
}

// Classe statut membre (en anglais)
function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case 'active': return 'status-active';
    case 'pending': return 'status-pending';
    case 'inactive': return 'status-inactive';
    default: return 'status-secondary';
  }
}

// Traduction pour affichage en français
function translateStatus(status) {
  switch (status?.toLowerCase()) {
    case 'active': return 'Actif';
    case 'pending': return 'En attente';
    case 'inactive': return 'Inactif';
    default: return status || '';
  }
}

function translateMembershipPlan(plan) {
  switch (plan?.toLowerCase()) {
    case 'active': return 'Actif';
    case 'bienfaiteur': return 'Bienfaiteur';
    case 'sympathisant': return 'Sympathisant';
    default: return plan || '';
  }
}

// Chargement + affichage liste et stats membres
async function loadMembers() {
  try {
    const res = await fetch(`${API_URL}/api/members`);
    if (!res.ok) throw new Error('Erreur réseau');

    const members = await res.json();

    // Calcul stats
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status?.toLowerCase() === 'active').length;
    const pendingMembers = members.filter(m => m.status?.toLowerCase() === 'pending').length;
    const newThisMonth = members.filter(m => {
      const created = new Date(m.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    // Mise à jour stats dans le DOM
    document.querySelector('.stat-card .bg-primary + h4').textContent = totalMembers.toLocaleString();
    document.querySelector('.stat-card .bg-success + h4').textContent = activeMembers.toLocaleString();
    document.querySelector('.stat-card .bg-warning + h4').textContent = pendingMembers.toLocaleString();
    document.querySelector('.stat-card .bg-info + h4').textContent = newThisMonth.toLocaleString();

    // Génération des lignes tableau
    const tbody = document.getElementById('membersTableBody'); // sélection par id
    tbody.innerHTML = '';

    members.forEach(member => {
      const initials = getInitials(member.fullName);
      const badgeClass = getBadgeClass(member.membershipPlan || '');
      const statusClass = getStatusClass(member.status || '');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <div class="avatar ${badgeClass} text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 35px; height: 35px; font-size: 14px;">
              ${initials}
            </div>
            <div>
              <div class="fw-bold">${member.fullName}</div>
              <small class="text-muted">${member.city || ''}</small>
            </div>
          </div>
        </td>
        <td>${member.email}</td>
        <td>${member.phone}</td>
        <td><span class="badge ${badgeClass}">${translateMembershipPlan(member.membershipPlan)}</span></td>
        <td>${formatDate(member.createdAt)}</td>
        <td><span class="status-badge ${statusClass}">${translateStatus(member.status)}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" title="Voir détails" onclick="viewMemberDetails('${member._id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-warning me-1" title="Modifier" onclick="editMember('${member._id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" title="Supprimer" onclick="deleteMember('${member._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error('Erreur chargement membres:', err);
    alert('Erreur lors du chargement des membres.');
  }
}

// Voir détails membre (placeholder)
function viewMemberDetails(id) {
  alert(`Voir détails du membre ID : ${id}`);
  // Implémenter modal ou redirection vers page détail
}

// Modifier membre : prompt pour changer le statut + update au backend
async function editMember(id) {
  try {
    // Récupérer le membre actuel
    const res = await fetch(`${API_URL}/api/members/${id}`);
    if (!res.ok) throw new Error('Erreur récupération membre');
    const member = await res.json();

    // Demander le nouveau statut
    const newStatus = prompt(
      `Modifier le statut du membre "${member.fullName}".\nStatuts possibles : active, pending, inactive`,
      member.status || ''
    );

    if (!newStatus) return; // annuler si vide

    // Valider statut
    const validStatuses = ['active', 'pending', 'inactive'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      alert('Statut invalide. Opération annulée.');
      return;
    }

    // Envoyer mise à jour au backend
    const updateRes = await fetch(`${API_URL}/api/members/${id}`, {
      method: 'PUT', // ou PATCH selon API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus.toLowerCase() })
    });

    if (!updateRes.ok) throw new Error('Erreur mise à jour membre');

    alert('Membre mis à jour avec succès');
    loadMembers(); // recharger liste

  } catch (err) {
    console.error(err);
    alert('Erreur lors de la modification du membre.');
  }
}

// Supprimer membre avec confirmation
async function deleteMember(id) {
  if (!confirm('Voulez-vous vraiment supprimer ce membre ?')) return;

  try {
    const res = await fetch(`${API_URL}/api/members/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur suppression');

    alert('Membre supprimé avec succès');
    loadMembers();
  } catch (err) {
    console.error(err);
    alert('Erreur lors de la suppression du membre.');
  }
}

window.addEventListener('DOMContentLoaded', loadMembers);
