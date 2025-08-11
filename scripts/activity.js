document.addEventListener('DOMContentLoaded', () => {
  const activitiesTbody = document.getElementById('activitiesTbody');

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0)
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1)
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    return `${diffDays} jours`;
  }

  function statusClassName(status) {
    return `status-badge status-${status.replace(/\s+/g, '-').toLowerCase()}`;
  }

  async function loadActivities(page = 1, limit = 10) {
    try {
      const res = await fetch(`${API_URL}/api/activities?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des activités');

      const json = await res.json();
      const activities = json.data;

      activitiesTbody.innerHTML = '';

      if (!activities || activities.length === 0) {
        activitiesTbody.innerHTML = `<tr><td colspan="4" class="text-center">Aucune activité récente</td></tr>`;
        return;
      }

      activities.forEach(act => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${act.activity}</td>
          <td>${act.type}</td>
          <td>${formatDate(act.date)}</td>
          <td><span class="${statusClassName(act.status)}">${act.status.charAt(0).toUpperCase() + act.status.slice(1)}</span></td>
        `;
        activitiesTbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      activitiesTbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Erreur lors du chargement des activités</td></tr>`;
    }
  }

  async function seedActivities() {
    const activities = [
      {
        activity: "Nouvel adhésion membre",
        type: "Membres",
        status: "actif",
        date: new Date().toISOString(),
        metadata: {}
      },
      {
        activity: "Festival Culturel 2025",
        type: "Événement",
        status: "en cours",
        date: new Date(Date.now() - 86400000).toISOString(),
        metadata: {}
      },
      {
        activity: "Donation reçue",
        type: "Finance",
        status: "confirmé",
        date: new Date(Date.now() - 3600000 * 20).toISOString(),
        metadata: {}
      },
      {
        activity: "Mise à jour galerie",
        type: "Contenu",
        status: "publié",
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        metadata: {}
      }
    ];

    for (const act of activities) {
      try {
        const res = await fetch(`${API_URL}/api/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(act),
        });
        if (!res.ok) {
          const err = await res.json();
          console.error('Erreur seed activity:', err);
        } else {
          console.log('Activité créée:', act.activity);
        }
      } catch (error) {
        console.error('Erreur fetch seed:', error);
      }
    }
  }

  // Appel séquentiel : d'abord seed, puis load
  seedActivities().then(() => loadActivities());
});
