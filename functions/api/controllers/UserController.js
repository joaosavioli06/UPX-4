const { db } = require("../config/firebase"); 

// Criar usuário
exports.createUser = async (req, res) => {
    try {
        // Pega apenas os campos que o cliente deve fornecer (nome e email)
        const { nome, email } = req.body; 
        
        // Pega o ID do usuário do token (o UID do Firebase Auth)
        const userId = req.userId;

        if (!userId) {
             return res.status(401).json({ error: "UID de usuário não encontrado." });
        }

        // Cria o objeto, definindo valores padrão e garantindo o email no documento
        const novoUsuario = {
            nome,
            email,
            nivel: 1,   // O servidor define o valor inicial
            pontos: 0   // O servidor define o valor inicial
        };

        // Usa o UID do Auth como ID do documento para ter uma referência forte
        const docRef = await db.collection("usuarios").doc(userId).set(novoUsuario);
        
        res.status(200).json({ 
            id: userId, // Retorna o UID
            message: "Usuário criado/atualizado!" 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar usuários
exports.getUsers = async (req, res) => {
    try {
        const snapshot = await db.collection("usuarios").get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Buscar Perfil do Usuário Logado (Saldo/Pontos)
exports.getProfile = async (req, res) => {
    try {
        // O ID do usuário logado é inserido pelo middleware de autenticação
        const userId = req.userId; 

        // Busca o documento do usuário no Firestore pelo seu ID
        const doc = await db.collection("usuarios").doc(userId).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Perfil do usuário não encontrado." });
        }

        // Retorna o ID, email, nome, nível e pontos do usuário
        res.status(200).json({ id: doc.id, ...doc.data() }); 

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
