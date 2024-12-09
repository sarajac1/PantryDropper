import React from 'react'
import { useInventory } from '../contexts/InventoryContext';
import '../styles/App.css'; 


const App = () => {
  const { inventory, addItem, removeItem, error } = useInventory();

  const handleAddItem = () => {
    const itemName = prompt('Enter item name:');
    const quantity = prompt('Enter quantity:');
    if (itemName && quantity) {
      addItem(itemName, quantity);
    }
  };

  return (
    <div>
      <h1>Inventory App</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleAddItem}>Add Item</button>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.item_name} - {item.quantity}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;