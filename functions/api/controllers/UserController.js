const { db } = require("../config/firebase"); 

// Criar usuário
exports.createUser = async (req, res) => {
    try {
        // Pega apenas os dados de identificação do corpo (nome e email)
        const { nome, email } = req.body; 

        // Cria o objeto do novo usuário, definindo os valores padrão no servidor
        const novoUsuario = {
            nome,
            email,
            nivel: 0,   // O servidor define o valor inicial
            pontos: 0   // O servidor define o valor inicial
        };

        const docRef = await db.collection("usuarios").add(novoUsuario);
        
        res.status(200).json({ 
            id: docRef.id, 
            message: "Usuário criado!" 
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