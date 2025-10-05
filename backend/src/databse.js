const admin = require('firebase-admin');

// Tenta pegar a chave do Firebase de uma variável de ambiente
const serviceAccount = process.env.FIREBASE_ADMIN_KEY;

// Se a variável de ambiente não existir, a aplicação irá falhar.
if (!serviceAccount) {
  throw new Error('A variável de ambiente FIREBASE_ADMIN_KEY não está definida.');
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const db = admin.firestore();