// registro.js
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    const googleBtn = document.getElementById("googleRegister");
    if (googleBtn) {
        googleBtn.addEventListener("click", handleGoogleRegister);
    }
});

// Função principal para registro com email e senha
async function handleRegister(event) {
    event.preventDefault();

    // Limpar mensagens de erro e sucesso
    ["nome", "email", "senha", "confirmar-senha", "termo"].forEach(id => {
        const el = document.getElementById(`${id}-error`);
        if (el) el.textContent = "";
    });
    const successDiv = document.getElementById("success-msg");
    if (successDiv) successDiv.remove();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document.getElementById("confirmar-senha").value.trim();
    const termo = document.getElementById("termo").checked;

    let hasError = false;

    if (!nome) {
        showError("nome", "Informe seu nome.");
        hasError = true;
    }
    if (!email) {
        showError("email", "Informe seu e-mail.");
        hasError = true;
    }
    if (!senha) {
        showError("senha", "Informe sua senha.");
        hasError = true;
    }
    if (senha !== confirmarSenha) {
        showError("confirmar-senha", "As senhas não coincidem.");
        hasError = true;
    }
    if (!termo) {
        showError("termo", "Você deve aceitar os termos de uso.");
        hasError = true;
    }

    if (hasError) return;

    try {
        // Registrar no Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
        const user = userCredential.user;

        // Guardar datos no Firestore
        await firebase.firestore().collection("usuarios").doc(user.uid).set({
            nome: nome,
            email: email,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });

        showSuccess("Usuário registrado com sucesso! Redirecionando...");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            showError("email", "Este e-mail já está cadastrado.");
        } else if (error.code === "auth/weak-password") {
            showError("senha", "Senha muito fraca, mínimo 6 caracteres.");
        } else if (error.code === "auth/invalid-email") {
            showError("email", "Email inválido.");
        } else {
            console.error("Erro ao registrar usuário:", error);
        }
    }
}

// mostrar erro embaixo dos inputs
function showError(inputId, message) {
    const errorDiv = document.getElementById(`${inputId}-error`);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.color = "red";
    }
}

//  mostrar mensagen de sucesso
function showSuccess(message) {
    let successDiv = document.getElementById("success-msg");
    if (!successDiv) {
        successDiv = document.createElement("div");
        successDiv.id = "success-msg";
        successDiv.style.color = "green";
        successDiv.style.marginTop = "10px";
        const form = document.getElementById("register-form");
        form.insertAdjacentElement("beforeend", successDiv);
    }
    successDiv.textContent = message;
}

// registro com Google
async function handleGoogleRegister(event) {
    event.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;

        const docRef = firebase.firestore().collection("usuarios").doc(user.uid);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            await docRef.set({
                nome: user.displayName || "Usuário Google",
                email: user.email,
                foto: user.photoURL || "",
                criadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        const token = await user.getIdToken();
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", user.uid);

        showSuccess("Login com Google bem-sucedido! Redirecionando...");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);

    } catch (error) {
        console.error("Erro ao logar com Google:", error);
        showError("email", "Erro ao logar com Google. Tente novamente.");
    }
}
