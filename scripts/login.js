import API_URL from './config.js';

let token = null;

// ✅ exposer la fonction login au global
window.login = async function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            token = data.token;
            loadAdminContent();
        } else {
            alert('Login échoué');
        }
    } catch (err) {
        console.error('Erreur réseau :', err);
        alert('Impossible de se connecter au serveur');
    }
};

// ✅ exposer aussi loadAdminContent si tu veux la réutiliser ailleurs
window.loadAdminContent = async function () {
    try {
        const res = await fetch(`${API_URL}/api/admin-data`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.ok) {
            const data = await res.json();
            document.getElementById('loginDiv').style.display = 'none';
            document.getElementById('adminDiv').style.display = 'block';
            document.getElementById('adminContent').innerText = JSON.stringify(data, null, 2);
        } else {
            alert('Accès refusé');
        }
    } catch (err) {
        console.error('Erreur réseau :', err);
        alert('Impossible de charger les données admin');
    }
};
