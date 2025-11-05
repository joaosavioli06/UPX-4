// =============================
// EcoTrek - Página Recompensa
// =============================

const modalRecomp = document.getElementById("modal-recomp");
const abrirModalRecomp = document.getElementById("abrir-recomp");
const fecharModalRecomp = document.getElementsByClassName("fechar-recomp")[0];

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

const premios = {
  1: {
    nome: "Seu 1º Prêmio é da GreenHouse Decor!",
    valor: "10%",
    texto: "desconto",
    descricao: "A loja que une design minimalista e consciência ecológica para transformar seu lar em um refúgio sustentável.",
    extra: "Use seu cupom e descubra o poder da decoração que respeita o planeta!"
  },
  2: {
    nome: "Seu 2º Prêmio é da CityCoffee",
    valor: "10%",
    texto: "desconto",
    descricao: "A cafeteria que incentiva hábitos saudáveis e sustentáveis, oferecendo descontos para quem chega de bike ou a pé.",
    extra: "Saboreie um café especial e ajude a tornar a cidade mais verde, um passo (ou pedalada) de cada vez!",
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
    extra: "Cuide de você e do planeta com a beleza que nasce da natureza.",
  },
  5: {
    nome: "Seu 5º Prêmio é da ReUseStore",
    valor: "15%",
    texto: "desconto",
    descricao: "Moda feita a partir de materiais reciclados, com estilo e propósito.",
    extra: "Vista o futuro, cada peça é uma história de reinvenção e sustentabilidade.",
  },
  6: {
    nome: "Seu 6º Prêmio é da EcoBus Pass",
    valor: "25%",
    texto: "desconto",
    descricao: "Créditos para transporte público sustentável, incentivando uma mobilidade mais ecológica.",
    extra: "Deixe o carro em casa e viaje rumo a um futuro com menos poluição.",
  },
  7: {
    nome: "Seu 7º Prêmio é da BioPet",
    valor: "25%",
    texto: "desconto",
    descricao: "Produtos ecológicos, naturais e seguros para o seu melhor amigo.",
    extra: "Cuidar do seu pet também é cuidar do planeta, amor e consciência em cada escolha.",
  },
  8: {
    nome: "Seu 8º Prêmio é da RideNow",
    valor: "30%",
    texto: "desconto",
    descricao: "Serviço de aluguel de bikes e patinetes elétricas que transforma o jeito de se locomover pela cidade.",
    extra: "Viva a mobilidade leve e sustentável, pegue sua RideNow e sinta o vento da mudança!",
  },
  9: {
    nome: "Seu 9º Prêmio é da EcoMarket Deli",
    valor: "30%",
    texto: "desconto",
    descricao: "Mercado urbano com produtos orgânicos, frescos e de produtores locais.",
    extra: "Alimente-se bem e apoie quem cultiva com amor e respeito à natureza.",
  },
  10: {
    nome: "Seu 10º Prêmio é da ReCity Market",
    valor: "40%",
    texto: "desconto",
    descricao: "Marketplace de produtos sustentáveis para o dia a dia urbano.",
    extra: "Escolha viver de forma mais consciente, cada compra é um ato de mudança.",
  }
};

const modalSolic = document.getElementById("modal-solic");
const abrirModalSolic = document.getElementById("abrir-solic");
const fecharModalSolic = document.getElementsByClassName("fechar-solic")[0];

let indice = 0;
let progressoAtual = 0;
let missoesConcluidas = 0;
let totalMissoes = 10;
let nivelAtual = 0;
let premioDesbloqueado = false;
let premioResgatado = false;
const incremento = 10;

const imgIndisponivel = "./src/img/Premio-indisponivel.svg";
const imgResgatado = "./src/img/Premio-resgatado.svg";
const imgSupresa = "./src/img/Icone-surpresa.svg";

function avancarCarrossel() {
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
}

function voltarCarrossel() {
  const cardWidth = cards[0].offsetWidth + 16;

  if (indice > 0) {
    indice--;
    carrossel.style.transform = `translateX(-${indice * cardWidth}px)`;
  } else {
    indice = 0;
    carrossel.style.transform = `translateX(0px)`;
  }
}

botoesPremio.forEach((botao, index) => {
  botao.addEventListener("click", () => {
    if (botao.classList.contains("ativo")) {
      const nivel = index + 1;

      modalRecomp.close();

      atualizarConteudoPremio(nivel);

      nivelAtual = nivel;

      modalPremio.showModal();
    }
  })
});

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

      atualizarConteudoPremio(nivelAtual);
    }
  }
}

function atualizarIcones(valor) {
  const indice = valor / 10 - 1;
  if (indice >= 0 && indice < icones.length) {
    icones[indice].src = imgIndisponivel;
    icones[indice].alt = "Prêmio descoberto, mas ainda não desbloqueado";

    if (indice + 1 < icones.length) {
      icones[indice + 1].src = imgSupresa;
    }
  }
}

function desbloquearRecompensa(nivel) {
  const card = document.getElementById(`nivel${nivel}`);
  if (!card) return;

  const img = card.querySelector(".nivel img");
  const botao = card.querySelector("button");
  const spanNivel = card.querySelector(".nivel");

  img.src = "./src/img/Desbloqueado.svg";
  img.alt = "Cadeado aberto";

  botao.textContent = "Prêmio disponível";
  botao.classList.add("ativo");
  botao.classList.remove("indisponivel");
  card.classList.add("ativo");
  spanNivel.classList.add("ativo");
}

function atualizarConteudoPremio(nivel) {
  const premio = premios[nivel];
  if (!premio) return;

  tituloPremio.textContent = premio.nome;
  valorPremio.textContent = premio.valor;
  textoPremio.textContent = premio.texto;
  descricaoPremio.textContent = premio.descricao;
  extraPremio.textContent = premio.extra;
}

function resgatarPremio() {
  if (premioResgatado) return;

  const indice = nivelAtual - 1;
  icones[indice].src = imgResgatado;
  icones[indice].alt = "Prêmio resgatado com sucesso";

  if (icones[indice + 1]) {
    icones[indice + 1].src = imgIndisponivel;
    icones[indice + 1].alt = "Próximo prêmio ainda indisponível";
  }

  abrirModalPremio.classList.remove("ativo");
  modalPremio.close();
  premioResgatado = true;

  modalRecomp.classList.add("fadeOut");
  setTimeout(() => {
    modalRecomp.close();
    modalRecomp.classList.remove("fadeOut");
  }, 300);

  setTimeout(() => {
    premioDesbloqueado = false;
    premioResgatado = false;
  }, 500);
}

function configurarModal(modal, abrir, fechar) {
  abrir.addEventListener("click", () => modal.showModal());
  fechar.addEventListener("click", () => modal.close());
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}

configurarModal(modalRecomp, abrirModalRecomp, fecharModalRecomp);
configurarModal(modalSolic, abrirModalSolic, fecharModalSolic);

abrirModalPremio.addEventListener("click", () => {
  if (!abrirModalPremio.classList.contains("indisponivel")) {
    modalPremio.showModal();
  }
});
fecharModalPremio.addEventListener("click", () => modalPremio.close());

document.querySelector(".btn_avancar").addEventListener("click", avancarCarrossel);
document.querySelector(".btn_voltar").addEventListener("click", voltarCarrossel);
document.getElementById("abrir-recomp").addEventListener("click", atualizarProgresso);
btnResgatar.addEventListener("click", resgatarPremio);
