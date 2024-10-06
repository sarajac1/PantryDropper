from flask import Flask, jsonify, request
import sqlite3

# Initialiserar Flask app 
app = Flask(__name__)

# Funktion för att hantera routes, json format  
def home():
  return jsonify({"message": "Welcome to PantryDropper."})

# Startar Flask med debugging 
if __name__ == '__main__':
  app.run(debug=True)