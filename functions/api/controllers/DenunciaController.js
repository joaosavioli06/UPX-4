const { db } = require("../config/firebase"); 
const denunciaSchema = require("../validation/denuncia"); // Importa o Schema
const { FieldValue } = require("firebase-admin/firestore"); // Importa FieldValue para soma atômica

// PONTO FIXO: Quantos pontos uma denúncia vale na criação
const PONTOS_POR_DENUNCIA = 5; 

// Criar denúncia
exports.createDenuncia = async (req, res) => {
    try {
        // 1. VALIDAÇÃO DE DADOS (Joi)
        const { error, value } = denunciaSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                error: `Erro de validação: ${error.details[0].message}` 
            });
        }
        
        const data = value; 
        const userId = req.userId; // ID do usuário do middleware (Token)

        if (!userId) {
             // Esta checagem é redundante se o middleware estiver funcionando, mas é boa prática
             return res.status(401).json({ error: "Usuário não autenticado." });
        }
        
        const userRef = db.collection('usuarios').doc(userId);

        // 2. TRANSAÇÃO ATÔMICA
        let denunciaId;

        await db.runTransaction(async (transaction) => {
            
            // A. Checagem de Referência: Garante que o perfil do usuário existe no Firestore
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                // Lança um erro customizado que será capturado pelo bloco catch
                throw new Error("Perfil de usuário não encontrado no banco de dados."); 
            }

            // B. Objeto da Denúncia
            const novaDenuncia = {
                ...data, 
                data_criacao: new Date(),
                status: "pendente",
                usuario: userRef, // Referência do usuário logado
                pontos_ganhos: PONTOS_POR_DENUNCIA 
            };

            // C. CRIA A DENÚNCIA (na transação)
            const denunciaRef = db.collection("denuncias").doc();
            transaction.set(denunciaRef, novaDenuncia);

            // D. ATUALIZA OS PONTOS DO USUÁRIO (na transação)
            transaction.update(userRef, {
                pontos: FieldValue.increment(PONTOS_POR_DENUNCIA) 
            });
            
            denunciaId = denunciaRef.id;

        }); // Fim da Transação.

        // 3. SUCESSO
        res.status(201).json({ 
            id: denunciaId, 
            message: "Denúncia criada e pontos creditados!",
            pontos_ganhos: PONTOS_POR_DENUNCIA
        });
        
    } catch (error) {
        console.error("Erro na criação da denúncia/transação:", error.message);
        
        // TRATAMENTO DE ERROS APRIMORADO
        
        // Erros de Regra de Negócio/Referência (403 Forbidden)
        if (error.message.includes('Perfil de usuário não encontrado')) {
            return res.status(403).json({ error: error.message });
        }
        
        // Erros Genéricos ou de Transação (500 Internal Server Error)
        res.status(500).json({ error: "Erro interno do servidor. Falha ao processar a denúncia." });
    }
};

// Listar todas as denúncias (mantém a formatação de data)
exports.getDenuncias = async (req, res) => {
    try {
        const snapshot = await db.collection("denuncias").get();
        
        const denuncias = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // Formatação do Timestamp (data_criacao)
            if (data.data_criacao && typeof data.data_criacao.toDate === 'function') {
                const dataObjeto = data.data_criacao.toDate();
                const dataFormatada = dataObjeto.toLocaleDateString('pt-BR');
                
                return { 
                    id: doc.id, 
                    ...data,
                    data_criacao: dataFormatada 
                };
            }
            
            return { id: doc.id, ...data };
        });
        
        res.json(denuncias);
    } catch (error) {
        // Usa o tratamento de erro básico de leitura, pois não é transacional
        res.status(500).json({ error: error.message });
    }
};