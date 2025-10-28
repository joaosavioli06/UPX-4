const express = require("express");
// CORRIGIDO: Variável renomeada de 'router' para 'routes' para evitar 'new-cap'
// eslint-disable-next-line new-cap
const routes = express.Router();

const {protect} = require("./middlewares/authMiddleware");

// Importa os controladores
const UserController = require("./controllers/UserController");
const DenunciaController = require("./controllers/DenunciaController");
const DeslocamentoController = require("./controllers/DeslocamentoController");
const TestController = require("./controllers/TestController");

// Rotas de usuários
// Quebra de linha e vírgula pendente para satisfazer o max-len
routes.get("/usuarios",
    protect,
    UserController.getUsers,
);
// Criação de usuário (POST) deve ser protegida
routes.post("/usuarios",
    protect,
    UserController.createUser,
);
// Rota para buscar o perfil do usuário logado
routes.get("/usuarios/me",
    protect,
    UserController.getProfile,
);

// Rotas de denúncias (GET e POST devem ser protegidas)
routes.get("/denuncias",
    protect,
    DenunciaController.getDenuncias,
);
routes.post("/denuncias",
    protect,
    DenunciaController.createDenuncia,
);
routes.get("/denuncias/meu-historico",
    protect,
    DenunciaController.getUserDenuncias,
);
routes.patch("/denuncias/:id/status",
    protect,
    DenunciaController.updateDenunciaStatus,
);

// Rotas de deslocamentos (GET e POST devem ser protegidas)
routes.get("/deslocamentos",
    protect,
    DeslocamentoController.getDeslocamentos,
);
routes.post("/deslocamentos",
    protect,
    DeslocamentoController.createDeslocamento,
);

// Teste de conexão
routes.get("/test", TestController.testConnection);

module.exports = routes; // Exportando a variável 'routes'
