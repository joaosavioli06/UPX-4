// 1. Configurações do seu Projeto Firebase
const firebaseConfig = {
  // ATENÇÃO: Substitua pelos valores reais do seu painel do Firebase (Configurações do Projeto)
  apiKey: "AIzaSyAcrMfjl3ft64AfB7JfS4OcgpML_aiRucs", 
  authDomain: "ecotrek-802a6.firebaseapp.com",
  projectId: "ecotrek-802a6",
  storageBucket: "ecotrek-802a6.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// 2. Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Objeto para lidar com Autenticação
const db = firebase.firestore(); // Objeto para lidar com Firestore (não o Admin SDK!)

// 3. URL Base da API Backend (Cloud Functions)
const API_URL_BASE = 'https://us-central1-ecotrek-802a6.cloudfunctions.net/api';

// 4. Função Auxiliar para Headers (Necessário para a API)
function getHeaders() {
    const token = localStorage.getItem('userToken');
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}