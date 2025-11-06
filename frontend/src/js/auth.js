// ===============================
// EcoTrek - Controle de Sessão
// ===============================

import { auth, signOut } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Seleciona elementos do DOM
const loginBtn = document.querySelector(".botao_login");
const cadastroBtn = document.querySelector(".botao_cadastro");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");

// Garante que existam
if (userInfo && logoutBtn) {
  // Escuta mudanças no estado do usuário
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuário logado
      const nome = user.displayName || user.email;
      userInfo.textContent = `Olá, ${nome}`;
      userInfo.style.display = "inline-block";

      logoutBtn.style.display = "inline-block";
      logoutBtn.style.backgroundColor = "#1d663a";
      logoutBtn.style.color = "white";
      logoutBtn.style.border = "none";
      logoutBtn.style.borderRadius = "6px";
      logoutBtn.style.padding = "5px 10px";
      logoutBtn.style.cursor = "pointer";
      logoutBtn.style.marginLeft = "8px";

      if (loginBtn) loginBtn.style.display = "none";
      if (cadastroBtn) cadastroBtn.style.display = "none";
    } else {
      // Usuário deslogado
      userInfo.textContent = "";
      userInfo.style.display = "none";
      logoutBtn.style.display = "none";

      if (loginBtn) loginBtn.style.display = "inline-block";
      if (cadastroBtn) cadastroBtn.style.display = "inline-block";
    }
  });

  // Função de sair
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      window.location.href = "index.html"; // volta pra home
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });
}
