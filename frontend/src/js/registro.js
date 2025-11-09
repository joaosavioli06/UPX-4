import { auth, db } from "./config.js";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  fetchSignInMethodsForEmail // 🔹 NUEVO
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  const googleBtn = document.getElementById("googleRegister");
  if (googleBtn) {
    googleBtn.addEventListener("click", handleGoogleRegister);
  }
});

async function handleRegister(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmar-senha").value.trim();
  const termo = document.getElementById("termo").checked;

  // Limpar mensagens anteriores
  ["nome", "email", "senha", "confirmar-senha", "termo"].forEach(id => {
    const el = document.getElementById(`${id}-error`);
    if (el) el.textContent = "";
  });

  if (!nome || !email || !senha || !confirmarSenha || !termo) {
    showError("email", "Preencha todos os campos e aceite os termos.");
    return;
  }

  if (senha !== confirmarSenha) {
    showError("confirmar-senha", "As senhas não coincidem.");
    return;
  }

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      if (methods.includes("google.com")) {
        showError("email", "Este e-mail já está cadastrado via Google. Faça login com o Google.");
      } else {
        showError("email", "Este e-mail já está cadastrado.");
      }
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      nome,
      email,
      pontos: 0,
      nivelAtual: 0, 
      criadoEm: serverTimestamp()
    });

    showSuccess("Usuário registrado com sucesso! Redirecionando...");
    setTimeout(() => window.location.href = "login.html", 2000);

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showError("email", "Este e-mail já está cadastrado.");
    } else if (error.code === "auth/weak-password") {
      showError("senha", "Senha muito fraca, mínimo 6 caracteres.");
    } else if (error.code === "auth/invalid-email") {
      showError("email", "Email inválido.");
    } else {
      console.error(error);
    }
  }
}

async function handleGoogleRegister(event) {
  event.preventDefault();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        nome: user.displayName || "Usuário Google",
        email: user.email,
        foto: user.photoURL || "",
        pontos: 0,
        nivelAtual: 0, 
        criadoEm: serverTimestamp()
      });
    }

    const token = await user.getIdToken();
    localStorage.setItem("userToken", token);
    localStorage.setItem("userId", user.uid);

    showSuccess("Login com Google bem-sucedido! Redirecionando...");
    setTimeout(() => window.location.href = "index.html", 2000);

  } catch (error) {
    console.error("Erro ao logar com Google:", error);
    showError("email", "Erro ao logar com Google. Tente novamente.");
  }
}

function showError(inputId, message) {
  const errorDiv = document.getElementById(`${inputId}-error`);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.color = "red";
  }
}

function showSuccess(message) {
  let successDiv = document.getElementById("success-msg");
  if (!successDiv) {
    successDiv = document.createElement("div");
    successDiv.id = "success-msg";
    successDiv.style.color = "green";
    successDiv.style.marginTop = "10px";
    const form = document.getElementById("register-form");
    form.insertAdjacentElement("beforeend", successDiv);
  }
  successDiv.textContent = message;
}
