from flask import Flask, jsonify, request

import sqlite3

# Initialiserar Flask
app = Flask(__name__)


def connect_db():
    conn = sqlite3.connect('pantry.db')
    conn.row_factory = sqlite3.Row
    return conn

# Hem route
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
        
    try:
        connection = connect_db()
        cursor = connection.cursor()
        
        cursor.execute('''
            INSERT INTO inventory (item_name, quantity)
            VALUES (?, ?)
        ''', (item_name, quantity))
        
        connection.commit()
        connection.close()
        
        return jsonify({"message": "Item added successfully"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

# Endpoint för att läsa varor från inventory 
@app.route('/inventory', methods=['GET'])
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
@app.route('/update_item/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        data = request.get_json()
        
        # Hämtar värden
        new_name = data.get('item_name')
        new_quantity = data.get('quantity')
        
        # Validerar input
        if new_name is None and new_quantity is None:
            return jsonify({"error": "Please provide at least item name or quantity"}), 400
            
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
            
        connection.commit()
        connection.close()
        
        return jsonify({
            "message": "Item updated successfully",
            "item_id": item_id,
            "updates": {
                key: value for key, value in {
                    'item_name': new_name,
                    'quantity': new_quantity
                }.items() if value is not None
            }
        }), 200
        
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

# Endpoint för att ta bort vara från inventory
@app.route('/delete_item/<int:item_id>', methods = ['DELETE'])
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

        
    


# Om skriptet körs direkt så startas Flask med debugging
if __name__ == '__main__':
    app.run(debug=True)