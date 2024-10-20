from flask import Flask, jsonify, request
import sqlite3

# Initialiserar Flask app 
app = Flask(__name__)

def connect_db ():
  return sqlite3.connect('pantry.db')

# Funktion för att hantera routes, json format 
@app.route('/') 
def home():
  return jsonify({"message": "Welcome to PantryDropper."})

# Endpoint för att lägga till vara
@app.route('/add_item', methods=['POST'])
def add_item():
  data = request.get_json()

  # Validerar input 
  item_name = data.get('item_name')
  quantity = data.get('quantity')

  if not item_name or quantity is None:
    return jsonify({"error": "Item name and quantity are required"}), 400 

  connection = sqlite3.connect('pantry.db')
  cursor = connection.cursor()

  cursor.execute('''
    INSERT INTO inventory (item_name, quantity)
    VALUES (?, ?)
    ''', (item_name, quantity))
  
  connection.commit()
  connection.close()

  return jsonify({"message": "Item added successfully"}), 201 


# Om skriptet körs direkt så startas Flask med debugging  
if __name__ == '__main__':
  app.run(debug=True)