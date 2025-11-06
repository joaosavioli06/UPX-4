// ===============================
// EcoTrek - Configuração Firebase
// ===============================

// 1. Configurações do seu Projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAcrMfjl3ft64AfB7JfS4OcgpML_aiRucs",
  authDomain: "ecotrek-802a6.firebaseapp.com",
  projectId: "ecotrek-802a6",
  storageBucket: "ecotrek-802a6.appspot.com",
  messagingSenderId: "953729913204",
  appId: "1:953729913204:web:xxxxxx" // coloque o appId real
};

// 2. Importa o SDK modular do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } 
  from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 3. Inicializa o Firebase App e os serviços
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. URL Base da API Backend (se necessário)
const API_URL_BASE = "https://us-central1-ecotrek-802a6.cloudfunctions.net/api";

// 5. Função Auxiliar para Headers da API
function getHeaders() {
  const token = localStorage.getItem("userToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// 6. Exportar para outros módulos
export { 
  app, auth, db, API_URL_BASE, getHeaders,
  GoogleAuthProvider, signInWithPopup, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, doc, getDoc, setDoc, serverTimestamp
};
