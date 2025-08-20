import BASE_URL from './config.js';

let token = null;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Utilisation correcte de BASE_URL avec backticks
    const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        const data = await res.json();
        token = data.token;
        loadAdminContent();
    } else {
        alert('Login échoué');
    }
}

async function loadAdminContent() {
    // Utilisation de BASE_URL pour toutes les requêtes
    const res = await fetch(`${BASE_URL}/api/admin-data`, {
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
}
