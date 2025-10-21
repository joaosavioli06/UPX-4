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

// Rotas de denúncias (GET e POST devem ser protegidas)
router.get("/denuncias", protect, DenunciaController.getDenuncias);
router.post("/denuncias", protect, DenunciaController.createDenuncia); 

// Rotas de deslocamentos (GET e POST devem ser protegidas)
router.get("/deslocamentos", protect, DeslocamentoController.getDeslocamentos);
router.post("/deslocamentos", protect, DeslocamentoController.createDeslocamento);

// Teste de conexão
router.get("/test", TestController.testConnection);

module.exports = router;