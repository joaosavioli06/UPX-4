import { db } from "./config.js";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { auth } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("abrir-modal");
  const modal = document.getElementById("modal");

  if (btnRegistrar && modal) {
    btnRegistrar.addEventListener("click", async () => {
      const tipo = document.getElementById("modal_reclamacao")?.value;
      const descricao = document.getElementById("modal_ocorrido")?.value;
      const lat = localStorage.getItem("latitude");
      const lng = localStorage.getItem("longitude");

      if (!tipo || !descricao || !lat || !lng) {
        alert("Todos os campos e a localização devem ser preenchidos.");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        alert("Você precisa estar logado para registrar uma reclamação.");
        return;
      }

      // Evita múltiplos cliques rápidos
      if (btnRegistrar.disabled) return;
      btnRegistrar.disabled = true;
      const textoOriginal = btnRegistrar.textContent;
      btnRegistrar.textContent = "Enviando...";

      try {
        // 1️ Guarda a denuncia
        await addDoc(collection(db, "denuncias"), {
          tipo,
          descricao,
          coordenadas: { lat: parseFloat(lat), lng: parseFloat(lng) },
          data: serverTimestamp(),
          usuarioId: user.uid,
          usuarioEmail: user.email,
          status: "pendente",
          pontos_ganhos: 20
        });


        // Garantir que o usuário exista na coleção "usuarios"
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            pontos: 0,
            nivelAtual: 0
          });
        }

        alert("Reclamação registrada com sucesso! Aguarde aprovação para ganhar pontos.");

        // Limpeza dos campos e estado
        document.getElementById("modal_reclamacao").value = "";
        document.getElementById("modal_ocorrido").value = "";
        localStorage.removeItem("latitude");
        localStorage.removeItem("longitude");
        modal.close();
      } catch (erro) {
        console.error("Erro ao salvar denúncia:", erro);
        alert("Erro ao salvar. Tente novamente.");
      } finally {
        // Reativa o botão depois de concluir
        btnRegistrar.disabled = false;
        btnRegistrar.textContent = textoOriginal;
      }
    });
  }
});
