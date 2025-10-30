const firebaseConfig = {
  apiKey: "AIzaSyAcrMfjl3ft64AfB7JfS4OcgpML_aiRucs",
  authDomain: "ecotrek-802a6.firebaseapp.com",
  projectId: "ecotrek-802a6",
  storageBucket: "ecotrek-802a6.firebasestorage.app",
  messagingSenderId: "953729913204",
  appId: "1:953729913204:web:aabf335f16a2a93d7e5c21",
  measurementId: "G-WRNHJ89LE1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const form = document.querySelector(".caixa_cadastro");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    const termo = document.getElementById("termo").checked;

    if (!termo) {
        alert("Você deve aceitar os termos de uso.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    try {
        const snapshot = await db.collection("usuarios").where("email", "==", email).get();
        if (!snapshot.empty) {
            alert("Este email já está registrado!");
            return;
        }

        await db.collection("usuarios").add({
            nome: nome,
            email: email,
            senha: senha
        });

        alert("Usuário registrado com sucesso!");
        form.reset();
    } catch (error) {
        alert("Erro ao registrar usuário: " + error.message);
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.querySelector(".registro_google");
  const provider = new firebase.auth.GoogleAuthProvider();

  googleBtn.addEventListener("click", async () => {
    googleBtn.disabled = true; 
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      const docRef = db.collection("usuarios").doc(user.uid);
      const doc = await docRef.get();

      if (!doc.exists) {
        await docRef.set({
          nome: user.displayName,
          email: user.email,
          foto: user.photoURL
        });
        alert("Registro con Google exitoso!");
      } else {
        alert("Inicio de sesión con Google exitoso!");
      }

    } catch (error) {
      console.error("Error en Google login:", error);
      alert("Error al iniciar sesión con Google: " + error.message);
    } finally {
      googleBtn.disabled = false; 
    }
  });
});