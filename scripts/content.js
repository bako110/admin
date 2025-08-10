

// Fonction pour charger les données du backend et remplir les formulaires
async function loadContent() {
  try {
    const res = await fetch(`${API_URL}/api/content`);
    if (!res.ok) throw new Error('Erreur chargement contenu');
    const content = await res.json();

    // Remplir À propos
    document.getElementById('aboutTitle').value = content.about?.title || '';
    document.getElementById('aboutSubtitle').value = content.about?.subtitle || '';
    document.getElementById('aboutDescription').value = content.about?.description || '';

    // Remplir Statistiques
    document.getElementById('statsActiveMembers').value = content.stats?.activeMembers || 0;
    document.getElementById('statsProjectsDone').value = content.stats?.projectsDone || 0;
    document.getElementById('statsTreesPlanted').value = content.stats?.treesPlanted || 0;
    document.getElementById('statsVillagesTouched').value = content.stats?.villagesTouched || 0;
  } catch (err) {
    alert('Erreur lors du chargement du contenu : ' + err.message);
  }
}

// Gestion formulaire À propos
document.getElementById('aboutForm').addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    title: document.getElementById('aboutTitle').value.trim(),
    subtitle: document.getElementById('aboutSubtitle').value.trim(),
    description: document.getElementById('aboutDescription').value.trim(),
  };

  try {
    const res = await fetch(`${API_URL}/api/content/about`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert(result.message || 'Section À propos mise à jour');
  } catch (err) {
    alert('Erreur lors de la mise à jour : ' + err.message);
  }
});

// Gestion formulaire Statistiques
document.getElementById('statsForm').addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    activeMembers: Number(document.getElementById('statsActiveMembers').value),
    projectsDone: Number(document.getElementById('statsProjectsDone').value),
    treesPlanted: Number(document.getElementById('statsTreesPlanted').value),
    villagesTouched: Number(document.getElementById('statsVillagesTouched').value),
  };

  try {
    const res = await fetch(`${API_URL}/api/content/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert(result.message || 'Statistiques mises à jour');
  } catch (err) {
    alert('Erreur lors de la mise à jour : ' + err.message);
  }
});

// Charger les données au chargement de la page
window.addEventListener('DOMContentLoaded', loadContent);
