const express = require("express");
const router = express.Router();
const { db } = require("../src/config/firebase");

router.get("/test", async (req, res) => {
  try {
    const testRef = db.collection("test").doc("connection-check");
    await testRef.set({ status: "connected", timestamp: new Date() });
    res.send("✅ Conexão com Firestore bem-sucedida!");
  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Erro ao conectar com Firestore");
  }
});

module.exports = router;
