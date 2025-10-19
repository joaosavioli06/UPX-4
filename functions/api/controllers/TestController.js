const { db } = require("../config/firebase");

exports.testConnection = async (req, res) => {
  try {
    const testRef = db.collection("test").doc("connection-check");
    await testRef.set({ status: "connected", timestamp: new Date() });
    res.send("✅ Conexão com Firestore bem-sucedida!");
  } catch (error) {
    res.status(500).send("❌ Erro ao conectar com Firestore");
  }
};
