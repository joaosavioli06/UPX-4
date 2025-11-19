// =============================
// EcoTrek - Página Recompensa
// =============================

import { auth, db } from "./config.js";
import { collection, query, where, getDocs, doc, updateDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// =============================
//  VARIÁVEIS E ELEMENTOS
// =============================

const modalRecomp = document.getElementById("modal-recomp");
const abrirModalRecomp = document.getElementById("abrir-recomp");
const fecharModalRecompElements = document.getElementsByClassName("fechar-recomp");

const carrossel = document.getElementById("carrossel");
const cards = document.querySelectorAll(".card");
const btnAvancar = document.querySelector(".btn_avancar");
const btnVoltar = document.querySelector(".btn_voltar");
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

let denunciasAprovadas = 0;
let premioDesbloqueado = false;
let premioResgatado = false;
let premiosJaResgatados = JSON.parse(localStorage.getItem("premiosJaResgatados")) || [];
let nivelAtual = parseInt(localStorage.getItem("nivelAtual")) || 1;

const imgIndisponivel = "./src/img/Premio-indisponivel.svg";
const imgResgatado = "./src/img/Premio-resgatado.svg";
const imgSupresa = "./src/img/Icone-surpresa.svg";


if (auth && auth.onAuthStateChanged) {
  auth.onAuthStateChanged((user) => {
    if (!user) return;

    const denunciasRef = collection(db, "denuncias");
    const q = query(denunciasRef, where("usuarioId", "==", user.uid));

    // Escuta em tempo real as denúncias do usuário
    onSnapshot(q, (snapshot) => {
      denunciasAprovadas = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const status = (data.status || "").toLowerCase();

        if (status === "aprovado") {
          denunciasAprovadas++;
        }
      });

      atualizarProgresso();
    });
  });
}

// =============================
//  OBJETO DE PRÊMIOS
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
//  MODAL DE SOLICITAÇÕES
// =============================

abrirModalSolic?.addEventListener("click", async () => {
  modalSolic.showModal();

  const secaoAndamento = document.querySelector(".novidades .andamento")?.parentElement;
  const secaoAprovado = document.querySelector(".novidades .aprovado")?.parentElement;
  const secaoRecusado = document.querySelector(".novidades .recusado")?.parentElement;

  const user = auth.currentUser;
  if (!user) return;

  const denunciasRef = collection(db, "denuncias");
  const q = query(denunciasRef, where("usuarioId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  let andamento = [];
  let aprovado = [];
  let recusado = [];
  denunciasAprovadas = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const tipo = data.tipo || "Sem título";
    const descricao = data.descricao || "Sem descrição";
    const status = (data.status || "pendente").toLowerCase();
    const dataDenuncia = data.data
      ? new Date(data.data.seconds * 1000).toLocaleDateString("pt-BR")
      : "—";

    const bloco = `
      <div class="item-solicitacao">
        <h3>Tipo de reclamação</h3>
        <p>${tipo}</p>
        <h3>Informe o que aconteceu</h3>
        <p>${descricao}</p>
        <p><strong>Data:</strong> ${dataDenuncia}</p>
      </div>
    `;

    if (status === "aprovado") {
      aprovado.push(bloco);
      denunciasAprovadas++;
    } else if (status === "em andamento" || status === "pendente") {
      andamento.push(bloco);
    } else if (status === "recusado") {
      recusado.push(bloco);
    }
  });

  const inserirConteudo = (secao, conteudo, msgVazio) => {
    if (!secao) return;
    secao.querySelectorAll(".item-solicitacao, p").forEach((el) => el.remove());
    secao.innerHTML += conteudo.length > 0 ? conteudo.join("") : `<p>${msgVazio}</p>`;
  };

  secaoAndamento?.addEventListener("toggle", () => {
    if (secaoAndamento.open) inserirConteudo(secaoAndamento, andamento, "Nenhuma denúncia em andamento.");
  });

  secaoAprovado?.addEventListener("toggle", () => {
    if (secaoAprovado.open) inserirConteudo(secaoAprovado, aprovado, "Nenhuma denúncia aprovada.");
  });

  secaoRecusado?.addEventListener("toggle", () => {
    if (secaoRecusado.open) inserirConteudo(secaoRecusado, recusado, "Nenhuma denúncia recusada.");
  });

  atualizarProgresso();
});


// =============================
//  PROGRESSO E NÍVEIS
// =============================

function atualizarProgresso() {
  const totalPremios = 10;
  const denunciasPorPremio = 5;
  const novoNivel = Math.min(Math.floor(denunciasAprovadas / denunciasPorPremio), totalPremios);

  // Atualiza apenas se houve mudança
  if (novoNivel !== nivelAtual) {
    nivelAtual = novoNivel;
  }

  // Calcula a porcentagem da barra
  const progressoAtual = Math.min((nivelAtual / totalPremios) * 100, 100);
  progresso.style.width = `${progressoAtual}%`;
  textoProgresso.textContent = `${nivelAtual} de ${totalPremios} missões concluídas`;

  // Atualiza ícones e cards
  atualizarIcones();
  atualizarCards();
}

// ===============================
//  FUNÇÃO: recalcular pontos do usuário a partir das denúncias aprovadas
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
//  MOSTRAR NÍVEL ATUAL NA TELA
// ===============================
// function mostrarNivelAtual(nivel) {
//   const el = document.getElementById("nivel-atual");
//   if (!el) return;
//   const nivelMax = 10;
//   el.textContent = `Nível atual: ${nivel} de ${nivelMax}`;
// }

// Atualiza as estrelas acima da barra
function atualizarIcones() {
  console.log("Chamou atualizarIcones - nivelAtual:", nivelAtual);
  console.log("premiosJaResgatados:", premiosJaResgatados);
  const totalPremios = 10;
  const premiosDesbloqueados = Math.min(nivelAtual, totalPremios);

  icones.forEach((icone, i) => {

    if (premiosJaResgatados.includes(i)) {
      icone.src = imgResgatado;
      icone.alt = "Prêmio resgatado com sucesso";
      return;
    }

    if (premiosDesbloqueados === 0) {
      if (i === 0) {
        icone.src = imgIndisponivel;
        icone.alt = "Primeiro prêmio ainda indisponível";
      } else {
        icone.src = imgSupresa;
        icone.alt = "Prêmio ainda não desbloqueado";
      }
      return;
    }

    const indiceAtual = premiosJaResgatados.length;
    if (i === indiceAtual) {
      icone.src = imgIndisponivel;
      icone.alt = "Prêmio desbloqueado, pronto para resgate";
    } else if (i < premiosDesbloqueados - 1) {
      icone.src = imgResgatado;
      icone.alt = "Prêmio resgatado";
    } else {
      icone.src = imgSupresa;
      icone.alt = "Prêmio ainda não desbloqueado";
    }
  });
}


function atualizarCards() {
  for (let i = 1; i <= 10; i++) {
    const card = document.getElementById(`nivel${i}`);
    if (!card) continue;

    const img = card.querySelector(".nivel img");
    const botao = card.querySelector("button");
    const spanNivel = card.querySelector(".nivel");

    if (i <= nivelAtual) {
      img.src = "./src/img/Desbloqueado.svg";
      img.alt = "Cadeado aberto";
      botao.textContent = "Prêmio disponível";
      botao.disabled = false;
      botao.classList.remove("indisponivel");
      botao.classList.add("ativo");
      card.classList.add("ativo");
      spanNivel.classList.add("ativo");
    } else {
      img.src = "./src/img/Bloqueado.svg";
      img.alt = "Cadeado fechado";
      botao.textContent = "Prêmio indisponível";
      botao.disabled = true;
      botao.classList.remove("ativo");
      botao.classList.add("indisponivel");
      card.classList.remove("ativo");
      spanNivel.classList.remove("ativo");
    }
  }
}

function desbloquearRecompensa(nivel) {
  const card = document.getElementById(`nivel${nivel}`);
  if (card) {
    const img = card.querySelector(".nivel img");
    const botao = card.querySelector("button");
    const spanNivel = card.querySelector(".nivel");

    img.src = "./src/img/Desbloqueado.svg";
    img.alt = "Cadeado aberto";

    botao.textContent = "Prêmio disponível";
    botao.classList.remove("indisponivel");
    botao.classList.add("ativo");
    card.classList.add("ativo");
    spanNivel.classList.add("ativo");
  }
}

abrirModalPremio.addEventListener("click", () => {
  if (!abrirModalPremio.classList.contains("indisponivel")) {
    atualizarConteudoPremio(nivelAtual);
    modalPremio.showModal();
  }
});
fecharModalPremio.addEventListener("click", () => modalPremio.close());

// =============================
//  CARROSSEL 
// =============================


let indice = 0;

btnAvancar.addEventListener("click", () => {
  const cardWidth = cards[0].offsetWidth + 16; // espaçamento entre os cards
  const wrapperWidth = document.querySelector(".carrossel-wrapper").offsetWidth;
  const totalWidth = carrossel.scrollWidth;
  const maxTranslate = totalWidth - wrapperWidth;
  const translateX = (indice + 1) * cardWidth;

  // só avança se ainda não chegou ao fim
  if (translateX <= maxTranslate) {
    indice++;
    carrossel.style.transform = `translateX(-${indice * cardWidth}px)`;
  } else {
    // fixa no último card
    carrossel.style.transform = `translateX(-${maxTranslate}px)`;
  }
});

btnVoltar.addEventListener("click", () => {
  const cardWidth = cards[0].offsetWidth + 16;

  // só volta se não estiver no primeiro
  if (indice > 0) {
    indice--;
    carrossel.style.transform = `translateX(-${indice * cardWidth}px)`;
  } else {
    indice = 0;
    carrossel.style.transform = `translateX(0px)`;
  }
});

// =============================
//  EVENTOS PARA BOTÕES DE CADA CARD 
// =============================

botoesPremio.forEach((botao, index) => {
  botao.addEventListener("click", () => {
    if (botao.classList.contains("ativo")) {
      const nivel = index + 1;

      if (modalRecomp && modalRecomp.open) modalRecomp.close();

      atualizarConteudoPremio(nivel);
      nivelAtual = nivel;

      if (modalPremio) modalPremio.showModal();
    }
  });
});

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
// Resgatar prêmio: fecha o modal de prêmio e atualiza os ícones visuais
// =============================
function resgatarPremio() {
  console.log("ANTES do resgate - nivelAtual:", nivelAtual);
  if (premioResgatado) return;

  const idx = nivelAtual - 1;
  if (icones[idx]) {
    icones[idx].src = imgResgatado;
    icones[idx].alt = "Prêmio resgatado com sucesso";
  }

  const cardAtual = document.getElementById(`nivel${nivelAtual}`);
  if (cardAtual) {
    cardAtual.classList.add("ativo");
    const botao = cardAtual.querySelector("button");
    botao.textContent = "Prêmio resgatado";
    botao.disabled = true;
    botao.classList.remove("ativo");
    botao.classList.add("resgatado");
  }

  premiosJaResgatados.push(idx);
  nivelAtual++;

  localStorage.setItem("premiosJaResgatados", JSON.stringify(premiosJaResgatados));
  localStorage.setItem("nivelAtual", nivelAtual);

  modalPremio.close();
  premioResgatado = true;

  atualizarIcones();
  atualizarCards();

  abrirModalPremio.classList.remove("ativo");
  abrirModalPremio.disabled = true;

  setTimeout(() => {
    premioResgatado = false;
  }, 500);
}


//Vinculo o botão de resgatar, se ele existir
if (btnResgatar) {
  btnResgatar.addEventListener("click", resgatarPremio);
}

// =============================
//  MODAIS: funcionalidade de abrir/fechar 
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

if (abrirModalRecomp) {
  abrirModalRecomp.addEventListener("click", () => {
    atualizarProgresso();
    if (modalRecomp && !modalRecomp.open) modalRecomp.showModal();
  });
}

if (fecharModalPremio) {
  fecharModalPremio.addEventListener("click", () => {
    if (modalPremio && modalPremio.open) {
      modalPremio.close();
      console.log("✖ Modal de prêmio fechado via X");
    }
  });
}

console.log("✅ recompensa.js inicializado - listeners prontos.");