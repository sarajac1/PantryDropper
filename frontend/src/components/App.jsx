import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import '../styles/App.css';

const App = () => {
  const { inventory, addItem, removeItem, error } = useInventory();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim() && quantity.trim()) {
      addItem(itemName, quantity, expirationDate || 'unknown', description)
        .then(() => {
          console.log('Item added successfully.');
          setItemName('');
          setQuantity('');
          setExpirationDate('');
          setDescription('');
        })
        .catch((error) => {
          console.error('Error adding item:', error);
        });
    } else {
      console.error('Item name and quantity are required.');
    }
  };

  return (
    <div className="container">
      <h1>Inventory App</h1>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {/* Add Item Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expirationDate">Expiration Date:</label>
          <input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">Add Item</button>
      </form>

      {/* Inventory List */}
      <ul className="inventory-list">
        {inventory.map((item) => (
          <li key={item.id} className="inventory-item">
            <span>
              {item.item_name} - {item.quantity} - Expiry: {item.expiration_date || 'unknown'}
              {item.description && ` (${item.description})`}
            </span>
            <button onClick={() => removeItem(item.id)} className="remove-btn">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

