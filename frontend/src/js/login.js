// Local: frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const googleBtn = document.querySelector('.registro_google');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value.trim();

            if (!email || !senha) {
                alert("Preencha todos os campos.");
                return;
            }

            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, senha);
                const user = userCredential.user;
                const token = await user.getIdToken();
                localStorage.setItem('userToken', token);
                localStorage.setItem('userId', user.uid);
                alert("Login bem-sucedido!");
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Erro no login:", error);
                alert("Credenciais inválidas. Verifique seu email e senha.");
            }
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const result = await auth.signInWithPopup(provider);
                const user = result.user;

                // Guardar usuario em Firestore se não existe
                const docRef = db.collection('usuarios').doc(user.uid);
                const doc = await docRef.get();
                if (!doc.exists) {
                    await docRef.set({
                        nome: user.displayName || "Usuário Google",
                        email: user.email,
                        foto: user.photoURL || "",
                        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                const token = await user.getIdToken();
                localStorage.setItem('userToken', token);
                localStorage.setItem('userId', user.uid);

                alert("Login com Google bem-sucedido!");
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Erro ao logar com Google:", error);
                alert("Erro ao logar com Google: " + error.message);
            }
        });
    }
});
