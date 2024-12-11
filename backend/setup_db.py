import sqlite3
import os 

# Funktion som skapar SQLite databas
def create_db():
  print("Current working directory:", os.getcwd())
  connection = sqlite3.connect('pantry.db')
  cursor = connection.cursor()

  cursor.execute('''
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        quantity INTEGER NOT NULL
    )
    ''')

# Lägger till nya kolumner 
  try:
    cursor.execute('ALTER TABLE inventory ADD COLUMN expiration_date TEXT')
  except sqlite3.OperationalError:
    print("column 'expiration_date' already exists.")
  
  try:
    cursor.execute('ALTER TABLE inventory ADD COLUMN description TEXT')
  except sqlite3.OperationalError:
    print("Column 'description' already exists.")

  # Sparar ändringar i databasen
  connection.commit()
  connection.close()

  
# Programmet körs endast om script exekverats direkt 
if __name__ == '__main__':
  create_db()