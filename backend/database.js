const admin = require('firebase-admin');

// O nome do segredo no Google Cloud Secret Manager
const serviceAccount = process.env.FIREBASE_ADMIN_KEY;

if (!serviceAccount) {
  throw new Error('A variável de ambiente FIREBASE_ADMIN_KEY não está definida.');
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const db = admin.firestore();

module.exports = { db };