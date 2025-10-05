const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db } = require('./src/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Bem-vindo ao back-end do EcoTrek!'
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});