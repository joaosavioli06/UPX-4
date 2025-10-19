const { db } = require("../config/firebase"); // <-- CORREÇÃO: Importando apenas 'db'

// Criar denúncia
exports.createDenuncia = async (req, res) => {
    try {
        // Pega todos os dados do corpo (categoria, descricao, localizacao, imagemUrl, etc.)
        const data = req.body; 
        
        const docRef = await db.collection("denuncias").add({
            ...data, // Insere os dados fornecidos pelo cliente
            data_criacao: new Date(), // O servidor define a data
            status: "pendente"        // O servidor define o status inicial
        });
        
        res.status(201).json({ id: docRef.id, message: "Denúncia criada!" }); 
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todas as denúncias
exports.getDenuncias = async (req, res) => {
    try {
        const snapshot = await db.collection("denuncias").get();
        const denuncias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(denuncias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};