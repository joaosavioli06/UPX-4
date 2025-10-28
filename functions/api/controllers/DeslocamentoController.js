const {db} = require("../config/firebase");

// Criar deslocamento
exports.createDeslocamento = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({error: "Usuário não autenticado."});
    }

    const novoDeslocamento = {
      ...data,
      data_horario: new Date(), // O servidor define a data e hora
      usuario: db.doc(`usuarios/${userId}`), // Referência do usuário
    };

    const docRef = await db.collection("deslocamentos").add(novoDeslocamento);

    res.status(201).json({id: docRef.id, message: "Deslocamento registrado!"});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Listar deslocamentos
exports.getDeslocamentos = async (req, res) => {
  try {
    const snapshot = await db.collection("deslocamentos").get();

    const deslocamentos = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Formatação do Timestamp (data_horario)
      if (data.data_horario && typeof data.data_horario.toDate === "function") {
        const dataObjeto = data.data_horario.toDate();

        const dataFormatada = dataObjeto.toLocaleDateString("pt-BR") + " " +
          dataObjeto.toLocaleTimeString("pt-BR");

        return {
          id: doc.id,
          ...data,
          data_horario: dataFormatada, // Retorna a string formatada
        };
      }

      return {id: doc.id, ...data};
    });

    res.json(deslocamentos);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
