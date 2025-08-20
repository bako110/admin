// scripts/settings.js

// Fonction helper pour envoyer des données en POST/PUT
async function sendData(url, method, data, isFormData = false) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: isFormData ? {} : { "Content-Type": "application/json" },
            body: isFormData ? data : JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de l’envoi");
        }

        alert("✅ Succès : " + (result.message || "Opération réussie !"));
    } catch (error) {
        console.error(error);
        alert("❌ Erreur : " + error.message);
    }
}

// ----------------- FORMULAIRES -----------------

// Formulaire paramètres généraux
document.getElementById("settingsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    sendData(`${API_URL}/api/settings`, "PUT", formData);
});

// Formulaire changement de mot de passe
document.getElementById("securityForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());

    if (formData.newPassword !== formData.confirmPassword) {
        return alert("⚠️ Les mots de passe ne correspondent pas !");
    }

    sendData(`${API_URL}/api/settings/password`, "PUT", formData);
});

// Formulaire ajout administrateur
document.getElementById("addAdminForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    sendData(`${API_URL}/api/admins`, "POST", formData);
});

// Formulaire logo
document.getElementById("logoForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this); // Ici il faut FormData pour gérer le fichier
    sendData(`${API_URL}/api/settings/logo`, "POST", formData, true);
});
