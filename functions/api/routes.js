const express = require("express");
const router = express.Router();

// Importa os controladores
const UserController = require("./controllers/UserController");
const DenunciaController = require("./controllers/DenunciaController");
const DeslocamentoController = require("./controllers/DeslocamentoController");
const TestController = require("./controllers/TestController");

// Rotas de usuários
router.get("/usuarios", UserController.getUsers);
router.post("/usuarios", UserController.createUser);

// Rotas de denúncias
router.get("/denuncias", DenunciaController.getDenuncias);
router.post("/denuncias", DenunciaController.createDenuncia);

// Rotas de deslocamentos
router.get("/deslocamentos", DeslocamentoController.getDeslocamentos);
router.post("/deslocamentos", DeslocamentoController.createDeslocamento);

// Teste de conexão
router.get("/test", TestController.testConnection);

module.exports = router;
