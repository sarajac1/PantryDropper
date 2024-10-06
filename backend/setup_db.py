import sqlite3

# Funktion som skapar SQLite databas
def create_db():
  connection = sqlite3.connect('pantry.db')
  cursor = connection.cursor()

  cursor.execute('''
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY,
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