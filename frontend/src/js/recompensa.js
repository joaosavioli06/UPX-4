// =============================
// EcoTrek - Página Recompensa
// =============================

import { auth, db } from "./config.js";
import { collection, query, where, getDocs, doc, updateDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// =============================
// 🔹 VARIÁVEIS E ELEMENTOS
// =============================

const modalRecomp = document.getElementById("modal-recomp");
const abrirModalRecomp = document.getElementById("abrir-recomp");
const fecharModalRecompElements = document.getElementsByClassName("fechar-recomp"); // NodeList-like

const carrossel = document.getElementById("carrossel");
const cards = document.querySelectorAll(".card");
const botoesPremio = document.querySelectorAll(".card button");

const progresso = document.querySelector(".progresso");
const textoProgresso = document.querySelector(".texto_progresso");
const icones = document.querySelectorAll(".icones_premios img");

const modalPremio = document.getElementById("modal-premio");
const abrirModalPremio = document.getElementById("abrir-premio");
const fecharModalPremio = document.getElementsByClassName("fechar-premio")[0];
const btnResgatar = document.querySelector(".resgate");
const tituloPremio = document.querySelector(".nome");
const valorPremio = document.querySelector(".valor");
const textoPremio = document.querySelector(".texto");
const descricaoPremio = document.querySelector(".descricao");
const extraPremio = document.querySelector(".extra");

const modalSolic = document.getElementById("modal-solic");
const abrirModalSolic = document.getElementById("abrir-solic");
const fecharModalSolic = document.getElementsByClassName("fechar-solic")[0];
const tabelaBody = document.querySelector("#tabela-denuncias tbody");

let indice = 0;
let denunciasAprovadas = 0;
let nivelAtual = 0;
let premioDesbloqueado = false;
let premioResgatado = false;

const imgIndisponivel = "./src/img/Premio-indisponivel.svg";
const imgResgatado = "./src/img/Premio-resgatado.svg";
const imgSupresa = "./src/img/Icone-surpresa.svg";

// =============================
// 🔹 OBJETO DE PRÊMIOS
// =============================

const premios = {
  1: {
    nome: "Seu 1º Prêmio é da GreenHouse Decor!",
    valor: "10%",
    texto: "desconto",
    descricao:
      "A loja que une design minimalista e consciência ecológica para transformar seu lar em um refúgio sustentável.",
    extra: "Use seu cupom e descubra o poder da decoração que respeita o planeta!"
  },
  2: {
    nome: "Seu 2º Prêmio é da CityCoffee",
    valor: "10%",
    texto: "desconto",
    descricao:
      "A cafeteria que incentiva hábitos saudáveis e sustentáveis, oferecendo descontos para quem chega de bike ou a pé.",
    extra:
      "Saboreie um café especial e ajude a tornar a cidade mais verde, um passo (ou pedalada) de cada vez!"
  },
  3: {
    nome: "Seu 3º Prêmio é da EcoTech",
    valor: "10%",
    texto: "desconto",
    descricao: "Tecnologia inteligente que consome menos energia e respeita o meio ambiente.",
    extra: "Com a EcoTech, cada clique é um passo rumo a um futuro mais limpo e eficiente.",
  },
  4: {
    nome: "Seu 4º Prêmio é da NatureBox",
    valor: "15%",
    texto: "desconto",
    descricao: "Cosméticos naturais e veganos, livres de crueldade e cheios de ingredientes do bem.",
    extra: "Cuide de você e do planeta com a beleza que nasce da natureza."
  },
  5: {
    nome: "Seu 5º Prêmio é da ReUseStore",
    valor: "15%",
    texto: "desconto",
    descricao: "Moda feita a partir de materiais reciclados, com estilo e propósito.",
    extra: "Vista o futuro, cada peça é uma história de reinvenção e sustentabilidade."
  },
  6: {
    nome: "Seu 6º Prêmio é da EcoBus Pass",
    valor: "25%",
    texto: "desconto",
    descricao:
      "Créditos para transporte público sustentável, incentivando uma mobilidade mais ecológica.",
    extra: "Deixe o carro em casa e viaje rumo a um futuro com menos poluição."
  },
  7: {
    nome: "Seu 7º Prêmio é da BioPet",
    valor: "25%",
    texto: "desconto",
    descricao: "Produtos ecológicos, naturais e seguros para o seu melhor amigo.",
    extra: "Cuidar do seu pet também é cuidar do planeta, amor e consciência em cada escolha."
  },
  8: {
    nome: "Seu 8º Prêmio é da RideNow",
    valor: "30%",
    texto: "desconto",
    descricao:
      "Serviço de aluguel de bikes e patinetes elétricas que transforma o jeito de se locomover pela cidade.",
    extra: "Viva a mobilidade leve e sustentável, pegue sua RideNow e sinta o vento da mudança!"
  },
  9: {
    nome: "Seu 9º Prêmio é da EcoMarket Deli",
    valor: "30%",
    texto: "desconto",
    descricao: "Mercado urbano com produtos orgânicos, frescos e de produtores locais.",
    extra: "Alimente-se bem e apoie quem cultiva com amor e respeito à natureza."
  },
  10: {
    nome: "Seu 10º Prêmio é da ReCity Market",
    valor: "40%",
    texto: "desconto",
    descricao: "Marketplace de produtos sustentáveis para o dia a dia urbano.",
    extra: "Escolha viver de forma mais consciente, cada compra é um ato de mudança."
  }
};

// =============================
// 🔹 LISTENER AUTOMÁTICO DE DENÚNCIAS (NOVO BLOCO)
// =============================

// Escuta auth y luego onSnapshot para cambios en la colección denuncias del usuario
if (auth && auth.onAuthStateChanged) {
  auth.onAuthStateChanged((user) => {
    if (!user) return;

    const denunciasRef = collection(db, "denuncias");
    const q = query(denunciasRef, where("usuarioId", "==", user.uid));

    onSnapshot(q, async (snapshot) => {
      denunciasAprovadas = 0;
      tabelaBody.innerHTML = "";

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const tipo = data.tipo || "Sem título";
        const status = data.status || "Em andamento";
        const dataDenuncia = data.data
          ? new Date(data.data.seconds * 1000).toLocaleDateString("pt-BR")
          : "—";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${tipo}</td>
          <td>${status}</td>
          <td>${dataDenuncia}</td>
        `;
        tabelaBody.appendChild(tr);

        if (String(status).toLowerCase() === "aprovado") denunciasAprovadas++;
      });

      // Atualiza progresso e pontos automáticamente
      atualizarProgresso();
      await atualizarPontosUsuario(user.uid);
    });
  });
}

// =============================
// 🔹 FIRESTORE: CONTAGEM DE DENÚNCIAS (fallback ao abrir modal)
// =============================

abrirModalSolic?.addEventListener("click", async () => {
  modalSolic.showModal();
  tabelaBody.innerHTML = "";

  const user = auth.currentUser;
  if (!user) return;

  const denunciasRef = collection(db, "denuncias");
  const q = query(denunciasRef, where("usuarioId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  denunciasAprovadas = 0;

  if (querySnapshot.empty) {
    tabelaBody.innerHTML = `<tr><td colspan="3">Nenhuma denúncia encontrada.</td></tr>`;
    atualizarProgresso();
    if (user) await atualizarPontosUsuario(user.uid);
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const tipo = data.tipo || "Sem título";
    const status = data.status || "Em andamento";
    const dataDenuncia = data.data
      ? new Date(data.data.seconds * 1000).toLocaleDateString("pt-BR")
      : "—";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tipo}</td>
      <td>${status}</td>
      <td>${dataDenuncia}</td>
    `;
    tabelaBody.appendChild(tr);

    if (String(status).toLowerCase() === "aprovado") denunciasAprovadas++;
  });

  atualizarProgresso();

  // 🔹 Atualiza os pontos totais do usuário
  if (user) await atualizarPontosUsuario(user.uid);
});

// =============================
// 🔹 PROGRESSO E NÍVEIS
// =============================

function atualizarProgresso() {
  const progressoAtual = Math.min(denunciasAprovadas / 50, 1) * 100;
  progresso.style.width = `${progressoAtual}%`;
  textoProgresso.textContent = `${denunciasAprovadas} denúncias aprovadas`;
  atualizarIcones(progressoAtual);
  atualizarNiveis();
}

// ===============================
// 🔹 FUNÇÃO: recalcular pontos do usuário a partir das denúncias aprovadas
// ===============================
async function atualizarPontosUsuario(userId) {
  try {
    const denunciasRef = collection(db, "denuncias");
    const q = query(
      denunciasRef,
      where("usuarioId", "==", userId),
      where("status", "==", "aprovado")
    );
    const querySnapshot = await getDocs(q);

    let totalPontos = 0;
    querySnapshot.forEach((d) => {
      const data = d.data();
      const pontosDenuncia = Number(data.pontos ?? data.pontos_ganhos ?? 20);
      totalPontos += isFinite(pontosDenuncia) ? pontosDenuncia : 0;
    });

    const userRef = doc(db, "usuarios", userId);
    await setDoc(
      userRef,
      {
        pontos: totalPontos,
        nivelAtual: Math.floor(totalPontos / 50)
      },
      { merge: true }
    );

    mostrarNivelAtual(Math.floor(totalPontos / 50));

    console.log(
      `✅ pontos atualizados para ${userId}: ${totalPontos} (nivel ${Math.floor(
        totalPontos / 50
      )})`
    );
  } catch (err) {
    console.error("Erro atualizando pontos do usuário:", err);
  }
}

// ===============================
// 🔹 MOSTRAR NÍVEL ATUAL NA TELA
// ===============================
function mostrarNivelAtual(nivel) {
  const el = document.getElementById("nivel-atual");
  if (!el) return;
  const nivelMax = 10;
  el.textContent = `Nível atual: ${nivel} de ${nivelMax}`;
}

// Atualiza as estrelas acima da barra
function atualizarIcones(valor) {
  const estrelasDesbloqueadas = Math.floor(denunciasAprovadas / 5);

  icones.forEach((icone, i) => {
    if (i < estrelasDesbloqueadas) {
      icone.src = imgResgatado;
      icone.alt = "Prêmio desbloqueado";
    } else {
      icone.src = imgSupresa;
      icone.alt = "Prêmio ainda bloqueado";
    }
  });
}

// Desbloqueia visualmente os cards no carrossel
function atualizarNiveis() {
  const estrelasDesbloqueadas = Math.floor(denunciasAprovadas / 5);

  for (let i = 1; i <= 10; i++) {
    const card = document.getElementById(`nivel${i}`);
    if (!card) continue;

    const icone = card.querySelector(".nivel img");
    const botao = card.querySelector("button");

    if (i <= estrelasDesbloqueadas) {
      icone.src = "./src/img/Desbloqueado.svg";
      icone.alt = "Nível desbloqueado";
      botao.textContent = "Resgatar prêmio";
      botao.disabled = false;
      botao.classList.remove("indisponivel");
      botao.classList.add("ativo");
    } else {
      icone.src = "./src/img/Bloqueado.svg";
      icone.alt = "Nível bloqueado";
      botao.textContent = "Prêmio indisponível";
      botao.disabled = true;
      botao.classList.remove("ativo");
      botao.classList.add("indisponivel");
    }
  }
}

// =============================
// 🔹 CARROSSEL (versão original restaurada)
// =============================

let posicaoCarrossel = 0;

function avancarCarrossel() {
  const cards = carrossel.querySelectorAll(".card");
  if (posicaoCarrossel < cards.length - 1) {
    posicaoCarrossel++;
    carrossel.style.transform = `translateX(-${posicaoCarrossel * 100}%)`;
  }
}

function voltarCarrossel() {
  if (posicaoCarrossel > 0) {
    posicaoCarrossel--;
    carrossel.style.transform = `translateX(-${posicaoCarrossel * 100}%)`;
  }
}

document.querySelector(".btn_avancar").addEventListener("click", avancarCarrossel);
document.querySelector(".btn_voltar").addEventListener("click", voltarCarrossel);

// =============================
// 🔹 EVENTOS PARA BOTÕES DE CADA CARD (abrir modal premio)
// =============================

// Mantengo la lógica original pero enlazo para mostrar el modalPremio con el contenido correcto
botoesPremio.forEach((botao, index) => {
  botao.addEventListener("click", () => {
    if (botao.classList.contains("ativo")) {
      const nivel = index + 1;

      // cerrar modalRecomp (si estaba abierto) y abrir modalPremio con el premio correcto
      if (modalRecomp && modalRecomp.open) modalRecomp.close();

      atualizarConteudoPremio(nivel);
      nivelAtual = nivel;

      if (modalPremio) modalPremio.showModal();
    }
  });
});

// =============================
// 🔹 Função para preencher contenido modal premio
// =============================
function atualizarConteudoPremio(nivel) {
  const premio = premios[nivel];
  if (!premio) return;

  tituloPremio.textContent = premio.nome;
  valorPremio.textContent = premio.valor;
  textoPremio.textContent = premio.texto;
  descricaoPremio.textContent = premio.descricao;
  extraPremio.textContent = premio.extra;
}

// =============================
// 🔹 Resgatar premio: cierra el modal de premio y actualiza iconos visuales
// =============================
function resgatarPremio() {
  if (premioResgatado) return;

  const idx = nivelAtual - 1;
  if (icones[idx]) {
    icones[idx].src = imgResgatado;
    icones[idx].alt = "Prêmio resgatado com sucesso";
  }

  if (icones[idx + 1]) {
    icones[idx + 1].src = imgIndisponivel;
    icones[idx + 1].alt = "Próximo prêmio ainda indisponível";
  }

  if (modalPremio && modalPremio.open) {
    modalPremio.close();
    console.log("🏆 Prêmio resgatado — modal fechado automaticamente.");
  }

  // Mantener comportamiento visual original: animar y cerrar modalRecomp si hace falta
  if (modalRecomp) {
    modalRecomp.classList.add("fadeOut");
    setTimeout(() => {
      if (modalRecomp.open) modalRecomp.close();
      modalRecomp.classList.remove("fadeOut");
    }, 300);
  }

  premioResgatado = true;

  // Reset flags después de pequeña pausa (según lógica original)
  setTimeout(() => {
    premioDesbloqueado = false;
    premioResgatado = false;
  }, 500);
}

// Enlazo el botón resgatar si existe
if (btnResgatar) {
  btnResgatar.addEventListener("click", resgatarPremio);
}

// =============================
// 🔹 MODAIS: funcionalidad de abrir/cerrar (manteniendo original)
// =============================

function configurarModal(modal, abrir, fechar) {
  abrir?.addEventListener("click", () => modal.showModal());
  fechar?.addEventListener("click", () => modal.close());
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}

configurarModal(modalRecomp, abrirModalRecomp, fecharModalRecompElements[0]);
configurarModal(modalPremio, abrirModalPremio, fecharModalPremio);
configurarModal(modalSolic, abrirModalSolic, fecharModalSolic);

// AÑADO: si hay más de un elemento .fechar-recomp (hay dos spans en tu HTML), cerrarlos todos
if (fecharModalRecompElements && fecharModalRecompElements.length > 0) {
  Array.from(fecharModalRecompElements).forEach((el) => {
    el.addEventListener("click", () => {
      if (modalRecomp && modalRecomp.open) {
        modalRecomp.close();
        console.log("🟢 Modal de recompensas fechado com sucesso!");
      }
    });
  });
}

// También aseguro que el botón 'abrir-recomp' actualice progreso antes de abrir (manteniendo UX)
if (abrirModalRecomp) {
  abrirModalRecomp.addEventListener("click", () => {
    atualizarProgresso();
    if (modalRecomp && !modalRecomp.open) modalRecomp.showModal();
  });
}

// =============================
// 🔹 Pequeña seguridad: si el modal premio tiene su 'X' (fecharModalPremio) lo enlazo y lo dejo como antes
// =============================
if (fecharModalPremio) {
  fecharModalPremio.addEventListener("click", () => {
    if (modalPremio && modalPremio.open) {
      modalPremio.close();
      console.log("✖ Modal de prêmio fechado via X");
    }
  });
}

// =============================
// 🔹 Final - log para debugging
// =============================
console.log("✅ recompensa.js inicializado - listeners prontos.");
