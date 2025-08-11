(() => {

  const totalDonationsEl = document.getElementById('totalDonations');
  const donationsThisMonthEl = document.getElementById('donationsThisMonth');
  const donorsCountEl = document.getElementById('donorsCount');
  const averageDonationEl = document.getElementById('averageDonation');
  const donationsTableBody = document.querySelector('#donationsTableBody');
  const statusFilterEl = document.querySelector('#donationStatusFilter');
  const exportBtn = document.querySelector('#exportDonationsBtn');

  let donationsCache = [];
  let isLoading = false;

  // Formatage sécurisé de la date en français
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  }

  // Échapper du texte pour éviter XSS
  function escapeText(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[m]);
  }

  // Créer un élément span badge pour le statut
  function createStatusBadge(status) {
    const span = document.createElement('span');
    span.classList.add('status-badge');
    switch (status) {
      case 'completed':
        span.classList.add('status-active');
        span.textContent = 'Confirmé';
        break;
      case 'pending':
        span.classList.add('status-pending');
        span.textContent = 'En attente';
        break;
      case 'failed':
        span.classList.add('status-failed');
        span.textContent = 'Échoué';
        break;
      default:
        span.classList.add('status-secondary');
        span.textContent = status || '';
    }
    return span;
  }

  // Calcule statistiques à partir des donations filtrées
  function calculateStats(donations) {
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    const now = new Date();
    const monthDonations = donations.filter(d => {
      const created = new Date(d.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    });
    const totalThisMonth = monthDonations.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = new Set(
      donations.filter(d => !d.anonymous && d.donorEmail).map(d => d.donorEmail)
    );
    const avg = donations.length > 0 ? total / donations.length : 0;

    return {
      total,
      totalThisMonth,
      donorsCount: uniqueDonors.size,
      average: avg
    };
  }

  // Rend la liste des donations dans le tableau
  function renderDonations(donations) {
    donationsTableBody.innerHTML = '';
    if (donations.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 7;
      td.className = 'text-center text-muted';
      td.textContent = 'Aucune donation à afficher.';
      tr.appendChild(td);
      donationsTableBody.appendChild(tr);
      return;
    }

    donations.forEach(d => {
      const tr = document.createElement('tr');

      // Donateur
      const tdDonor = document.createElement('td');
      const donorName = d.anonymous ? 'Donation anonyme' : (d.donorName || '---');
      const donorEmail = d.anonymous ? '---' : (d.donorEmail || '');
      const divDonor = document.createElement('div');
      const donorNameEl = document.createElement('div');
      donorNameEl.className = 'fw-bold';
      donorNameEl.textContent = donorName;
      const donorEmailEl = document.createElement('small');
      donorEmailEl.className = 'text-muted';
      donorEmailEl.textContent = donorEmail;
      divDonor.appendChild(donorNameEl);
      divDonor.appendChild(donorEmailEl);
      tdDonor.appendChild(divDonor);
      tr.appendChild(tdDonor);

      // Montant
      const tdAmount = document.createElement('td');
      tdAmount.className = 'fw-bold text-success';
      tdAmount.textContent = `${d.amount.toLocaleString()} FCFA`;
      tr.appendChild(tdAmount);

      // Destination
      const tdPurpose = document.createElement('td');
      tdPurpose.textContent = d.donationPurpose || '';
      tr.appendChild(tdPurpose);

      // Mode de paiement
      const tdPayment = document.createElement('td');
      tdPayment.textContent = d.paymentMethod || '';
      tr.appendChild(tdPayment);

      // Date
      const tdDate = document.createElement('td');
      tdDate.textContent = formatDate(d.createdAt);
      tr.appendChild(tdDate);

      // Statut
      const tdStatus = document.createElement('td');
      const badge = createStatusBadge(d.status || 'pending');
      tdStatus.appendChild(badge);
      tr.appendChild(tdStatus);

      // Actions
      const tdActions = document.createElement('td');
      // Voir détails
      const btnDetails = document.createElement('button');
      btnDetails.className = 'btn btn-sm btn-outline-primary me-1';
      btnDetails.title = 'Voir détails';
      btnDetails.innerHTML = '<i class="fas fa-eye"></i>';
      btnDetails.onclick = () => alert(`Détails de la donation ID: ${d._id}`);
      tdActions.appendChild(btnDetails);

      // Envoyer reçu (désactivé si anonyme ou status non confirmé)
      const btnReceipt = document.createElement('button');
      btnReceipt.className = 'btn btn-sm btn-outline-success';
      btnReceipt.title = 'Envoyer reçu';
      btnReceipt.innerHTML = '<i class="fas fa-receipt"></i>';
      btnReceipt.disabled = d.anonymous || d.status !== 'completed';
      btnReceipt.onclick = () => {
        if (btnReceipt.disabled) return;
        alert(`Envoi du reçu pour donation ID: ${d._id} (fonction à implémenter)`);
      };
      tdActions.appendChild(btnReceipt);

      tr.appendChild(tdActions);

      donationsTableBody.appendChild(tr);
    });
  }

  // Charge les donations depuis le backend et met à jour la vue
  async function loadDonations() {
    if (isLoading) return;
    isLoading = true;

    try {
      const res = await fetch(`${API_URL}/api/donations`);
      if (!res.ok) throw new Error(`Erreur réseau: ${res.status}`);

      const donations = await res.json();
      donationsCache = donations;

      // Filtrer par statut sélectionné
      const filterStatus = statusFilterEl.value;
      const filtered = filterStatus
        ? donations.filter(d => d.status === filterStatus)
        : donations;

      // Calcul et affichage stats
      const stats = calculateStats(filtered);
      totalDonationsEl.textContent = stats.total.toLocaleString();
      donationsThisMonthEl.textContent = stats.totalThisMonth.toLocaleString();
      donorsCountEl.textContent = stats.donorsCount.toLocaleString();
      averageDonationEl.textContent = stats.average.toFixed(0).toLocaleString();

      // Affichage tableau
      renderDonations(filtered);
    } catch (err) {
      alert(`Erreur lors du chargement des donations : ${err.message}`);
      console.error(err);
    } finally {
      isLoading = false;
    }
  }

  // Export CSV basique
  function exportCSV() {
    if (!donationsCache.length) {
      alert('Aucune donation à exporter.');
      return;
    }
    const headers = ['Donateur', 'Email', 'Montant FCFA', 'Destination', 'Paiement', 'Date', 'Statut'];
    const rows = donationsCache.map(d => [
      d.anonymous ? 'Donation anonyme' : d.donorName || '',
      d.anonymous ? '' : d.donorEmail || '',
      d.amount,
      d.donationPurpose,
      d.paymentMethod,
      formatDate(d.createdAt),
      d.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(";") + "\r\n";
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(";") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `donations_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Événements
  statusFilterEl.addEventListener('change', loadDonations);
  exportBtn.addEventListener('click', exportCSV);

  // Initial load
  document.addEventListener('DOMContentLoaded', loadDonations);
})();
