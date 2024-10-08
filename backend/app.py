from flask import Flask, jsonify, request
import sqlite3

# Initialiserar Flask app 
app = Flask(__name__)

def connect_db ():
  return sqlite3.connect('pantry.db')

# Funktion för att hantera routes, json format  
def home():
  return jsonify({"message": "Welcome to PantryDropper."})

def add_item():
  

# Om skriptet körs direkt så startas Flask med debugging  
if __name__ == '__main__':
  app.run(debug=True)