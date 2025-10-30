// Local: frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, senha);
        const user = userCredential.user;

        // A. Obtém o Token de ID (JWT)
        const token = await user.getIdToken();

        // B. Guarda o Token e o UID para uso em outras páginas
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', user.uid);

        alert("Login bem-sucedido!");
        window.location.href = 'index.html'; // Redireciona para a página principal

    } catch (error) {
        alert("Erro no Login: Credenciais inválidas.");
        console.error(error);
    }
}