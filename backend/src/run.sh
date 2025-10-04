#!/bin/bash

# Ativa o ambiente virtual
source venv/Scripts/activate

# Define a variável e executa o servidor
FLASK_APP=app.py flask run