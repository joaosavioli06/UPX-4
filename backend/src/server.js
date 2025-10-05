// Importe as bibliotecas necessárias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importe o seu banco de dados
const { db } = require('./database.js');

// Crie a sua aplicação Express
const app = express();
const port = 3000;

// O seu servidor deve ser capaz de lidar com requisições com o corpo JSON
app.use(bodyParser.json());

// O seu servidor deve ser capaz de lidar com requisições com o corpo URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// O seu servidor deve ser capaz de lidar com requisições de diferentes domínios
app.use(cors());

// Seus endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bem-vindo ao back-end do EcoTrek!'
  });
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});