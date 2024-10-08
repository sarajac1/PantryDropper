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

  # Sparar ändringar i databasen
  connection.commit()
  connection.close()

  
# Programmet körs endast om script exekverats direkt 
if __name__ == '__main__':
  create_db()