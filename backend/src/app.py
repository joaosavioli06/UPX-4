from flask import Flask, jsonify

# Importa o objeto 'db' do seu novo arquivo 'database.py'
from .database import db

# Cria a sua aplicação Flask
app = Flask(__name__)

# ... (Seu código de rotas continua aqui) ...

@app.route('/')
def home():
    return jsonify({"message": "Bem-vindo ao backend do EcoTrek!"})

if __name__ == '__main__':
    app.run(debug=True)