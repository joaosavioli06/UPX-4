import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# O nome da variável de ambiente que você configurou no Firebase
FIREBASE_ENV_VAR = 'FIREBASE_ADMIN_KEY'

# Tenta pegar a chave da variável de ambiente.
# Se falhar, usa o arquivo local para o desenvolvimento.
try:
    firebase_key_string = os.environ[FIREBASE_ENV_VAR]
    cred = credentials.Certificate(json.loads(firebase_key_string))
except (KeyError, json.JSONDecodeError):
    # Se a variável de ambiente não estiver definida, usa o arquivo local.
    # Lembre-se de não comitar este arquivo no GitHub.
    # Certifique-se de que o caminho está correto, ex: '../sua-chave.json'
    cred = credentials.Certificate('C:Users/joao_/OneDrive/Documentos/ecotrek-802a6-firebase-adminsdk-fbsvc-25eb6b89f4.json')

firebase_admin.initialize_app(cred)
db = firestore.client()