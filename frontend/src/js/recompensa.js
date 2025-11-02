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
  const cardWidth = cards[0].offsetWidth + 16; // gap de 16px
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

// Modal de prêmios
const modalPremio = document.getElementById("modal-premio");
const abrirModalPremio = document.getElementById("abrir-premio");
const fecharModalPremio = document.getElementsByClassName('fechar-premio')[0]

abrirModalPremio.addEventListener("click", () => {
    modalPremio.showModal()
});

fecharModalPremio.addEventListener("click", () => {
    modalPremio.close();
});

window.addEventListener("click", (event) => {
    if (event.target === modalPremio) modalPremio.close();
});

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