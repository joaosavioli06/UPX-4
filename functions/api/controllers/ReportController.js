const { db } = require("../config/firebase");

module.exports = {
  async createReport(req, res) {
    try {
      const data = req.body;
      const reportRef = await db.collection("reports").add(data);
      return res.status(201).json({ id: reportRef.id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar reporte" });
    }
  },

  async getAllReports(req, res) {
    try {
      const snapshot = await db.collection("reports").get();
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(reports);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar reportes" });
    }
  }
};
