

async function loadDashboardStats() {
  try {
    const res = await fetch(`${API_URL}/api/dashboard-stats`);
    if (!res.ok) throw new Error('Erreur réseau');
    const data = await res.json();

    document.getElementById('membersActive').textContent = data.membersActive.toLocaleString();
    document.getElementById('eventsOrganized').textContent = data.eventsOrganized.toLocaleString();
    document.getElementById('donationsFCFA').textContent = data.donationsFCFA.toLocaleString();
    document.getElementById('treesPlanted').textContent = data.treesPlanted.toLocaleString();
  } catch (err) {
    console.error('Erreur chargement stats:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadDashboardStats);
