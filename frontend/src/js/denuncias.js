import { db } from "./config.js";
import { collection, addDoc, doc, updateDoc, serverTimestamp, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
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

            try {
                // 1️⃣ Guardar la denuncia
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

                // 2️⃣ Actualizar puntos totales del usuario
                const userRef = doc(db, "usuarios", user.uid);
                const userSnap = await getDoc(userRef);

                let novosPontos = 20;
                if (userSnap.exists()) {
                    const pontosAtuais = userSnap.data().pontos || 0;
                    novosPontos = pontosAtuais + 20;
                    await updateDoc(userRef, { pontos: novosPontos });
                } else {
                    await setDoc(userRef, { pontos: 20, email: user.email });
                }

                // 3️⃣ Guardar registro en "pontos_ganhos"
                await addDoc(collection(db, "pontos_ganhos"), {
                    usuarioId: user.uid,
                    usuarioEmail: user.email,
                    pontos: 20,
                    motivo: "Denúncia registrada",
                    data: serverTimestamp()
                });

                alert("Reclamação registrada com sucesso! +20 pontos");
                document.getElementById("modal_reclamacao").value = "";
                document.getElementById("modal_ocorrido").value = "";
                localStorage.removeItem("latitude");
                localStorage.removeItem("longitude");
                modal.close();

            } catch (erro) {
                console.error("Erro ao salvar denúncia:", erro);
                alert("Erro ao salvar. Tente novamente.");
            }
        });
    }
});
