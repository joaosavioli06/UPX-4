// =============================
// EcoTrek - Sincronização de Pontos com Firestore
// =============================

import { auth, db } from "./config.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

console.log("⚡ syncPontos.js iniciado - monitorando alterações de denúncias");

// Escuta quando o usuário está logado
auth.onAuthStateChanged((user) => {
  if (!user) return;

  const denunciasRef = collection(db, "denuncias");
  const q = query(denunciasRef, where("usuarioId", "==", user.uid));

  // Escuta em tempo real todas as denúncias do usuário
  onSnapshot(q, async (snapshot) => {
    let totalPontos = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // 🔹 Conta apenas as denúncias APROVADAS
      if (data.status && data.status.toLowerCase() === "aprovado") {
        const pontos = Number(data.pontos_ganhos ?? data.pontos ?? 20);
        totalPontos += isFinite(pontos) ? pontos : 0;
      }
    });

    // 🔹 Calcula o nível atual (1 a cada 100 pontos, máximo 10)
    const nivelAtual = Math.min(Math.floor(totalPontos / 100), 10);

    // 🔹 Atualiza o total de pontos e nível do usuário
    const userRef = doc(db, "usuarios", user.uid);
    await setDoc(
      userRef,
      {
        pontos: totalPontos,
        nivelAtual: nivelAtual
      },
      { merge: true }
    );

    console.log(`✅ Pontos sincronizados: ${totalPontos} | Nível: ${nivelAtual}`);
  });
});
