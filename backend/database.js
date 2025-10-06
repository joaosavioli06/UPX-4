const admin = require('firebase-admin');

const serviceAccount = process.env.FIREBASE_ADMIN_KEY;

if (!serviceAccount) {
  throw new Error('A variável de ambiente FIREBASE_ADMIN_KEY não está definida.');
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const db = admin.firestore();

module.exports = { db };