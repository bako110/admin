const newsForm = document.getElementById('newsForm');
const newsList = document.getElementById('newsList');
const btnDraft = document.getElementById('btnDraft');
const featuredCheckbox = newsForm.featured;
const newsIdInput = document.getElementById('newsId');

let saveAsDraft = false; // flag pour savoir si c'est brouillon ou publié

// Charger les actualités depuis le backend
async function loadNews() {
    try {
        const res = await fetch(`${API_URL}/api/news`);
        if (!res.ok) throw new Error('Erreur de chargement des actualités');
        const news = await res.json();

        newsList.innerHTML = "";

        if (news.length === 0) {
            newsList.innerHTML = `<p class="text-muted small">Aucune actualité publiée pour le moment.</p>`;
            return;
        }

        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h6>${item.title}</h6>
                <div class="news-meta">
                    <i class="fas fa-calendar me-1"></i>${new Date(item.date).toLocaleDateString('fr-FR')}
                    <span class="ms-2 status-badge ${item.featured ? 'status-active' : 'status-pending'}">
                        ${item.featured ? 'Publié' : 'Brouillon'}
                    </span>
                </div>
                <p class="small">${item.summary}</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editNews('${item._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteNews('${item._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            newsList.appendChild(newsItem);
        });
    } catch (err) {
        console.error(err);
    }
}

// Gestion du bouton Brouillon
btnDraft.addEventListener('click', () => {
    saveAsDraft = true;
    // Décoche la case "featured" car brouillon = pas mis en avant
    featuredCheckbox.checked = false;
    newsForm.dispatchEvent(new Event('submit'));
});

// Soumission du formulaire (création ou édition)
newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Si brouillon, on force featured à false, sinon on prend la valeur de la checkbox
    if (saveAsDraft) {
        featuredCheckbox.checked = false;
    }

    const formData = new FormData(newsForm);
    const id = newsIdInput.value;

    // Pour forcer la valeur 'featured' car checkbox absente si non cochée dans FormData,
    // on ajoute explicitement la valeur dans FormData.
    if (featuredCheckbox.checked) {
        formData.set('featured', 'true');
    } else {
        formData.set('featured', 'false');
    }

    const url = id ? `${API_URL}/api/news/${id}` : `${API_URL}/api/news`;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            body: formData
        });
        if (!res.ok) throw new Error(id ? 'Erreur lors de la mise à jour' : 'Erreur lors de l’ajout');

        newsForm.reset();
        newsIdInput.value = '';  // reset de l'id après modification
        saveAsDraft = false;     // reset flag
        loadNews();
    } catch (err) {
        console.error(err);
    }
});

// Supprimer une actualité
async function deleteNews(id) {
    if (!confirm('Supprimer cette actualité ?')) return;
    try {
        const res = await fetch(`${API_URL}/api/news/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur suppression');
        loadNews();
    } catch (err) {
        console.error(err);
    }
}

// Éditer une actualité
async function editNews(id) {
    try {
        const res = await fetch(`${API_URL}/api/news/${id}`);
        if (!res.ok) throw new Error('Erreur chargement');
        const item = await res.json();

        newsForm.title.value = item.title;
        newsForm.date.value = item.date.split('T')[0];
        newsForm.category.value = item.category;
        newsForm.summary.value = item.summary;
        newsForm.content.value = item.content;
        newsForm.featured.checked = item.featured || false;
        newsIdInput.value = item._id;  // met à jour le champ caché
    } catch (err) {
        console.error(err);
    }
}

// Charger les actualités au démarrage
window.addEventListener('DOMContentLoaded', loadNews);
