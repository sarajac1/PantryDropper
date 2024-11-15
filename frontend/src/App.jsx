import { useEffect, useState } from 'react'


import './App.css'

// Funktion för att uppdatera inventory, initialiseras som en tom array 
function App() {
  const [inventory, setInventory] = useState([]); 

// Hämtar inventory från Flask API:t
  useEffect(() => {
    fetch('/api/inventory')
      // Parse:ar JSON 
      .then((response) => response.json())
      // Uppdaterar inventory 
      .then((data) => setInventory(data))
      .catch((error) => console.error('Error fetching inventory', error));
  }, []);

  return (
    <div>
      <h1>Pantry Inventory</h1>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.item_name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
