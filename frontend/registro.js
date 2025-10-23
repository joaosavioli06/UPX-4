const firebaseConfig = {
  apiKey: "AIzaSyAcrMfjl3ft64AfB7JfS4OcgpML_aiRucs",
  authDomain: "ecotrek-802a6.firebaseapp.com",
  projectId: "ecotrek-802a6",
  storageBucket: "ecotrek-802a6.firebasestorage.app",
  messagingSenderId: "953729913204",
  appId: "1:953729913204:web:aabf335f16a2a93d7e5c21",
  measurementId: "G-WRNHJ89LE1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.querySelector(".caixa_cadastro");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;
  const termo = document.getElementById("termo").checked;

  if (!termo) {
    alert("Você deve aceitar os termos de uso.");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  db.collection("usuarios").where("email", "==", email).get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        alert("Este email já está registrado!");
      } else {
        db.collection("usuarios").add({
          nome: nome,
          email: email,
          senha: senha
        })
        .then(() => {
          alert("Usuário registrado com sucesso!");
          form.reset();
        })
        .catch((error) => {
          alert("Erro ao registrar: " + error.message);
        });
      }
    })
    .catch((error) => {
      alert("Erro ao verificar email: " + error.message);
    });
});