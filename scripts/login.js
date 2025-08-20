// scripts/login.js

let token = null;

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/api/login`, { // API_URL est défini dans config.js
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Login échoué");
        return res.json();
    })
    .then(data => {
        token = data.token;
        loadAdminContent();
    })
    .catch(err => alert(err.message));
}

function loadAdminContent() {
    fetch(`${API_URL}/api/admin-data`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => {
        if (!res.ok) throw new Error("Accès refusé");
        return res.json();
    })
    .then(data => {
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('adminDiv').style.display = 'block';
        document.getElementById('adminContent').innerText = JSON.stringify(data, null, 2);
    })
    .catch(err => alert(err.message));
}
