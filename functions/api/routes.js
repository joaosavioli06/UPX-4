const express = require("express");
const router = express.Router();

const { protect } = require("./middlewares/authMiddleware"); 

// Importa os controladores
const UserController = require("./controllers/UserController");
const DenunciaController = require("./controllers/DenunciaController");
const DeslocamentoController = require("./controllers/DeslocamentoController");
const TestController = require("./controllers/TestController");

// Rotas de usuários
router.get("/usuarios", UserController.getUsers); 
// Criação de usuário (POST) deve ser protegida
router.post("/usuarios", protect, UserController.createUser); 
// Rota para buscar o perfil do usuário logado
router.get("/usuarios/me", authMiddleware.protect, UserController.getProfile); // Adicione a nova rota e o Middleware

// Rotas de denúncias (GET e POST devem ser protegidas)
router.get("/denuncias", protect, DenunciaController.getDenuncias);
router.post("/denuncias", protect, DenunciaController.createDenuncia); 
router.get("/denuncias/meu-historico", authMiddleware.protect, DenunciaController.getUserDenuncias); // Adicione a rota para histórico
router.patch("/denuncias/:id/status", DenunciaController.updateDenunciaStatus); // Nova rota de atualização || ADMIN UPDATE DENÚNCIA

// Rotas de deslocamentos (GET e POST devem ser protegidas)
router.get("/deslocamentos", protect, DeslocamentoController.getDeslocamentos);
router.post("/deslocamentos", protect, DeslocamentoController.createDeslocamento);

// Teste de conexão
router.get("/test", TestController.testConnection);

module.exports = router;