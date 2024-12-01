import { useEffect, useState } from 'react'


import './App.css'

// Funktion för att uppdatera inventory, initialiseras som en tom array 
function App() {
  const [inventory, setInventory] = useState([]); 
  // Värdet av itemName och quantity blir innehållet av användarens inmatade värden 
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

// Hämtar inventory från Flask API:t
  useEffect(() => {
    fetch('/api/inventory')
      // Parse:ar JSON 
      .then((response) => response.json())
      // Uppdaterar inventory 
      .then((data) => setInventory(data))
      .catch((error) => console.error('Error fetching inventory', error));
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add_item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: itemName, quantity: parseInt(quantity) }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setInventory([...inventory, newItem]);
        // Rensar fälten
        setItemName('');
        setQuantity('');
      } else {
        console.error('Error adding item:', await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



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

      <h2>Add a new item</h2>
      <form onSubmit={addItem}>
        <div>
        <label>Item Name: </label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add item</button>
      </form>
    </div>
  );
}

export default App
