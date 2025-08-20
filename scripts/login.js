let token = null;

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/api/login`, {
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
        // Masquer le formulaire de login
        document.getElementById('loginDiv').style.display = 'none';
        // Afficher la div admin
        document.getElementById('adminDiv').style.display = 'block';
        // Afficher le message avec le username
        document.getElementById('adminContent').innerText = `Vous êtes connecté en tant que : ${data.user.username}`;
    })
    .catch(err => alert(err.message));
}
