// Local: frontend/src/js/login.js
import { auth, db } from "./config.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const googleBtn = document.getElementById("googleLogin");

  // 🔹 Login com email e senha
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();

      if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        const token = await user.getIdToken();

        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", user.uid);

        alert("Login bem-sucedido!");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Erro no login:", error);
        alert("Credenciais inválidas. Verifique seu email e senha.");
      }
    });
  }

  // 🔹 Login com Google
  if (googleBtn) {
    googleBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Verifica se o usuário já existe no Firestore
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            nome: user.displayName || "Usuário Google",
            email: user.email,
            foto: user.photoURL || "",
            criadoEm: serverTimestamp()
          });
        }

        const token = await user.getIdToken();
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", user.uid);

        alert("Login com Google bem-sucedido!");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Erro ao logar com Google:", error);
        alert("Erro ao logar com Google: " + error.message);
      }
    });
  }
});
