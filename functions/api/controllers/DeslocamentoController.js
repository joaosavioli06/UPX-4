const { db } = require("../config/firebase"); // <-- CORREÇÃO: Importando apenas 'db'

// Criar deslocamento
exports.createDeslocamento = async (req, res) => {
    try {
        // Pega os dados do cliente (tipo_transporte, distancia_percorrida, usuario, etc.)
        const data = req.body; 
        
        const docRef = await db.collection("deslocamentos").add({
            ...data,
            data_horario: new Date() // O servidor define a data e hora
        });
        
        res.status(201).json({ id: docRef.id, message: "Deslocamento registrado!" });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar deslocamentos
exports.getDeslocamentos = async (req, res) => {
    try {
        const snapshot = await db.collection("deslocamentos").get();
        const deslocamentos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(deslocamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};