const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("🚀 API do projeto EcoTrek está rodando!");
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
