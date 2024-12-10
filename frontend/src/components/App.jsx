import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import '../styles/App.css';

const App = () => {
  const { inventory, addItem, removeItem, error } = useInventory();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim() && quantity.trim()) {
      addItem(itemName, quantity)
        .then(() => {
          console.log('Item added successfully.');
          setItemName('');
          setQuantity('');
        })
        .catch((error) => {
          console.error('Error adding item:', error);
        });
    } else {
      console.error('Both item name and quantity are required.');
    }
  };

  return (
    <div>
      <h1>Inventory App</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {/* Add Item Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="itemName">Item Name:</label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <button type="submit">Add Item</button>
      </form>

      {/* Inventory List */}
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
