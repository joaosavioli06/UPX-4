# Arquivo principal onde o Flask será inicializado. Ele importará as rotas e os
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify

# O caminho para o seu arquivo JSON da chave privada
# Renomeie para o nome do seu arquivo, ex: 'ecotrek-firebase-key.json'
cred = credentials.Certificate('caminho/para/seu/arquivo.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

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