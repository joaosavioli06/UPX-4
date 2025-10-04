# Arquivo principal onde o Flask será inicializado. Ele importará as rotas e os
from flask import Flask, jsonify

# 1. Cria a sua aplicação Flask
app = Flask(__name__)

# 2. Cria o seu primeiro "endpoint" (rota)
# A rota é o endereço que o front-end irá acessar
@app.route('/')
def home():
    # 3. Retorna uma mensagem como resposta
    return jsonify({"message": "Bem-vindo ao backend do EcoTrek!"})

# 4. Executa a aplicação
if __name__ == '__main__':
    app.run(debug=True)