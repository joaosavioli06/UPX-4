// =============================
// EcoTrek - Página Recompensa
// =============================

// Modal de recompensa
const modalRecomp = document.getElementById("modal-recomp");
const abrirModalRecomp = document.getElementById("abrir-recomp");
const fecharModalRecomp = document.getElementsByClassName('fechar-recomp')[0]
const carrossel = document.getElementById("carrossel");
const cards = document.querySelectorAll(".card");

let indice = 0;

abrirModalRecomp.addEventListener('click', () => {
  modalRecomp.showModal()
});

fecharModalRecomp.addEventListener("click", () => {
  modalRecomp.close();
});

window.addEventListener("click", (event) => {
  if (event.target === modalRecomp) modalRecomp.close();
});

document.querySelector(".btn_avancar").addEventListener("click", () => {
  const cardWidth = cards[0].offsetWidth + 16;
  const wrapperWidth = document.querySelector(".carrossel-wrapper").offsetWidth;
  const totalWidth = carrossel.scrollWidth;
  const maxTranslate = totalWidth - wrapperWidth;
  const translateX = (indice + 1) * cardWidth;

  if (translateX <= maxTranslate) {
    indice++;
    carrossel.style.transform = `translateX(-${indice * cardWidth}px)`;
  } else {
    carrossel.style.transform = `translateX(-${maxTranslate}px)`;
  }
});

document.querySelector(".btn_voltar").addEventListener("click", () => {
  const cardWidth = cards[0].offsetWidth + 16;

  if (indice > 0) {
    indice--;
    carrossel.style.transform = `translateX(-${indice * cardWidth}px)`;
  } else {
    indice = 0;
    carrossel.style.transform = `translateX(0px)`;
  }
});

const progresso = document.querySelector(".progresso");
const icones = document.querySelectorAll(".icones_premios img");
const textoProgresso = document.querySelector(".texto_progresso");
const imgIndisponivel = "./src/img/Premio-indisponivel.svg";
const imgResgatado = "./src/img/Premio-resgatado.svg";
const imgSupresa = "./src/img/Icone-surpresa.svg";

const abrirModalPremio = document.getElementById("abrir-premio");
const fecharModalPremio = document.getElementsByClassName('fechar-premio')[0]
const btnResgatar = document.querySelector(".resgate");

let progressoAtual = 0;
const incremento = 10;
let missoesConcluidas = 0;
let totalMissoes = 10;
let nivelAtual = 0;
let premioDesbloqueado = false;
let premioResgatado = false;

function atualizarProgresso() {
  if (progressoAtual < 100) {
    progressoAtual += incremento;
    progresso.style.width = `${progressoAtual}%`;

    missoesConcluidas = progressoAtual / 10;
    textoProgresso.textContent = `${missoesConcluidas} de ${totalMissoes} missões concluídas`;

    atualizarIcones(progressoAtual);
    desbloquearRecompensa(missoesConcluidas);

    if (!premioDesbloqueado && progressoAtual % 10 === 0) {
      abrirModalPremio.classList.add("ativo");
      premioDesbloqueado = true;
      nivelAtual = missoesConcluidas;
    }
  }
}

function atualizarIcones(valor) {
  const indice = valor / 10 - 1;
  if (indice >= 0 && indice < icones.length) {
    icones[indice].src = "./src/img/Premio-indisponivel.svg";
    icones[indice].alt = "Prêmio descoberto, mas ainda não desbloqueado";
    if (indice + 1 < icones.length) {
      icones[indice + 1].src = "./src/img/Icone-surpresa.svg";
    }
  }
}

function desbloquearRecompensa(nivel) {
  const card = document.getElementById(`nivel${nivel}`);
  if(card) {
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
    modalPremio.showModal();
  }
});

fecharModalPremio.addEventListener("click", () => modalPremio.close());

btnResgatar.addEventListener("click", () => {
  if (!premioResgatado) {
    const indice = nivelAtual - 1;
    icones[indice].src = imgResgatado;
    icones[indice].alt = "Prêmio resgatado com sucesso";

    if (icones[indice + 1]) {
      icones[indice + 1].src = imgIndisponivel;
      icones[indice + 1].alt = "Próximo prêmio ainda indisponível";
    }

    abrirModalPremio.classList.remove("ativo");

    premioResgatado = true;
    modalPremio.close();

    setTimeout(() => {
      premioDesbloqueado = false;
      premioResgatado = false;
    }, 500);
  }
});
document.getElementById("abrir-recomp").addEventListener("click", atualizarProgresso);


// Modal de prêmios
const modalPremio = document.getElementById("modal-premio");
// const abrirModalPremio = document.getElementById("abrir-premio");
// const fecharModalPremio = document.getElementsByClassName('fechar-premio')[0]
// const btnResgatar = document.querySelector(".resgate");

// abrirModalPremio.addEventListener("click", () => {
//   modalPremio.showModal()
// });

// fecharModalPremio.addEventListener("click", () => {
//   modalPremio.close();
// });

// window.addEventListener("click", (event) => {
//   if (event.target === modalPremio) modalPremio.close();
// });

// Modal de solicitações
const modalSolic = document.getElementById("modal-solic");
const abrirModalSolic = document.getElementById("abrir-solic");
const fecharModalSolic = document.getElementsByClassName('fechar-solic')[0]

abrirModalSolic.addEventListener("click", () => {
  modalSolic.showModal()
});

fecharModalSolic.addEventListener("click", () => {
  modalSolic.close();
});

window.addEventListener("click", (event) => {
  if (event.target === modalSolic) modalSolic.close();
});