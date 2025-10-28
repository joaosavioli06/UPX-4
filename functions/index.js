const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

// Importa suas rotas
const routes = require("./api/routes");
app.use(routes);

// Exporta como uma Function HTTPS
exports.api = functions.https.onRequest(app);
