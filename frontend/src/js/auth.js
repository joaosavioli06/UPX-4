// ===============================
// EcoTrek - Controle de Sessão
// ===============================

import { auth, db, signOut } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// ===============================
// Elementos da interface
// ===============================
const loginBtn = document.querySelector(".botao_login");
const cadastroBtn = document.querySelector(".botao_cadastro");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.querySelector(".botao_sair");


if (userInfo && logoutBtn) {
  onAuthStateChanged(auth, async (user) => {
    const userNome = userInfo.querySelector(".user-nome");
    const userImg = userInfo.querySelector(".icone_perfil");

    if (user) {
      // 🔹 Buscar nome no Firestore se não houver displayName
      let nome = user.displayName;
      if (!nome) {
        try {
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            nome = userSnap.data().nome || user.email;
          } else {
            nome = user.email;
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário:", error);
          nome = user.email;
        }
      }

      const foto = user.photoURL;

      if (userNome) userNome.textContent = `Bem-vindo, ${nome}`;
      if (userImg) {
        userImg.src = foto ? foto : "./src/img/Icone-perfil.svg";
        userImg.alt = foto ? "Foto do usuário" : "Ícone de perfil";
        userImg.style.display = "block";
      }

      userInfo.style.display = "flex";
      logoutBtn.style.display = "inline-block";
      if (loginBtn) loginBtn.style.display = "none";
      if (cadastroBtn) cadastroBtn.style.display = "none";
    } else {
      // 🔹 Quando o usuário sai
      if (userNome) userNome.textContent = "";
      if (userImg) userImg.style.display = "none";
      userInfo.style.display = "none";
      logoutBtn.style.display = "none";
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (cadastroBtn) cadastroBtn.style.display = "inline-block";
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });
}