from flask import Flask, jsonify, request
from flask_cors import CORS

import sqlite3

# Initialiserar Flask
app = Flask(__name__)
CORS(app)


def connect_db():
    conn = sqlite3.connect('pantry.db')
    conn.row_factory = sqlite3.Row
    return conn

# Hem route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to PantryDropper."})

# Endpoint för att lägga till vara
@app.route('/api/add_item', methods=['POST'])
def add_item():
    data = request.get_json()
    
    # Validerar input
    item_name = data.get('item_name')
    quantity = data.get('quantity')
    expiration_date = data.get('expiration_date', 'unknown')
    description = data.get('description', None)
    
    if not item_name or quantity is None:
        return jsonify({"error": "Item name and quantity are required"}), 400
        
    try:
        connection = connect_db()
        cursor = connection.cursor()
        
        cursor.execute(
            '''
            INSERT INTO inventory (item_name, quantity, expiration_date, description)
            VALUES (?, ?, ?, ?)
            ''',
            (item_name, quantity, expiration_date, description)
        )
        
        connection.commit()

        new_id = cursor.lastrowid; 
        
        cursor.execute('SELECT * FROM inventory WHERE id = ?', (new_id,))
        new_item = cursor.fetchone()
        
        connection.close()
        
        return jsonify(dict(new_item)), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

# Endpoint för att läsa varor från inventory 
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    try:
        connection = connect_db()
        cursor = connection.cursor()
        
        cursor.execute('SELECT * FROM inventory')
        rows = cursor.fetchall()
        
        # Convert rows to list of dictionaries
        inventory = [dict(row) for row in rows]
        
        connection.close()
        return jsonify(inventory)
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

# Endpoint för att redigera varor 
@app.route('/api/update_item/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        data = request.get_json()
        
        # Hämtar värden
        new_name = data.get('item_name')
        new_quantity = data.get('quantity')
        new_expiration_date = data.get('expiration_date')
        new_description = data.get('description')
        
        # Validerar input
        if all(value is None for value in [new_name, new_quantity, new_expiration_date, new_description]):
            return jsonify({"error": "Please provide at least one field to update"}), 400
            
        connection = connect_db()
        cursor = connection.cursor()
        
        # Skapar "update" query
        update_parts = []
        params = []
        
        if new_name is not None:
            update_parts.append('item_name = ?')
            params.append(new_name)
            
        if new_quantity is not None:
            update_parts.append('quantity = ?')
            params.append(new_quantity)

        if new_expiration_date is not None:
            update_parts.append('expiration_date = ?')
            params.append(new_expiration_date)
        
        if new_description is not None:
            update_parts.append('description = ?')
            params.append(new_description)
            
        # Add item_id to params
        params.append(item_id)
        
        # Construct final query
        query = f'''
            UPDATE inventory 
            SET {', '.join(update_parts)}
            WHERE id = ?
        '''
        
        cursor.execute(query, params)
        
        # Om inga rader modifierats returneras error 404: not found 
        if cursor.rowcount == 0:
            connection.close()
            return jsonify({"error": "Item not found"}), 404
        
        cursor.execute('SELECT * FROM inventory WHERE id = ?', (item_id,))
        updated_item = cursor.fetchone()
            
        connection.commit()
        connection.close()

        return jsonify(dict(updated_item)), 200

        
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

# Endpoint för att ta bort vara från inventory
@app.route('/api/delete_item/<int:item_id>', methods = ['DELETE'])
def delete_item(item_id):
    try:
        connection = connect_db()
        cursor = connection.cursor()

        # Ta bort varan
        cursor.execute('DELETE FROM inventory WHERE id = ?', (item_id,))

        if cursor.rowcount == 0:
            connection.close()
            return jsonify({"error": "Item not found"}), 404
        
        connection.commit()
        connection.close()

        return jsonify({"message": "Item deleted successfully"}), 200
    
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    
    
@app.route('/api/get_item/<int:item_id>', methods=['GET'])
def get_item(item_id):
    try:
        connection = connect_db()
        cursor = connection.cursor()
        
        cursor.execute('SELECT * FROM inventory WHERE id = ?', (item_id,))
        item = cursor.fetchone()
        
        connection.close()
        
        if item is None:
            return jsonify({"error": "Item not found"}), 404
        
        return jsonify(dict(item))
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

        
    


# Om skriptet körs direkt så startas Flask med debugging
if __name__ == '__main__':
    app.run(debug=True)